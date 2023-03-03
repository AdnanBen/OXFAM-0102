import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { requireAuth } from "../../server/requireAuth";
import styles from "../../styles/ReportModerator.module.css";

export const getServerSideProps: GetServerSideProps = (context) =>
  requireAuth(context, "moderator");

export default function ReportsView() {
  const [reports, setReports] = useState({});
  const [incompleteReports, setIncompleteReports] = useState({});

  useEffect(() => {
    fetch("/api/moderators/reports/completereports/getall")
      .then((response) => response.json())
      .then((json) => setReports(json));

    fetch("/api/moderators/reports/incompletereports/getall")
      .then((response) => response.json())
      .then((json) => setIncompleteReports(json));
  }, []);

  useEffect(() => {
    console.log(reports);
  }, [reports]);

  useEffect(() => {
    console.log(incompleteReports);
  }, [incompleteReports]);

  return (
    <main className={styles.reportsmodpage}>
      <h3>Reports</h3>

      <div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th className="text-center">Report ID</th>
              <th className="text-center">Name</th>
              <th className="text-center">Situation</th>
            </tr>
          </thead>
          <tbody>
            {reports?.reports &&
              reports.reports.map((x) => {
                return (
                  <tr>
                    <td className="text-center">{x._id}</td>
                    <td className="text-center">{x.name}</td>
                    <td className="text-center">{x.body}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <br />

      <h3>Incomplete Reports</h3>

      <div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th className="text-center">Report ID</th>
              <th className="text-center">Info</th>
            </tr>
          </thead>
          <tbody>
            {incompleteReports?.incompleteReports &&
              incompleteReports.incompleteReports.map((x) => {
                return (
                  <tr>
                    <td className="text-center">{x._id}</td>
                    <td className="text-center">{x.info}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
