import { Server } from "socket.io";
import * as chatService from "./chat/chat.service.js";
import { socketAuth } from "./middlewares/socket.auth.middleware.js";

export const runSocket = (server) => {
    const io = new Server(server, { cors: { origin: "*" } });

    io.use(socketAuth);

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("sendMessage", chatService.sendMessage(socket, io));

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};
