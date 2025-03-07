import * as dbService from "../../../DB/dbService.js";
import ChatModel from "../../../DB/Models/chat.model.js";
import UserModel from "../../../DB/Models/user.model.js";

export const sendMessage = function (socket, io) {
    return async ({ message, receiverId }) => {
        receiverId = receiverId.toString();

        const user = await dbService.findOne({
            model: UserModel,
            filter: { _id: receiverId, deletedAt: null }
        });

        if (!user) {
            console.error("❌ User not found");
            return;
        }

        let chat = await dbService.findOne({
            model: ChatModel,
            filter: { senderId: socket.id, receiverId: user._id }
        });

        if (chat) {
            chat = await dbService.findByIdAndUpdate({
                model: ChatModel,
                id: chat._id,
                data: { messages: [...chat.messages, { message, senderId: socket.id }] },
            });
        } else {
            chat = await dbService.create({
                model: ChatModel,
                data: {
                    senderId: socket.id,
                    receiverId: user._id,
                    messages: [{ message, senderId: socket.id }]
                },
            });
        }

        io.to(receiverId).emit("message", { message, senderId: socket.id });
    };
};


