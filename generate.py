import os

def create_directory_structure(base_path):
    # Define the directory structure
    directories = [
        'backend',
        'backend/templates',
        'backend/uploads',
        'frontend/src/components',
        'frontend/public'
    ]

    files = {
        'backend/app.py': 'Flask app code here',
        'backend/config.py': 'Configuration settings here',
        'backend/utils.py': 'Helper functions here',
        'backend/requirements.txt': 'Flask and dependencies here',
        'frontend/src/components/UploadForm.js': 'Upload section code here',
        'frontend/src/components/Preview.js': 'Live preview section code here',
        'frontend/src/components/Controls.js': 'Position, font, color controls code here',
        'frontend/src/components/Download.js': 'Download ZIP button code here',
        'frontend/src/App.js': 'Main React component code here',
        'frontend/src/api.js': 'API request functions code here',
        '.env': 'Cloudinary & Flask env variables here',
        'docker-compose.yml': 'Docker configuration here (Optional)',
        'README.md': 'Project documentation here'
    }

    # Create directories
    for directory in directories:
        os.makedirs(os.path.join(base_path, directory), exist_ok=True)

    # Create files with placeholder content
    for file_path, content in files.items():
        with open(os.path.join(base_path, file_path), 'w') as f:
            f.write(content)

if __name__ == "__main__":
    base_path = ''  # Adjust base path if needed
    create_directory_structure(base_path)
    print("Directory structure created successfully!")
