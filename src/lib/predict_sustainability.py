import sys
import joblib
import numpy as np

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
        prediction = model.predict(features_scaled)[0]
        
        return prediction
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 9:
        print("Error: Incorrect number of arguments. Expected 8 features:", file=sys.stderr)
        print("Soil_pH, Soil_Moisture, Temperature_C, Rainfall_mm, Crop_Type, Fertilizer_Usage_kg, Pesticide_Usage_kg, Crop_Yield_ton", file=sys.stderr)
        sys.exit(1)
        
    try:
        features = [float(x) for x in sys.argv[1:]]
        prediction = predict_sustainability(features)
        print(f"{prediction:.2f}")
    except ValueError as e:
        print(f"Error: Invalid input - {str(e)}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1) 