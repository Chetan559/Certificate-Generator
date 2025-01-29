import React from "react";
import { generateCertificates } from "../Api"; // Ensure the path is correct

const Download = ({ textConfig, uploadedData }) => {
  const handleDownload = async () => {
    try {
      const zipBlob = await generateCertificates(textConfig, uploadedData);
      const url = window.URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "certificates.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return <button onClick={handleDownload}>Download Certificates</button>;
};

export default Download;
