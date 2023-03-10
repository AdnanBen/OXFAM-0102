import React from "react";
import styles from '../styles/BarGraph.module.css';

export default function BarItem(resources: { resource_id: string }){
    return (
        <div className={styles.BarItem}>
            <div className="bar-item-legend">{resources.resource_id}</div>
        </div>
    );
}