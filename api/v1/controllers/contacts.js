const mongoose = require("mongoose");
const Contact = mongoose.model("Contact");
const Message = mongoose.model("Message");
const fs = require("fs-extra");
const faker = require("faker");
const randomstring = require("randomstring");
const Promise = require("bluebird");
const Nexmo = require("nexmo");
const nexmo = new Nexmo({
    apiKey: "your_api_key",
    apiSecret: "your_api_secret"
});


module.exports = {
    generateFakeContacts: (req, res) => {
        console.log("generateFakeContacts");
        const contacts = [];
        for (let i = 0; i < 100; i++) {
            contacts.push({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                mobileNumber: "+91" + randomstring.generate({length: 10, charset: "numeric"})
            });
        }
        fs.writeJson("./seed.json", contacts, (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    error: "Unable to write json"
                });
            }
            fs.readJson("./seed.json", (error, data) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({
                        error: "Unable to read json"
                    });
                }
                let promises = [];
                data.forEach((contact) => {
                    let newContact = new Contact({
                        firstName: contact.firstName,
                        lastName: contact.lastName,
                        mobileNumber: contact.mobileNumber
                    });
                    promises.push(newContact.save());
                });
                Promise.all(promises)
                    .then((result) => {
                        return res.status(201).json({
                            result: result
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                        return res.status(500).json({
                            error: error
                        });
                    });
            });
        });
    },

    listContacts: (req, res) => {
        console.log("listContacts");
        console.log("page is: ", req.query.page);
        Contact.find()
            .limit(10)
            .skip(req.query.page * 10)
            .then((contacts) => {
                return res.status(200).json({
                    contacts: contacts
                });
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).json({
                    error: "Internal Server error"
                });
            });
    },

    getContact: (req, res) => {
        console.log("getContact");
        Contact.findById(req.params.contactId)
            .then((contact) => {
                return res.status(200).json({
                    contact: contact
                });
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).json({
                    error: "Internal Server Error"
                });
            });
    },

    sendMessage: (req, res) => {
        console.log("sendMessage");
        if (!req.body.message) {
            return res.status(400).json({
                error: "Please type your message"
            });
        }
        if (!req.body.otp) {
            return res.status(400).json({
                error: "OTP is required"
            });
        }
        Contact.findById(req.params.contactId)
            .then((contact) => {
                const from = "917302857717";
                const to = contact.mobileNumber;
                const text = req.body.message + "Hi. Your OTP is: " + req.body.otp;
                nexmo.message.sendSms(from, to, text, (err, responseData) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            error: "Unable to send message"
                        });
                    } else {
                        console.log(responseData);
                        if (responseData.messages[0]['status'] === "0") {
                            console.log("Message sent successfully.");
                            const message = new Message({
                                messageContent: req.body.message,
                                otp: req.body.otp,
                                contact: contact._id
                            });
                            message.save()
                                .then((message) => {
                                    return res.status(200).json({
                                        message: message
                                    });
                                })
                                .catch((error) => {
                                    console.log(error);
                                    return res.status(500).json({
                                        error: "Internal Server Error"
                                    });
                                });
                        } else {
                            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                            return res.status(500).json({
                                error: "Unable to send message"
                            });
                        }
                    }
                });
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).json({
                    error: "Internal Server Error"
                });
            });
    }
};
