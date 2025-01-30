import React from "react";
import { generateCertificates } from "../Api";

const Download = ({ uploadedData, textConfig }) => {
  const handleGenerate = async () => {
    const response = await generateCertificates({
      excel_url: uploadedData.excel_url,
      pdf_url: uploadedData.pdf_url,
      text_config: textConfig,
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "certificates.zip");
    document.body.appendChild(link);
    link.click();
  };

  return <button onClick={handleGenerate}>Generate & Download</button>;
};

export default Download;
