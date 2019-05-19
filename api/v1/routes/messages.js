const Controller = require("../controllers/messages");

module.exports = (router) => {
    router.get("/messages/generateOtp", Controller.generateOtp);

    router.get("/messages", Controller.listMessages);
};
