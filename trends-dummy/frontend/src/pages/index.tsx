import Head from 'next/head';
import Image from 'next/image';
import BarGraph from '@/components/BarGraph';
import Table from '@/components/Table'; 
import styles from '../styles/BarGraph.module.css';
/**import data from '../../../fake-backend/index.js';*/

export default function Trends() {
  return (
    <>
      <Head>
        <title>Trends</title>
        <meta name="description" content="Trends" />
      </Head>

      <main>
        <h2>Trends</h2>

        <span />

        <h3>Incomplete Reports</h3>
        
        <text>table of incomplete reports here</text>

        <span />

        <h3>Popular Resources</h3>

        <input
          className={styles.board_search}
          type="text"
          placeholder={'Search Resource ID'}
        />

        <div className={styles.bar}>
          <text>bar chart here</text>
        </div>

        <span />
        <h3>Report Keywords</h3>
        <span />
        <div className={styles.table}>
          <Table />
        </div>

      </main>
    </>
  )
}
