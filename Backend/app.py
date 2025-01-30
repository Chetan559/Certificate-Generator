from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import cloudinary
import cloudinary.uploader
import pandas as pd
import fitz 
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

def hex_to_rgb(hex_color):
    """Convert hex color to PyMuPDF compatible RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16)/255 for i in (0, 2, 4))

@app.route("/upload", methods=["POST"])
def upload_files():
    try:
        if 'excel' not in request.files or 'pdf' not in request.files:
            return jsonify({"error": "Missing files"}), 400

        excel_res = cloudinary.uploader.upload(request.files['excel'], resource_type="raw")
        pdf_res = cloudinary.uploader.upload(request.files['pdf'], resource_type="raw")

        return jsonify({
            "excel_url": excel_res['secure_url'],
            "pdf_url": pdf_res['secure_url']
        })

    except Exception as e:
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500
    
FONT_PATH = "./Fonts/BaskervvilleSC-Regular.ttf"

@app.route("/generate", methods=["POST"])
def generate_certificates():
    try:
        data = request.json
        excel_url = data.get("excel_url")
        pdf_url = data.get("pdf_url")
        text_config = data.get("text_config", {})

        excel_response = requests.get(excel_url)
        if excel_response.status_code != 200:
            return jsonify({"error": "Failed to download Excel file"}), 500

        excel_buffer = BytesIO(excel_response.content)
        df = pd.read_excel(excel_buffer)

        if "Name" not in df.columns:
            return jsonify({"error": "Excel file must contain a 'Name' column"}), 400

        names = df["Name"].dropna().tolist()

        pdf_response = requests.get(pdf_url)
        if pdf_response.status_code != 200:
            return jsonify({"error": "Failed to download PDF file"}), 500

        pdf_template_buffer = BytesIO(pdf_response.content)

        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for name in names:
                pdf_template_buffer.seek(0)  
                pdf_document = fitz.open(stream=pdf_template_buffer.read(), filetype="pdf")
                pdf_page = pdf_document[0]  
                x = int(text_config.get("x", 100))
                y = int(text_config.get("y", 100))
                font_size = int(text_config.get("size", 20))
                font_style = text_config.get("font", "helv") 
                color = tuple(int(text_config.get("color", "#000000").lstrip('#')[i:i+2], 16)/255 for i in (0, 2, 4))  # Hex to RGB

                pdf_page.insert_text(
                    (x, y),
                    name,
                    fontsize=font_size,
                    fontfile=FONT_PATH, 
                    color=color
                )

                output_buffer = BytesIO()
                pdf_document.save(output_buffer)
                pdf_document.close()

                zip_file.writestr(f"{name}.pdf", output_buffer.getvalue())

        zip_buffer.seek(0)
        return send_file(
            zip_buffer,
            mimetype='application/zip',
            as_attachment=True,
            download_name='certificates.zip'
        )

    except Exception as e:
        return jsonify({"error": f"Generation failed: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)