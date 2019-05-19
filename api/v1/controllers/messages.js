const mongoose = require("mongoose");
const Message = mongoose.model("Message");
const Contact = mongoose.model("Contact");
const randomstring = require("randomstring");


module.exports = {
    generateOtp: (req, res) => {
        console.log("generateOtp");
        const otp = randomstring.generate({length: 6, charset: "numeric"});
        return res.status(200).json({
            otp: otp
        });
    },

    listMessages: (req, res) => {
        console.log("listMessages");
        Message.find()
            .sort({createdAt: -1})
            .limit(10)
            .skip(req.query.page * 10)
            .populate([
                {
                    path: "contact",
                    model: "Contact"
                }
            ])
            .then((messages) => {
                return res.status(200).json({
                    messages: messages
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
