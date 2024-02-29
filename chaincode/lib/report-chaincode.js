'use strict';

const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');
const { stopCoverage } = require('v8');

class Report extends Contract {
  async initLedger(ctx) {
    const reports = [
      {
        id: "12345",
        patientName:    "John Doe",
        sonographer:    "Dr. Smith",
        aorticRoot:     "Normal",
        leftVentrical:  "Normal",
        rightVentrical: "Normal",
        diastole:       "Normal",
        systole:        "Normal",
        lvpw:           "Normal",
        lvef:           "Normal",
        leftAtrium:     "Normal",
        ivs:            "Normal",
        owner:          "Patient's Owner",
        age:            "30",
        sex:            "Male",
        cp:             "Chest Pain",
        tRestBPS:       "120",
        cholestrol:     "180",
        fbs:            "100",
        restECG:        "Normal",
        thalach:        "150",
        exang:          "No",
        oldPeak:        "2.5",
        slope:          "1",
        ca:             "0",
        thal:           "Normal",
      },
    ];
    for (let report of reports) {
      report.docType = 'report';
      await ctx.stub.putState(
        report.id,
        Buffer.from(stringify(report))
      );
    }
  }

  async queryReportById(ctx, id) {
    const reportBytes = await ctx.stub.getState(id);
    if (!reportBytes || reportBytes.length === 0) {
      throw new Error(`Report of ID ${id} does not exist in the chain`);
    }
    return reportBytes.toString();
  }

  async createReport(ctx, id, reportDetails) {
    const exists = await this.checkIfReportExists(ctx, id);
    if (exists) {
      throw new Error(`Report with ID: ${id} already exists`);
    }
    const report = JSON.parse(reportDetails);
    report.docType = 'report';
    await ctx.stub.putState(id, Buffer.from(stringify(report)));
    return JSON.stringify(report);
  }

  async updateReport(ctx, id, updatedReportDetail) {
    const exists = await this.checkIfReportExists(ctx, id);
    if (!exists) {
      throw new Error(`Report of ID: ${id} does not exists`);
    }
    const updatedReport = JSON.parse(updatedReportDetail);
    await ctx.stub.putState(id, Buffer.from(stringify(updatedReport)));
    return JSON.stringify(updatedReport);
  }

  async deleteReport(ctx, id) {
    await ctx.stub.deleteState(id);
  }

  async queryAllReports(ctx) {
    const startKey = '';
    const endKey = '';
    const allReports = [];

    for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
      const values = Buffer.from(value).toString('utf8');
      let reports;
      try {
        reports = JSON.parse(values);
      } catch (err) {
        console.log(err);
        reports = values;
      }
      allReports.push(reports);
    }
    return JSON.stringify(allReports);
  }

  async checkIfReportExists(ctx, key) {
    const reportBytes = await ctx.stub.getState(key);
    return reportBytes && reportBytes.length > 0;
  }
}

module.exports = Report;