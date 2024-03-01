import { Router } from "express";
import { queryAllReports, createReport, queryReportById, checkIfReportExists, updateReport, deleteReport } from "../controllers/report-controllers";

const ReportRoutes = Router();
const cors = require('cors');

let corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}

ReportRoutes.get("/", cors(corsOptions),queryAllReports);
ReportRoutes.post("/create-report", cors(corsOptions), createReport);
ReportRoutes.get("/:reportId", cors(corsOptions),queryReportById);
ReportRoutes.get("/check/:reportId", cors(corsOptions),checkIfReportExists);
ReportRoutes.put("/update/:reportId", cors(corsOptions),updateReport);
ReportRoutes.delete("/delete/reportId",cors(corsOptions), deleteReport);

export default ReportRoutes;
