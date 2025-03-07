import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    message: { type: String, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [messagesSchema]
},
    { timestamps: true });

const ChatModel = mongoose.model('Chat', chatSchema);

export default ChatModel;