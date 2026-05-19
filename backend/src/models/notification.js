const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    type: {
        type: String,
        enum: ["Invite"],
        required: true
    },
    message: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})

const Notification = mongoose.model("notifications", notificationSchema)

module.exports = Notification