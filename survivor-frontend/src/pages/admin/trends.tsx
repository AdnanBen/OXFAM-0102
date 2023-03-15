import Head from "next/head";
import BarItem from "../../components/trends/BarItem";
import Report from "../../components/trends/Report";
import Table from "../../components/trends/Table";
import styles from "../../styles/Trends.module.css";

export default function Trends() {
  return (
    <>
      <Head>
        <title>Trends</title>
        <meta name="description" content="Trends" />
      </Head>

      <main>
        <h2>Trends</h2>

        <div className={styles.wrapper}>
          <div>
            <h3 className={styles.header}>Incomplete Reports</h3>
            <Report />
          </div>

          <div className={styles.barChartContainer}>
            <h3 className={styles.header}>Popular Resources</h3>

            <input
              className={styles.search}
              type="text"
              placeholder={"Search Resource ID"}
            />
            <BarItem />
          </div>

          <div className={styles.tableContainer}>
            <h3 className={styles.header}>Report Keywords</h3>
            <Table />
          </div>
        </div>
      </main>
    </>
  );
}
