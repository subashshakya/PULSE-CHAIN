"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connection_1 = require("./connection");
const report_routes_1 = __importDefault(require("./routes/report-routes"));
const app = (0, express_1.default)();
const port = 3000;
new connection_1.Connection().init();
app.use('/reports', report_routes_1.default);
app.get('/', (req, res) => {
    res.send('Connection Established');
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
