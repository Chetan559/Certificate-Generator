export const generateCertificates = async (textConfig, uploadedData) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pdf_url: uploadedData.pdf_url,
        excel_url: uploadedData.excel_url,
        text_config: textConfig,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate certificates");
    }

    return await response.blob(); // Returns the ZIP file as a blob
  } catch (error) {
    console.error("Generate Certificates API error:", error);
    throw error;
  }
};

export const uploadFiles = async (formData) => {
  const response = await fetch("http://127.0.0.1:5000/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return await response.json();
};
