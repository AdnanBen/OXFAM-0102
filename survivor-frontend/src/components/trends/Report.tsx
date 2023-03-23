import { useEffect, useState } from "react";
import React from "react";
import styles from "../../styles/Trends.module.css";

export default function Report() {
  const [incompleteReports, setIncompleteReports] = useState({});

  useEffect(() => {
    fetch("/api/trends/incompletereports/getall")
      .then((response) => response.json())
      .then((json) => setIncompleteReports(json.incompleteReports));
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
            <th>Question 1</th>
            <th>Question 2</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(incompleteReports).map((x) => {
            let data = x.info;
            let arr = data.split(";");
            return (
              <tr>
                <td>{x._id}</td>
                <td>{arr[0].split(":")[1]}</td>
                <td>{arr[1].split(":")[1]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
