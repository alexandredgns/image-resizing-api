"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const app = (0, server_1.createServer)();
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
