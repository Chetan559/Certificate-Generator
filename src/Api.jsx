export const generateCertificates = async (textConfig, uploadedData) => {
  try {
    const response = await fetch(
      "https://certificate-generator-production-616d.up.railway.app/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdf_url: uploadedData.pdf_url,
          excel_url: uploadedData.excel_url,
          text_config: textConfig,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate certificates");
    }

    const zipBlob = await response.blob();
    const contentDisposition = response.headers.get("Content-Disposition");
    const zipFilename =
      contentDisposition?.split("filename=")[1] || "certificates.zip";

    return { zipBlob, zipFilename };
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const uploadFiles = async (formData) => {
  try {
    const response = await fetch(
      "https://certificate-generator-production-616d.up.railway.app/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
};
