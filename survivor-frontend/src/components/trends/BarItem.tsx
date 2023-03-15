import React from "react";
import { useEffect, useState } from "react";
import styles from "../../styles/BarItem.module.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarItem() {
  const [popularResources, setPopularResources] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/api/popularresources")
      .then((response) => response.json())
      .then((json) => setPopularResources(json));
  }, []);

  return (
    <div className={styles.graphWrapper}>
      {Object.values(popularResources).map((x) => {
        return (
          <div className={styles.barGraph2}>
            <Bar
              title={x.resource_id}
              options={{
                responsive: true,
                plugins: {
                  legend: { onClick: null },
                  title: {
                    display: true,
                    text: `Resource ${x.resource_id}`,
                  },
                },
              }}
              data={{
                labels: ["Last week", "Last month", "All time"],
                datasets: [
                  {
                    label: "Number of views",
                    data: [
                      x.views_in_last_week,
                      x.views_in_last_month,
                      x.views_all_time,
                    ],
                    backgroundColor: "#44841a",
                  },
                ],
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
