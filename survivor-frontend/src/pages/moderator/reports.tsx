import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { requireAuth } from "../../server/requireAuth";
import styles from "../../styles/ReportModerator.module.css";

export const getServerSideProps: GetServerSideProps = (context) =>
  requireAuth(context, "moderator");

export default function ReportsView() {
  const [reports, setReports] = useState({});

  useEffect(() => {
    fetch("/api/moderators/reports/completereports/getall")
      .then((response) => response.json())
      .then((json) => setReports(json));
  }, []);

  useEffect(() => {
    console.log(reports);
  }, [reports]);

  return (
    <main className={styles.reportsmodpage}>
      <h3>Reports</h3>

      <div className={styles.table_container}>
        <table className={styles.table_layout}>
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
                    <td className="text-center">{x.situation}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <br />
    </main>
  );
}
