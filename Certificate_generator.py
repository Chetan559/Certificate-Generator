from flask import Flask, request, send_file, send_from_directory, jsonify
import zipfile
import pandas as pd
import fitz 
import os
from io import BytesIO
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
GENERATED_FOLDER = 'certificates'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(GENERATED_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'pdf' not in request.files or 'excel' not in request.files:
        return jsonify({'error': 'PDF and Excel files are required'}), 400
    
    pdf_file = request.files['pdf']
    excel_file = request.files['excel']
    pdf_path = os.path.join(UPLOAD_FOLDER, 'template.pdf')
    excel_path = os.path.join(UPLOAD_FOLDER, 'data.xlsx')
    pdf_file.save(pdf_path)
    excel_file.save(excel_path)
    return jsonify({'message': 'Files uploaded successfully'}), 200

@app.route('/generate', methods=['GET'])
def generate_certificates():
    excel_path = os.path.join(UPLOAD_FOLDER, 'data.xlsx')
    pdf_path = os.path.join(UPLOAD_FOLDER, 'template.pdf')
    
    if not os.path.exists(excel_path) or not os.path.exists(pdf_path):
        return jsonify({'error': 'Missing template or data file'}), 400
    
    df = pd.read_excel(excel_path)
    
    for _, row in df.iterrows():
        name = row['Name']  
        cert_path = os.path.join(GENERATED_FOLDER, f"{name}.pdf")
        generate_certificate(pdf_path, cert_path, name)
    
    return jsonify({'message': 'Certificates generated'}), 200


def generate_certificate(template_path, output_path, name):
    doc = fitz.open(template_path)
    page = doc[0]
    text_location = (200, 300)  
    page.insert_text(text_location, name, fontsize=30, color=(0, 0, 0))
    doc.save(output_path)

@app.route('/download_all', methods=['GET'])
def download_all_certificates():
    zip_path = os.path.join(GENERATED_FOLDER, 'certificates.zip')
    with zipfile.ZipFile(zip_path, 'w') as zipf:
        for root, _, files in os.walk(GENERATED_FOLDER):
            for file in files:
                zipf.write(os.path.join(root, file), file)
    return send_file(zip_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
