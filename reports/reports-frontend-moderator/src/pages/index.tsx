import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function ReportsView() {
  const [reports, setReports] = useState({});
  const [incompleteReports, setIncompleteReports] = useState({});

  useEffect(() => {
    fetch("http://localhost:3004/reports/getall")
      .then((response) => response.json())
      .then((json) => setReports(json));

    fetch("http://localhost:3004/incompletereports/getall")
      .then((response) => response.json())
      .then((json) => setIncompleteReports(json));
  }, []);

  useEffect(() => {
    console.log(incompleteReports);
  }, [incompleteReports]);

  return (
    <>
      <h2>Reports:</h2>

      {reports?.reports &&
        reports.reports.map((x) => {
          return (
            <div>
              <p>
                Name: {x.name}
                <br />
                Gender: {x.gender}
                <br />
                Info: {x.body}
              </p>
              <br />
            </div>
          );
        })}

      <br />

      <h2>Incomplete Reports:</h2>

      {incompleteReports?.incompleteReports &&
        incompleteReports.incompleteReports.map((x) => {
          return (
            <div>
              <p>
                id: {x.reportId}
                <br />
                Info: {x.info}
              </p>
              <br />
            </div>
          );
        })}
    </>
  );
}
