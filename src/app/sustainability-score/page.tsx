"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Leaf } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define crop types mapping (based on your dataset's encoding)
const cropTypes = [
  { value: "0", label: "Rice" },
  { value: "1", label: "Wheat" },
  { value: "2", label: "Maize" },
  { value: "3", label: "Sugarcane" },
  { value: "4", label: "Cotton" },
  { value: "5", label: "Pulses" },
  { value: "6", label: "Vegetables" },
  { value: "7", label: "Fruits" },
  { value: "8", label: "Oilseeds" },
  { value: "9", label: "Other" },
];

const formSchema = z.object({
  soil_ph: z
    .number()
    .min(0, "pH must be non-negative")
    .max(14, "pH must be less than 14"),
  soil_moisture: z
    .number()
    .min(0, "Soil moisture must be non-negative")
    .max(100, "Maximum value is 100"),
  temperature_c: z
    .number()
    .min(-50, "Temperature must be above -50°C")
    .max(60, "Temperature must be below 60°C"),
  rainfall_mm: z.number().min(0, "Rainfall must be non-negative"),
  crop_type: z.string().min(1, "Please select a crop type"),
  fertilizer_usage_kg: z
    .number()
    .min(0, "Must be non-negative")
    .max(1000, "Maximum value is 1000 kg"),
  pesticide_usage_kg: z
    .number()
    .min(0, "Must be non-negative")
    .max(100, "Maximum value is 100"),
  crop_yield_ton: z
    .number()
    .min(0, "Must be non-negative")
    .max(100, "Maximum value is 100"),
});

interface User {
  farmDetails?: {
    farmSize: number;
  };
}

interface PredictionResult {
  score: number;
  rating: string;
  recommendations: string[];
}

export default function SustainabilityScorePage() {
  const [user, setUser] = useState<User | null>(null);
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      soil_ph: 7,
      soil_moisture: 50,
      temperature_c: 25,
      rainfall_mm: 1000,
      crop_type: "0",
      fertilizer_usage_kg: 50,
      pesticide_usage_kg: 50,
      crop_yield_ton: 50,
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
  }, [router, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      setError(null);
      setPredictionResult(null);

      // Convert all values to numbers, handling crop_type specially
      const payload = {
        ...Object.fromEntries(
          Object.entries(values).map(([key, value]) => [
            key,
            key === "crop_type" ? value : Number(value),
          ])
        ),
      };

      const response = await fetch("/api/sustainability/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to predict sustainability score");
      }

      setPredictionResult(data);
    } catch (error: unknown) {
      const err = error as Error;
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-yellow-400";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-900 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-white">
              Sustainability Score Calculator
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Enter Farm Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="soil_ph"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Soil pH (0-14)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.1"
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                              className="bg-neutral-700 border-neutral-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="soil_moisture"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Soil Moisture (%)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.1"
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                              className="bg-neutral-700 border-neutral-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="temperature_c"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Temperature (°C)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.1"
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                              className="bg-neutral-700 border-neutral-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rainfall_mm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rainfall (mm)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="1"
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                              className="bg-neutral-700 border-neutral-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="crop_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Crop Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                                <SelectValue placeholder="Select a crop type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-neutral-800 border-neutral-700">
                              {cropTypes.map((crop) => (
                                <SelectItem
                                  key={crop.value}
                                  value={crop.value}
                                  className="text-white hover:bg-neutral-700 focus:bg-neutral-700 cursor-pointer"
                                >
                                  {crop.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the main crop you are cultivating
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fertilizer_usage_kg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fertilizer Usage (kg)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="1"
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                              className="bg-neutral-700 border-neutral-600"
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the amount of fertilizer used in kilograms
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pesticide_usage_kg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pesticide Usage (0-100)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="1"
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                              className="bg-neutral-700 border-neutral-600"
                            />
                          </FormControl>
                          <FormDescription>
                            0 means organic farming, 100 means heavy pesticide
                            use
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="crop_yield_ton"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Crop Yield (0-100)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="1"
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                              className="bg-neutral-700 border-neutral-600"
                            />
                          </FormControl>
                          <FormDescription>
                            Relative crop yield score
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {error && (
                      <div className="text-red-500 text-sm mt-2">{error}</div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500"
                      disabled={loading}
                    >
                      {loading ? "Calculating..." : "Calculate Score"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {predictionResult && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-neutral-800 border-neutral-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-green-400" />
                      Sustainability Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        Overall Score
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-4xl font-bold ${getScoreColor(
                            predictionResult.score
                          )}`}
                        >
                          {predictionResult.score.toFixed(1)}
                        </span>
                        <span className="text-neutral-400">/100</span>
                      </div>
                      <p
                        className={`text-lg ${getScoreColor(
                          predictionResult.score
                        )}`}
                      >
                        {predictionResult.rating}
                      </p>
                    </div>

                    <Separator className="bg-neutral-700" />

                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">
                        Recommendations
                      </h3>
                      <ul className="space-y-2">
                        {predictionResult.recommendations.map((rec, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-neutral-300"
                          >
                            <span className="text-green-400">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
