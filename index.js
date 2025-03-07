import express from "express";
import bootstrap from "./src/app.server.js";
import { runSocket } from "./src/Modules/Socket-io/index.js";

const app = express();
const port = process.env.PORT || 5000;

await bootstrap(app, express);

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const io = runSocket(server); // Store io instance

app.set("io", io); // Attach io to app
