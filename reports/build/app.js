"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config/config");
const Report_1 = __importDefault(require("./routes/Report"));
const IncompleteReport_1 = __importDefault(require("./routes/IncompleteReport"));
const app = (0, express_1.default)();
const port = 3004;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
mongoose_1.default
    .connect(config_1.config.mongo.url, { retryWrites: true, w: "majority" })
    .then(() => {
    console.log("Connected");
})
    .catch((err) => {
    console.log(config_1.config.mongo.url);
    console.log("Not Connected");
});
app.use(express_1.default.json());
app.use("/reports", Report_1.default);
app.use("/incompletereports", IncompleteReport_1.default);
