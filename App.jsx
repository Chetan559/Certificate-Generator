import React, { useState } from "react";
import axios from "axios";

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [excelUrl, setExcelUrl] = useState("");

  const handlePdfChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleExcelChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("excel", excelFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      setPdfUrl(response.data.pdf_url);
      setExcelUrl(response.data.excel_url);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  const handleGenerate = async () => {
    if (!pdfUrl || !excelUrl) {
      setMessage("Please upload the files first.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/generate", {
        params: {
          pdf_url: pdfUrl,
          excel_url: excelUrl,
        },
      });
      setMessage(response.data.message);
      setIsGenerated(true);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get("http://localhost:5000/download_all", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "certificates.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Certificate Generator</h1>
      <input type="file" accept="application/pdf" onChange={handlePdfChange} />
      <input type="file" accept=".xlsx" onChange={handleExcelChange} />
      <button onClick={handleUpload}>Upload Files</button>
      <button onClick={handleGenerate} disabled={!pdfFile || !excelFile}>
        Generate Certificates
      </button>
      {isGenerated && (
        <button onClick={handleDownload}>Download All Certificates</button>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
