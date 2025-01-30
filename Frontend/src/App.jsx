import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import CardPreview from "./components/CardPreview";
import Download from "./components/Download";
import { generateCertificates } from "./Api";

const App = () => {
  const [uploadedData, setUploadedData] = useState(null);
  const [textConfig, setTextConfig] = useState({
    x: 200,
    y: 300,
    size: 20,
    color: "#000000",
    font: "Arial",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (textConfig) => {
    try {
      console.log("Generating certificates with:", textConfig);

      const { zipBlob, zipFilename } = await generateCertificates(
        textConfig,
        uploadedData
      );

      if (!(zipBlob instanceof Blob)) {
        throw new Error("Invalid file format received from server");
      }

      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = zipFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);
    } catch (error) {
      console.error("Generation Error:", error);
      alert(`Generation failed: ${error.message}`);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Certificate Generator</h1>
      <UploadForm setUploadedData={setUploadedData} />
      {uploadedData && (
        <>
          <CardPreview
            uploadedData={uploadedData}
            textConfig={textConfig}
            setTextConfig={setTextConfig}
            onGenerate={handleGenerate}
          />

          <Download uploadedData={uploadedData} textConfig={textConfig} />
        </>
      )}
    </div>
  );
};

export default App;
