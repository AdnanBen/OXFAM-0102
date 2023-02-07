import React from "react";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      <nav>
        <h1>OXFAM Project</h1>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default App;
