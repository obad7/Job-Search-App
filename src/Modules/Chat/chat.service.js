import * as dbService from "../../DB/dbService.js";
import ChatModel from "../../DB/Models/chat.model.js";
import UserModel from "../../DB/Models/user.model.js";


export const getChat = async (req, res) => {
    const { receiverId } = req.params;

    const user = await dbService.findOne({
        model: UserModel,
        filter: { _id: req.user._id, deletedAt: null }
    });
    if (!user) return next(new Error("User not found", { cause: 400 }));


    const chat = await dbService.findOne({
        model: ChatModel,
        filter: { senderId: user._id, receiverId: receiverId }
    });
    if (!chat) return next(new Error("Chat not found", { cause: 400 }));

    return res.status(200).json({ success: true, data: chat });
};


export const sendMessage = async (req, res, next) => {
    const { receiverId } = req.params;
    const { message } = req.body;

    const user = await dbService.findOne({
        model: UserModel,
        filter: { _id: receiverId, deletedAt: null }
    });
    if (!user) return next(new Error("User not found", { cause: 400 }));

    const chat = await dbService.findOne({
        model: ChatModel,
        filter: { senderId: req.user._id, receiverId: user._id }
    });

    if (chat) {
        await dbService.findByIdAndUpdate({
            model: ChatModel,
            id: chat._id,
            data: { messages: [...chat.messages, { message, senderId: req.user._id }] },
            options: { new: true, runValidators: true }
        });
    } else {
        await dbService.create({
            model: ChatModel,
            data: {
                senderId: req.user._id, receiverId: user._id, messages: [{
                    message, senderId: req.user._id
                }]
            },
            options: { new: true, runValidators: true }
        });
    }

    const populatedChat = await dbService.findOne({
        model: ChatModel,
        filter: { senderId: req.user._id, receiverId: user._id },
        populate: ["senderId", "receiverId"]
    });

    return res.status(200).json({ success: true, data: { populatedChat } });
}
