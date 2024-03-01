"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controllers_1 = require("../controllers/report-controllers");
const ReportRoutes = (0, express_1.Router)();
const cors = require('cors');
let corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
};
ReportRoutes.get("/", cors(corsOptions), report_controllers_1.queryAllReports);
ReportRoutes.post("/create-report", cors(corsOptions), report_controllers_1.createReport);
ReportRoutes.get("/:reportId", cors(corsOptions), report_controllers_1.queryReportById);
ReportRoutes.get("/check/:reportId", cors(corsOptions), report_controllers_1.checkIfReportExists);
ReportRoutes.put("/update/:reportId", cors(corsOptions), report_controllers_1.updateReport);
ReportRoutes.delete("/delete/reportId", cors(corsOptions), report_controllers_1.deleteReport);
exports.default = ReportRoutes;
