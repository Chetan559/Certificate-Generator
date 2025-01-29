import React, { useState } from "react";
import { uploadFiles } from "../Api";

const UploadForm = ({ setUploadedData }) => {
  const [excel, setExcel] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!excel || !pdf) {
      setMessage("Please select both Excel and PDF files.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("excel", excel);
      formData.append("pdf", pdf);

      const response = await uploadFiles(formData);

      console.log("API Response:", response); // Log response for debugging

      if (response && response.pdf_url && response.excel_url) {
        setUploadedData(response);
        setMessage("Files uploaded successfully!");
      } else {
        setMessage("Upload failed. No URLs returned.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Upload Certificate Template & Excel</h3>
      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setExcel(e.target.files[0])}
      />
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setPdf(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadForm;
