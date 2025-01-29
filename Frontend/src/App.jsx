import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import Download from "./components/Download";
import CardPreview from "./components/CardPreview";

function App() {
  const [uploadedData, setUploadedData] = useState(null);
  const [textConfig, setTextConfig] = useState({
    x: 100,
    y: 100,
    font: "Arial",
    color: "#000000",
    size: 12,
  });

  return (
    <div>
      <UploadForm setUploadedData={setUploadedData} />
      {uploadedData && (
        <CardPreview textConfig={textConfig} setTextConfig={setTextConfig} />
      )}
      {uploadedData && (
        <Download uploadedData={uploadedData} textConfig={textConfig} />
      )}
    </div>
  );
}

export default App;
