const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
    messageContent: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    contact: {
        type: Schema.Types.ObjectId,
        ref: "Contact",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    usePushEach: true
});


mongoose.model("Message", messageSchema);
