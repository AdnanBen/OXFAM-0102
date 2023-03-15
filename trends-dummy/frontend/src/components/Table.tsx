import { useEffect, useState } from "react";
import React from "react";

export default function Table(){

    const [reportkeywords, setReportKeywords] = useState({});

    useEffect(() => {
        fetch("http://localhost:3000/api/reportkeywords")
            .then((response) => response.json())
            .then((json) => setReportKeywords(json));
    }, [])

    useEffect(() => {
        console.log(reportkeywords);
    }, [reportkeywords])

    return (
    <div className="app-container">
        <table>
            <thead>
                <tr>
                    <th>Keyword</th>
                    <th>Frequency</th>
                </tr>
            </thead>
            <tbody>
                {Object.values(reportkeywords).map((x) => {
                    return (
                        <tr>
                            <td>{x.word}</td>
                            <td>{x.frequency}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
  );
};