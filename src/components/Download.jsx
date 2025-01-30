import React from "react";
import { generateCertificates } from "../Api";

const Download = ({ uploadedData, textConfig }) => {
  const handleDownload = async () => {
    if (!uploadedData) {
      alert("Upload files first!");
      return;
    }

    try {
      const data = {
        excel_url: uploadedData.excel_url,
        pdf_url: uploadedData.pdf_url,
        text_config: textConfig,
      };

      const blob = await generateCertificates(data);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "certificates.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return <button onClick={handleDownload}>Download Certificates</button>;
};

export default Download;
