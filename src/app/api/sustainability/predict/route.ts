import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

interface SustainabilityData {
  soil_ph: number;
  soil_moisture: number;
  fertilizer_usage_kg: number;
  pesticide_usage_kg: number;
  crop_yield_ton: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Define required fields and their validation
    const requiredFields = {
      soil_ph: "Soil pH",
      soil_moisture: "Soil Moisture",
      temperature_c: "Temperature",
      rainfall_mm: "Rainfall",
      crop_type: "Crop Type",
      fertilizer_usage_kg: "Fertilizer Usage",
      pesticide_usage_kg: "Pesticide Usage",
      crop_yield_ton: "Crop Yield",
    };

    // Check if all required fields are present and have valid values
    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ""
      ) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing or invalid values for: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const {
      soil_ph,
      soil_moisture,
      temperature_c,
      rainfall_mm,
      crop_type,
      fertilizer_usage_kg,
      pesticide_usage_kg,
      crop_yield_ton,
    } = body;

    // Convert all values to numbers and validate
    const values = [
      soil_ph,
      soil_moisture,
      temperature_c,
      rainfall_mm,
      crop_type,
      fertilizer_usage_kg,
      pesticide_usage_kg,
      crop_yield_ton,
    ].map((val) => Number(val));

    // Check if any value is NaN
    if (values.some(isNaN)) {
      return NextResponse.json(
        { error: "All fields must be valid numbers" },
        { status: 400 }
      );
    }

    // Spawn Python process with validated values
    const pythonProcess = spawn("python", [
      path.join(process.cwd(), "src/lib/predict_sustainability.py"),
      ...values.map((v) => v.toString()),
    ]);

    return new Promise((resolve, reject) => {
      let result = "";
      let error = "";

      pythonProcess.stdout.on("data", (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        error += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          resolve(
            NextResponse.json(
              { error: error || "Prediction failed" },
              { status: 500 }
            )
          );
        } else {
          const score = parseFloat(result.trim());
          if (isNaN(score)) {
            resolve(
              NextResponse.json(
                { error: "Invalid prediction result" },
                { status: 500 }
              )
            );
            return;
          }
          resolve(
            NextResponse.json({
              score,
              rating: getRating(score),
              recommendations: getRecommendations(score, body),
            })
          );
        }
      });
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Failed to predict sustainability score" },
      { status: 500 }
    );
  }
}

function getRating(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  return "Needs Improvement";
}

function getRecommendations(score: number, data: SustainabilityData): string[] {
  const recommendations: string[] = [];

  if (data.soil_ph < 6.0 || data.soil_ph > 7.5) {
    recommendations.push("Consider soil pH adjustment for optimal crop growth");
  }
  if (data.soil_moisture < 30) {
    recommendations.push(
      "Implement better irrigation practices to maintain soil moisture"
    );
  }
  if (data.fertilizer_usage_kg > 70) {
    recommendations.push(
      "Consider reducing chemical fertilizer usage and adopt organic alternatives"
    );
  }
  if (data.pesticide_usage_kg > 50) {
    recommendations.push(
      "Look into integrated pest management and organic pest control"
    );
  }
  if (data.crop_yield_ton < 50) {
    recommendations.push(
      "Consider crop rotation and soil enrichment to improve yield"
    );
  }

  return recommendations;
}
