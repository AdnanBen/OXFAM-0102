import { useEffect, useState } from "react";
import React from "react";
import styles from "../../styles/Trends.module.css";

export default function Report() {
  const [incompleteReports, setIncompleteReports] = useState({});

  useEffect(() => {
    fetch("/api/trends/incompletereports")
      .then((response) => response.json())
      .then((json) => setIncompleteReports(json));
  }, []);

  return (
    <div className="app-container">
      <table className={styles.table}>
        <thead>
          <tr>
            {/*}
                    {Object.values(incompleteReports).map((x) => {
                        return (
                            <th></th>
                        );
                    })}
                    */}
            <th>Report ID</th>
            <th>Data 1</th>
            <th>Data 2</th>
            <th>Data 3</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(incompleteReports).map((x) => {
            return (
              <tr>
                <td>{x.report_id}</td>
                {x.report_data.map((y) => {
                  const keys = Object.keys(y);
                  return <td>{y[keys[0]]}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
