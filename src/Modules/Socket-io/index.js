import { Server } from "socket.io";
import * as chatService from "./chat/chat.service.js";

export const runSocket = (server) => {
    const io = new Server({ cors: { origin: "*" } });

    io.on("connection", (socket) => {

        socket.on("sendMessage", chatService.sendMessage(socket, io));

        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
};