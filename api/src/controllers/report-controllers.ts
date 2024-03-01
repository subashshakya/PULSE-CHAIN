import { Request, Response } from "express";
import { Connection } from "../connection";

const utf8Decoder = new TextDecoder();

export const queryAllReports = async (req: Request, res: Response) => {
  const reportsBytes = await Connection.reportContract.evaluateTransaction('queryAllReports');
  const reportJson = utf8Decoder.decode(reportsBytes);
  const reports = JSON.parse(reportJson);
  console.log(`All Reports: ${reports}`);
  res.json(reports);
}

export const createReport = async (req: Request, res: Response) => {
  console.log(req.body)
  const { reportId, report } = req.body;
  console.log(reportId);
  console.log(report)
  if (!reportId || !report) {
    console.log("Request is invalid")
    return res.status(400).json({ message: "Bad Request: Missing report id or report details" })
  }

  try {
    const reportBytes = await Connection.reportContract.submitTransaction(
      'createReport',
      reportId,
      JSON.stringify({
        ...report
      })
    )
    console.log
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error"});
  }
}

export const queryReportById = async (req: Request, res: Response) => {
  const { reportId } = req.params;
  console.log(`Requested to query report with ID: ${reportId}`);
  try {
    const checkReportBytes = await Connection.reportContract.evaluateTransaction(
      'checkIfReportExists',
      reportId
    );
    const checkReportJson = utf8Decoder.decode(checkReportBytes);
    const exists = JSON.parse(checkReportJson);

    if (exists) {
      const reportBytes = await Connection.reportContract.evaluateTransaction(
        'queryReportById',
        reportId
      );
      const reportJson = utf8Decoder.decode(reportBytes);
      const report = JSON.parse(reportJson);
      console.log(`Report of ID: ${reportId}: ${report}`);

      res.status(200).json(report);
    } else {
      console.log("Report does not exists");
      res.status(404).json({ message: "Report does not exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const checkIfReportExists = async (req: Request, res: Response) => {
  const { reportId } = req.params;

  try {
    const reportBytes = await Connection.reportContract.evaluateTransaction(
      'checkIfReportExists',
      reportId
    );
    const reportJson = utf8Decoder.decode(reportBytes);
    const report = JSON.parse(reportJson);
    if (report) {
      console.log("Report exists");
      res.status(200).json(report);
    } else {
      console.log("Report does not exists")
      res.status(404).json({ message: `Report of id: ${reportId} does not exist`});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error"});
  }
}

export const updateReport = async (req: Request, res: Response) => {
  const { reportId, report } = req.body;
  if (!reportId || !report) {
    console.log("Report id or report details missing");
    return res.status(400).json({ message: "Request body invalid"} );
  }

  const reportBytes = await Connection.reportContract.submitTransaction(
    'updateReport',
    reportId,
    JSON.stringify({
      ...report,
    })
  );
  const reportJson = utf8Decoder.decode(reportBytes);
  const reportObj = JSON.parse(reportJson);
  res.json(reportObj);
}

export const deleteReport = async (req: Request, res: Response) => {
  const { reportId } = req.params;

  await Connection.reportContract.submitTransaction(
    'deleteReport',
    reportId
  );
  res.status(404).json({ message: 'Deleted the report'});
}
