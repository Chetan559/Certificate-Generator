import React, { useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Set worker URL for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const CardPreview = ({ uploadedData, textConfig, setTextConfig }) => {
  useEffect(() => {
    console.log("Uploaded Data:", uploadedData);
  }, [uploadedData]);

  if (!uploadedData || !uploadedData.pdf_url) {
    return <p>Waiting for file upload...</p>; // Prevents crash when no file is uploaded
  }

  return (
    <div>
      <h3>Certificate Preview</h3>

      {/* PDF Preview */}
      <Document
        file={uploadedData.pdf_url}
        onLoadError={(error) => console.error("PDF loading error:", error)}
      >
        <Page pageNumber={1} />
      </Document>

      {/* Text Position Inputs */}
      <div>
        <label>X Position:</label>
        <input
          type="number"
          value={textConfig.x || 0}
          onChange={(e) =>
            setTextConfig((prev) => ({
              ...prev,
              x: parseInt(e.target.value) || 0,
            }))
          }
        />
      </div>

      <div>
        <label>Y Position:</label>
        <input
          type="number"
          value={textConfig.y || 0}
          onChange={(e) =>
            setTextConfig((prev) => ({
              ...prev,
              y: parseInt(e.target.value) || 0,
            }))
          }
        />
      </div>

      {/* Font Customization */}
      <div>
        <label>Font Size:</label>
        <input
          type="number"
          value={textConfig.size || 20}
          onChange={(e) =>
            setTextConfig((prev) => ({
              ...prev,
              size: parseInt(e.target.value) || 20,
            }))
          }
        />
      </div>

      <div>
        <label>Font Color:</label>
        <input
          type="color"
          value={textConfig.color || "#000000"}
          onChange={(e) =>
            setTextConfig((prev) => ({
              ...prev,
              color: e.target.value,
            }))
          }
        />
      </div>
    </div>
  );
};

export default CardPreview;
