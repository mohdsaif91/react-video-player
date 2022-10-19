import React from "react";
import { Route, Routes } from "react-router-dom";

import Header from "./Component/Header";
import QrDisplay from "./Component/QrDisplay";
import Scanner from "./Component/Scanner";
import VideoPage from "./Pages/VideoPage";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/generateQr" element={<QrDisplay />} />
        <Route path="/" element={<Scanner />} />
        <Route path="/videoSearch" element={<VideoPage />} />
      </Routes>
    </div>
  );
}

export default App;
