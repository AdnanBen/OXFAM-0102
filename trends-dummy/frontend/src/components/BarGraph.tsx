import React from "react";
import BarItem from "./BarItem";
import styles from '../styles/BarGraph.module.css';

export default function BarGraph(){
  return(
    <div className={styles.BarGraph}>
      <div className={styles.bar}>
        <BarItem resource_id='1'/>
        <BarItem resource_id='2'/>
        <BarItem resource_id='3'/>
        <BarItem resource_id='4'/>
      </div>
      <div className='bars-line' />
    </div>
  )
}