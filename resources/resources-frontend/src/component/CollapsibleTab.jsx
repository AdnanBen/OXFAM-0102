import React from "react";
import { useState } from "react";
import { CollapsibleContent, CollapsibleHeader } from "./collapsibleTab.styles";

function CollapsibleTab({headerComponent, contentComponent}) {
  const [showTab, setShowTab] = useState(false); 
  return (
    <div>
      <CollapsibleHeader onClick={() => setShowTab(!showTab)}>{headerComponent}</CollapsibleHeader>
      <CollapsibleContent $showCollapsibleTab={showTab}>{contentComponent}</CollapsibleContent>
    </div>
  );
}

export default CollapsibleTab;
