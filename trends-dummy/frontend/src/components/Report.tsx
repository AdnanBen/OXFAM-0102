import { useEffect, useState } from "react";
import React from "react";

export default function Report(){

    const [incompleteReports, setIncompleteReports] = useState({});

    useEffect(() => {
        fetch("http://localhost:3000/api/incompletereports")
            .then((response) => response.json())
            .then((json) => setIncompleteReports(json));
    }, [])

    useEffect(() => {
        console.log(incompleteReports);
    }, [incompleteReports])    

    return (
    <div className="app-container">
        <table>
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
                                return (
                                    <td>{y[1]}</td>
                                );
                            })}
                        </tr>
                    );
                })}    
            </tbody>
        </table>
    </div>
  );

};