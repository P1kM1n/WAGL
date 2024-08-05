import os
import subprocess
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/open-file', methods=['POST'])
def open_file():
    data = request.json
    file_path = data.get('filePath')

    # Ferocious Logging
    print(f"=====================================")
    print(f"Received request to open file or directory at path: {file_path}")

    if not file_path:
        print('!!! ERROR !!! Request error: File path is missing')
        print(f"=====================================")
        return jsonify({'error': 'File path is required'}), 400

    # Normalize the path
    file_path = os.path.normpath(file_path)
    print(f"Normalized file path: {file_path}")

    if os.path.isdir(file_path):
        print(f"!!! INFO !!! The path '{file_path}' is a directory.")
        try:
            # For Windows
            print(f"Executing command: explorer {file_path}")
            result = subprocess.run(['explorer', file_path], capture_output=True, text=True)
            if result.returncode != 0:
                print(f"!!! ERROR !!! Error opening directory at path '{file_path}': {result.stderr}")
                print(f"Command output: {result.stdout}")
                print(f"Command error: {result.stderr}")
                print(f"=====================================")
                return jsonify({'error': 'Error opening directory'}), 500
            print(f"!!! SUCCESS !!! Directory location opened successfully at path: {file_path}")
            print(f"Command output: {result.stdout}")
            print(f"=====================================")
            return jsonify({'message': 'Directory location opened'})
        except Exception as e:
            print(f"!!! EXCEPTION !!! Exception occurred: {e}")
            print(f"=====================================")
            return jsonify({'error': 'Error opening directory'}), 500

    elif os.path.isfile(file_path):
        print(f"!!! INFO !!! The path '{file_path}' is a file.")
        try:
            # For Windows
            print(f"Executing command: start \"\" {file_path}")
            result = subprocess.run(['start', '', file_path], shell=True, capture_output=True, text=True)
            if result.returncode != 0:
                print(f"!!! ERROR !!! Error opening file at path '{file_path}': {result.stderr}")
                print(f"Command output: {result.stdout}")
                print(f"Command error: {result.stderr}")
                print(f"=====================================")
                return jsonify({'error': 'Error opening file'}), 500
            print(f"!!! SUCCESS !!! File location opened successfully at path: {file_path}")
            print(f"Command output: {result.stdout}")
            print(f"=====================================")
            return jsonify({'message': 'File location opened'})
        except Exception as e:
            print(f"!!! EXCEPTION !!! Exception occurred: {e}")
            print(f"=====================================")
            return jsonify({'error': 'Error opening file'}), 500

    else:
        print(f"!!! ERROR !!! Invalid path '{file_path}': It is neither a file nor a directory.")
        print(f"=====================================")
        return jsonify({'error': 'Invalid file path'}), 400

if __name__ == '__main__':
    app.run(port=3000, debug=True)
