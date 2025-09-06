import requests
import pandas as pd
import pytesseract
from PIL import Image
import re

# --- Constants ---
DATA_API_URL = "https://api.data.gov.in/resource/96973b30-3829-46c4-912b-ab7ec65aff1b?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=1000"
DISEASE_KEYWORDS = ['fever', 'cough', 'headache', 'infection', 'diabetes', 'hypertension', 'anemia', 'gastritis', 'bronchitis', 'pneumonia', 'fracture']

# --- Service Function 1: Analyze Report Text (UPGRADED) ---
def analyze_report_text(text):
    """
    An upgraded NLP function that understands multi-line context for prescriptions.
    """
    detected_diseases = []
    detected_medications = []
    lines = text.lower().split('\n')
    
    # --- Part 1: Disease Detection (simple keyword search) ---
    for line in lines:
        for disease in DISEASE_KEYWORDS:
            if disease in line and disease not in detected_diseases:
                detected_diseases.append(disease.capitalize())

    # --- Part 2: Medication Parsing (Context-aware) ---
    for i, line in enumerate(lines):
        # A medication often starts with a number, like "1. Acetaminophen"
        match = re.match(r'^\s*\d+\.\s*(\w+)', line)
        if match:
            med_name = match.group(1).capitalize()
            med_info = {"name": med_name, "dosage": "", "frequency": ""}
            
            # Now, look ahead in the next few lines for details
            lookahead_range = min(i + 4, len(lines)) # Check the next 3 lines
            for j in range(i + 1, lookahead_range):
                next_line = lines[j]
                if 'dosage:' in next_line:
                    med_info['dosage'] = next_line.split('dosage:')[1].strip()
                if 'frequency:' in next_line:
                    med_info['frequency'] = next_line.split('frequency:')[1].strip()

            detected_medications.append(med_info)

    return {"diseases": detected_diseases, "medications": detected_medications}

# --- Service Function 2: Get Disease Trends ---
def get_trends_data():
    """Fetches and processes disease trend data from the government API."""
    response = requests.get(DATA_API_URL)
    response.raise_for_status()
    raw_data = response.json()
    
    records = raw_data.get('records', [])
    if not records:
        return []

    df = pd.DataFrame(records)
    df['nos_of_outbreaks'] = pd.to_numeric(df['nos_of_outbreaks'])
    disease_counts = df.groupby('disease_disease_condition')['nos_of_outbreaks'].sum().reset_index()
    disease_counts.columns = ['disease', 'outbreaks']
    disease_counts = disease_counts.sort_values(by='outbreaks', ascending=False)
    
    return disease_counts.to_dict(orient='records')

# --- Service Function 3: Perform OCR ---
def perform_ocr(file_stream):
    """Extracts text from an image file stream using Tesseract."""
    image = Image.open(file_stream)
    return pytesseract.image_to_string(image)

