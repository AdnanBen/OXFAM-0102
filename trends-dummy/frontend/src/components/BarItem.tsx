import React from "react";
import { useEffect, useState } from 'react';
import styles from '../styles/BarItem.module.css';

export default function BarItem(){
        const [popularResources, setPopularResources] = useState({});
      
        useEffect(() => {
          fetch("http://localhost:3000/api/popularresources")
          .then((response) => response.json())
          .then((json) => setPopularResources(json));
        }, [])
      
        useEffect(() => {
            console.log(popularResources)
        }, [popularResources])
    return (
        <div>
          {Object.values(popularResources).map((x) => {
            return (
            <div>
              <div className={styles.barGraph}>
                <div className={styles.barItem}>
                  { x.views_in_last_week}
                </div>  
                <div className={styles.barItem}>
                  { x.views_in_last_month}
                </div>
                <div className={styles.barItem}>
                  { x.views_all_time}
                </div>
              </div>
              <div className={styles.barLabel}>resource_id: { x.resource_id}</div>
            </div>
            );
          })}
            
        </div>
    );
}