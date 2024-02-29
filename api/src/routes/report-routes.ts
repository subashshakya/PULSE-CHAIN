import { Router } from "express";
import { queryAllReports, createReport, queryReportById, checkIfReportExists, updateReport, deleteReport } from "../controllers/report-controllers";

const ReportRoutes = Router();

ReportRoutes.get("/", queryAllReports);
ReportRoutes.post("/create-report", createReport);
ReportRoutes.get("/:reportId", queryReportById);
ReportRoutes.get("/check/:reportId", checkIfReportExists);
ReportRoutes.put("/update/:reportId", updateReport);
ReportRoutes.delete("/delete/reportId", deleteReport);

export default ReportRoutes;
