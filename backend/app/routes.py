from flask import current_app as app, jsonify, request
from . import services
import traceback

@app.route('/api/disease-trends', methods=['GET'])
def get_disease_trends():
    try:
        trends = services.get_trends_data()
        return jsonify(trends)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"An error occurred: {e}"}), 500

@app.route('/api/analyze-report', methods=['POST'])
def analyze_report():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No file selected for uploading"}), 400

        if file:
            # Step 1: Perform OCR
            extracted_text = services.perform_ocr(file.stream)
            
            # Step 2: Analyze the text
            analysis_results = services.analyze_report_text(extracted_text)
            
            return jsonify({
                "raw_text": extracted_text,
                "analysis": analysis_results
            })
            
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"An error occurred during analysis: {e}"}), 500
