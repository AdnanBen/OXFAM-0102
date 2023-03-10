import { useState } from "react";
import React from "react";
import styles from '../styles/Table.module.css';
/*import data from '../../../fake-backend/index.js' 

const Table = () => {

    const [words, setWords] = useState(data);

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
                {words.map((word)) => (
                    <tr>
                        <td>{word.word}</td>
                        <td>{word.frequency}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
};

export default Table;

*/


const Table = () => {
    return(
        <div>
            <table>
            <thead>
                <tr>
                    <th scope="col">Keyword</th>
                    <th scope="col">Frequency</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>exampleword0</td>
                    <td>1611</td>
                </tr>
                <tr>
                    <td>exampleword1</td>
                    <td>2334</td>
                </tr>
                <tr>
                    <td>exampleword2</td>
                    <td>5</td>
                </tr>
                <tr>
                    <td>exampleword3</td>
                    <td>40210</td>
                </tr>
            </tbody>
        </table>
        </div>
    );
};

export default Table;
