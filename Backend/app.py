from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import cloudinary
import cloudinary.uploader
import cloudinary.api
import pandas as pd
import fitz  # PyMuPDF for editing PDFs
from reportlab.lib.colors import HexColor
from io import BytesIO
import requests
import zipfile
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

@app.route("/upload", methods=["POST"])
def upload_files():
    """Uploads Excel and PDF to Cloudinary."""
    if "excel" not in request.files or "pdf" not in request.files:
        return jsonify({"error": "Both Excel and PDF files are required"}), 400

    excel_file = request.files["excel"]
    pdf_file = request.files["pdf"]

    try:
        excel_url = cloudinary.uploader.upload(excel_file, resource_type="raw")["url"]
        pdf_url = cloudinary.uploader.upload(pdf_file, resource_type="raw")["url"]
    except Exception as e:
        return jsonify({"error": f"Cloudinary upload failed: {str(e)}"}), 500

    return jsonify({"excel_url": excel_url, "pdf_url": pdf_url})

@app.route("/generate", methods=["POST"])
def generate_certificates():
    """Generates certificates by adding names from Excel onto the PDF template."""
    try:
        data = request.json
        excel_url = data.get("excel_url")
        pdf_url = data.get("pdf_url")
        text_config = data.get("text_config", {})

        # Download Excel file from Cloudinary
        excel_response = requests.get(excel_url)
        if excel_response.status_code != 200:
            return jsonify({"error": "Failed to download Excel file"}), 500

        excel_buffer = BytesIO(excel_response.content)
        df = pd.read_excel(excel_buffer)

        if "Name" not in df.columns:
            return jsonify({"error": "Excel file must contain a 'Name' column"}), 400

        names = df["Name"].dropna().tolist()

        # Download PDF template from Cloudinary
        pdf_response = requests.get(pdf_url)
        if pdf_response.status_code != 200:
            return jsonify({"error": "Failed to download PDF file"}), 500

        pdf_template_buffer = BytesIO(pdf_response.content)

        # Prepare ZIP file
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for name in names:
                pdf_template_buffer.seek(0)  # Reset buffer for each name
                pdf_document = fitz.open(stream=pdf_template_buffer.read(), filetype="pdf")
                pdf_page = pdf_document[0]  # Assume single-page template
                
                # Extract user configurations
                x = int(text_config.get("x", 100))
                y = int(text_config.get("y", 100))
                font_size = int(text_config.get("size", 20))
                font_style = text_config.get("font_style", "helv")  # Default to Helvetica

                # ✅ FIX: Convert HexColor to correct format
                hex_color = HexColor(text_config.get("color", "#000000"))  # Default to black
                color = (hex_color.red / 255, hex_color.green / 255, hex_color.blue / 255)

                # Add name to PDF
                pdf_page.insert_textbox((x, y, x + 500, y + 50), name, fontsize=font_size, fontname=font_style, color=color)

                # Save to buffer
                output_buffer = BytesIO()
                pdf_document.save(output_buffer)
                pdf_document.close()

                # Add to ZIP
                zip_file.writestr(f"{name}.pdf", output_buffer.getvalue())

        zip_buffer.seek(0)
        return send_file(zip_buffer, as_attachment=True, download_name="certificates.zip")

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
