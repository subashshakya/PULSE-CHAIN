"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReport = exports.updateReport = exports.checkIfReportExists = exports.queryReportById = exports.createReport = exports.queryAllReports = void 0;
const connection_1 = require("../connection");
const utf8Decoder = new TextDecoder();
const queryAllReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reportsBytes = yield connection_1.Connection.reportContract.evaluateTransaction('queryAllReports');
    const reportJson = utf8Decoder.decode(reportsBytes);
    const reports = JSON.parse(reportJson);
    console.log(`All Reports: ${reports}`);
    res.json(reports);
});
exports.queryAllReports = queryAllReports;
const createReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { reportId, report } = req.body;
    console.log(reportId);
    console.log(report);
    if (!reportId || !report) {
        console.log("Request is invalid");
        return res.status(400).json({ message: "Bad Request: Missing report id or report details" });
    }
    try {
        const reportBytes = yield connection_1.Connection.reportContract.submitTransaction('createReport', reportId, JSON.stringify(Object.assign({}, report)));
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createReport = createReport;
const queryReportById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reportId } = req.params;
    console.log(`Requested to query report with ID: ${reportId}`);
    try {
        const checkReportBytes = yield connection_1.Connection.reportContract.evaluateTransaction('checkIfReportExists', reportId);
        const checkReportJson = utf8Decoder.decode(checkReportBytes);
        const exists = JSON.parse(checkReportJson);
        if (exists) {
            const reportBytes = yield connection_1.Connection.reportContract.evaluateTransaction('queryReportById', reportId);
            const reportJson = utf8Decoder.decode(reportBytes);
            const report = JSON.parse(reportJson);
            console.log(`Report of ID: ${reportId}: ${report}`);
            res.status(200).json(report);
        }
        else {
            console.log("Report does not exists");
            res.status(404).json({ message: "Report does not exist" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.queryReportById = queryReportById;
const checkIfReportExists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reportId } = req.params;
    try {
        const reportBytes = yield connection_1.Connection.reportContract.evaluateTransaction('checkIfReportExists', reportId);
        const reportJson = utf8Decoder.decode(reportBytes);
        const report = JSON.parse(reportJson);
        if (report) {
            console.log("Report exists");
            res.status(200).json(report);
        }
        else {
            console.log("Report does not exists");
            res.status(404).json({ message: `Report of id: ${reportId} does not exist` });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.checkIfReportExists = checkIfReportExists;
const updateReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reportId, report } = req.body;
    if (!reportId || !report) {
        console.log("Report id or report details missing");
        return res.status(400).json({ message: "Request body invalid" });
    }
    const reportBytes = yield connection_1.Connection.reportContract.submitTransaction('updateReport', reportId, JSON.stringify(Object.assign({}, report)));
    const reportJson = utf8Decoder.decode(reportBytes);
    const reportObj = JSON.parse(reportJson);
    res.json(reportObj);
});
exports.updateReport = updateReport;
const deleteReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reportId } = req.params;
    yield connection_1.Connection.reportContract.submitTransaction('deleteReport', reportId);
    res.status(404).json({ message: 'Deleted the report' });
});
exports.deleteReport = deleteReport;
