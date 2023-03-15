import { useEffect, useState } from "react";
import React from "react";
import styles from "../../styles/Trends.module.css";

export default function Table() {
  const [reportkeywords, setReportKeywords] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/api/reportkeywords")
      .then((response) => response.json())
      .then((json) => setReportKeywords(json));
  }, []);

  return (
    <div className="app-container">
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Keyword</th>
            <th>Frequency</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(reportkeywords)
            .sort((a, b) => b.frequency - a.frequency) // sort in descending order of frequency
            .map((x) => {
              return (
                <tr key={x.word}>
                  <td>{x.word}</td>
                  <td>{x.frequency}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
