import sys
import joblib
import numpy as np
import json

def predict_sustainability(features):
    try:
        # Load the model and scaler
        model = joblib.load('src/lib/sustainability_model.joblib')
        scaler = joblib.load('src/lib/sustainability_scaler.joblib')
        
        # Convert features to numpy array and reshape
        features_array = np.array(features).reshape(1, -1)
        
        # Scale the features
        features_scaled = scaler.transform(features_array)
        
        # Make prediction
        prediction = float(model.predict(features_scaled)[0])
        
        # Return prediction as a properly formatted string
        return f"{prediction:.2f}"
        
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 9:
        error_msg = {
            "error": "Incorrect number of arguments. Expected 8 features: Soil_pH, Soil_Moisture, Temperature_C, Rainfall_mm, Crop_Type, Fertilizer_Usage_kg, Pesticide_Usage_kg, Crop_Yield_ton"
        }
        print(json.dumps(error_msg), file=sys.stderr)
        sys.exit(1)
        
    try:
        features = [float(x) for x in sys.argv[1:]]
        prediction = predict_sustainability(features)
        # Ensure we output valid JSON
        print(prediction)
        sys.stdout.flush()
    except ValueError as e:
        error_msg = {"error": f"Invalid input - {str(e)}"}
        print(json.dumps(error_msg), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        error_msg = {"error": str(e)}
        print(json.dumps(error_msg), file=sys.stderr)
        sys.exit(1) 