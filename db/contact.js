const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true
    },
    mobileNumber: {
        type: String,
        required: true
    }
}, {
    usePushEach: true
});


mongoose.model("Contact", contactSchema);
