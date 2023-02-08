import React from "react";
import { useState, useRef } from "react";
import styles from "../../styles/Collapsible-tab.module.css";

function CollapsibleTab({ headerComponent, contentComponent }) {
  const [showTab, setShowTab] = useState(false);
  return (
    <div>
      <div
        className={styles.collapsibleHeader}
        onClick={() => setShowTab(!showTab)}
      >
        {headerComponent}
      </div>
      <div
        className={`${styles.collapsibleContent} ${
          showTab ? styles.maxHeight__full : styles.maxHeight__zero
        }`}
      >
        {contentComponent}
      </div>
    </div>
  );
}

export default CollapsibleTab;
