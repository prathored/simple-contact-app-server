const Controller = require("../controllers/contacts");

module.exports = (router) => {
    router.post("/contacts", Controller.generateFakeContacts);

    router.get("/contacts", Controller.listContacts);

    router.get("/contacts/:contactId", Controller.getContact);

    router.post("/contacts/:contactId/message", Controller.sendMessage);
};
