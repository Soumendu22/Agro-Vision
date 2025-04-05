import warnings
warnings.filterwarnings('ignore')  # Suppress all warnings

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

def create_directory():
    os.makedirs('src/lib', exist_ok=True)
    print("Created directory: src/lib")

def load_and_preprocess_data():
    print("Loading dataset from datasets\\farm_data.csv")
    try:
        data = pd.read_csv('datasets/farm_data.csv')
        print(f"\nDataset loaded successfully with {len(data)} rows")
        
        print("\nPreprocessing features...")
        # Convert categorical variables
        le = LabelEncoder()
        data['Crop_Type'] = le.fit_transform(data['Crop_Type'])
        
        # Create interaction features
        data['Water_Fertilizer_Interaction'] = data['Soil_Moisture'] * data['Fertilizer_Usage_kg']
        data['Temperature_Moisture_Interaction'] = data['Temperature_C'] * data['Soil_Moisture']
        
        # Create polynomial features for important numerical columns
        data['Soil_pH_Squared'] = data['Soil_pH'] ** 2
        data['Temperature_Squared'] = data['Temperature_C'] ** 2
        
        features = ['Soil_pH', 'Soil_Moisture', 'Temperature_C', 'Rainfall_mm', 
                   'Crop_Type', 'Fertilizer_Usage_kg', 'Pesticide_Usage_kg', 
                   'Crop_Yield_ton', 'Water_Fertilizer_Interaction', 
                   'Temperature_Moisture_Interaction', 'Soil_pH_Squared', 
                   'Temperature_Squared']
        
        target = 'Sustainability_Score'
        
        X = data[features]
        y = data[target]
        
        return X, y, features
        
    except Exception as e:
        print(f"Error loading or preprocessing data: {str(e)}")
        raise

def train_model():
    try:
        create_directory()
        X, y, features = load_and_preprocess_data()
        
        # Split data with stratification based on binned target
        y_binned = pd.qcut(y, q=5, labels=False)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y_binned
        )
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        print("\nTraining Random Forest model...")
        model = RandomForestRegressor(
            n_estimators=200,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            max_features='sqrt',
            random_state=42,
            n_jobs=-1
        )
        
        model.fit(X_train_scaled, y_train)
        
        # Evaluate model
        train_score = model.score(X_train_scaled, y_train)
        test_score = model.score(X_test_scaled, y_test)
        
        print("\nModel Performance:")
        print(f"Training R² score: {train_score:.4f}")
        print(f"Testing R² score: {test_score:.4f}")
        
        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': features,
            'importance': model.feature_importances_
        })
        feature_importance = feature_importance.sort_values('importance', ascending=False)
        
        print("\nFeature Importance:")
        print(feature_importance)
        
        # Save model and scaler
        print("\nSaving model and scaler...")
        model_path = os.path.join('src', 'lib', 'sustainability_model.joblib')
        scaler_path = os.path.join('src', 'lib', 'sustainability_scaler.joblib')
        
        joblib.dump(model, model_path)
        joblib.dump(scaler, scaler_path)
        
        print(f"Model saved to: {model_path}")
        print(f"Scaler saved to: {scaler_path}")
        print("\nTraining completed successfully!")
        
    except Exception as e:
        print(f"\nError during model training: {str(e)}")
        raise

if __name__ == "__main__":
    train_model() 