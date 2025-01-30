import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const CardPreview = ({
  uploadedData,
  textConfig,
  setTextConfig,
  onGenerate,
}) => {
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });

  useEffect(() => {
    console.log("Uploaded Data:", uploadedData);
  }, [uploadedData]);

  if (!uploadedData || !uploadedData.pdf_url) {
    return <p>Waiting for file upload...</p>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Certificate Preview</h3>

      {/* PDF Preview*/}
      <div style={{ position: "relative", display: "inline-block" }}>
        <Document
          file={uploadedData.pdf_url}
          onLoadSuccess={({ numPages }) =>
            console.log(`Loaded ${numPages} pages`)
          }
          onLoadError={(error) => console.error("PDF loading error:", error)}
        >
          <Page
            pageNumber={1}
            width={canvasSize.width}
            onRenderSuccess={(page) =>
              setCanvasSize({ width: page.width, height: page.height })
            }
          />
        </Document>

        {/* Text Preview  */}
        <div
          style={{
            position: "absolute",
            top: `${(textConfig.y / canvasSize.height) * 100}%`,
            left: `${(textConfig.x / canvasSize.width) * 100}%`,
            transform: "translate(-50%, -50%)",
            fontSize: `${textConfig.size}px`,
            color: textConfig.color,
            fontFamily: textConfig.font || "Arial",
            fontWeight: "bold",
          }}
        >
          Sample Name
        </div>
      </div>

      {/* Position Controls */}
      <div>
        <label>X Position:</label>
        <input
          type="number"
          value={textConfig?.x || 0}
          onChange={(e) =>
            setTextConfig({ ...textConfig, x: parseInt(e.target.value) || 0 })
          }
        />
      </div>

      <div>
        <label>Y Position:</label>
        <input
          type="number"
          value={textConfig?.y || 0}
          onChange={(e) =>
            setTextConfig({ ...textConfig, y: parseInt(e.target.value) || 0 })
          }
        />
      </div>

      {/* Font Customization */}
      <div>
        <label>Font Size:</label>
        <input
          type="number"
          value={textConfig?.size || 20}
          onChange={(e) =>
            setTextConfig({
              ...textConfig,
              size: parseInt(e.target.value) || 20,
            })
          }
        />
      </div>

      <div>
        <label>Font Color:</label>
        <input
          type="color"
          value={textConfig?.color || "#000000"}
          onChange={(e) =>
            setTextConfig({ ...textConfig, color: e.target.value })
          }
        />
      </div>

      {/* Generate Certificate Button */}
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
        onClick={() => onGenerate(textConfig, uploadedData)}
      >
        Generate Certificate
      </button>
    </div>
  );
};

export default CardPreview;
