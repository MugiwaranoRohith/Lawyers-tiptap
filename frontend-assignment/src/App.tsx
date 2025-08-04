import React from "react";
import SidebarLeft from "./components/SidebarLeft";
import SidebarRight from "./components/SidebarRight";
// import Toolbar from "./components/Toolbar";
import Editor from "./components/Editor";
import "./styles/layout.css";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <SidebarLeft />
      <main className="main-area">
        {/* <Toolbar /> */}
        <div className="page">
          <Editor />
          {/* <footer className="footer">Page 1</footer> */}
        </div>
      </main>
      <SidebarRight />
    </div>
  );
};

export default App;
