import Head from 'next/head';
import Image from 'next/image';
import BarItem from '@/components/BarItem';
import Table from '@/components/Table'; 
import Report from '@/components/Report';
import styles from '../styles/Trends.module.css';
import { useEffect, useState } from 'react';

export default function Trends() {
  return (
    <>
      <Head>
        <title>Trends</title>
        <meta name="description" content="Trends" />
      </Head>

      <main>
        <h2>Trends</h2>
        
        <div className={styles.reportContainer}>
          <h2>Incomplete Reports</h2>
          <Report />
        </div>

        <div className={styles.barChartContainer}>
          <h2>Popular Resources</h2>
          
          <input className={styles.search}
            type="text"
            placeholder={'Search Resource ID'}
          />  
          <BarItem />
        </div>

        <span />
        <div className={styles.tableContainer}>
          <h2>Report Keywords</h2>
          <Table />
        </div>

      </main>
    </>
  )
}
