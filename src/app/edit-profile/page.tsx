"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { MapPin, Sprout, Leaf } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Combobox } from "@/components/ui/combobox";
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const icon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const profileSchema = z.object({
  farmName: z.string().min(2, "Farm name must be at least 2 characters"),
  farmSize: z.string().min(1, "Please enter farm size"),
  sizeUnit: z.enum(["acres", "hectares"]),
  primaryCrop: z.string().min(1, "Please select primary crop"),
  soilType: z.string().min(1, "Please select soil type"),
  irrigationType: z.string().min(1, "Please select irrigation type"),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

const cropOptions = [
  { value: "rice", label: "Rice" },
  { value: "wheat", label: "Wheat" },
  { value: "corn", label: "Corn" },
  { value: "soybeans", label: "Soybeans" },
  { value: "cotton", label: "Cotton" },
  { value: "sugarcane", label: "Sugarcane" },
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "other", label: "Other" },
];

const soilTypeOptions = [
  { value: "clay", label: "Clay" },
  { value: "sandy", label: "Sandy" },
  { value: "loamy", label: "Loamy" },
  { value: "silt", label: "Silt" },
  { value: "peat", label: "Peat" },
  { value: "chalky", label: "Chalky" },
  { value: "other", label: "Other" },
];

const irrigationTypeOptions = [
  { value: "drip", label: "Drip" },
  { value: "sprinkler", label: "Sprinkler" },
  { value: "surface", label: "Surface" },
  { value: "center-pivot", label: "Center Pivot" },
  { value: "subsurface", label: "Subsurface" },
  { value: "manual", label: "Manual" },
  { value: "none", label: "None" },
  { value: "other", label: "Other" },
];

function LocationMarker({ setLocation }: { setLocation: (pos: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return null;
}

export default function EditProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const router = useRouter();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);

    // Pre-fill form with existing data
    if (userData.farmDetails) {
      const { farmDetails } = userData;
      form.reset({
        farmName: farmDetails.farmName,
        farmSize: farmDetails.farmSize.toString(),
        sizeUnit: farmDetails.sizeUnit,
        primaryCrop: farmDetails.primaryCrop,
        soilType: farmDetails.soilType,
        irrigationType: farmDetails.irrigationType,
        location: farmDetails.location,
      });
      setMapCenter(farmDetails.location);
    }
  }, [router, form]);

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      
      // Update user in localStorage
      const updatedUser = { ...user, farmDetails: data };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast.success('Profile updated successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-900 py-8">
      <div className="container max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Edit Farm Profile</CardTitle>
              <CardDescription>
                Update your farm details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Basic Information</h3>
                    <Separator className="bg-neutral-700" />
                    
                    <FormField
                      control={form.control}
                      name="farmName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Farm Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-neutral-700 border-neutral-600" />
                          </FormControl>
                          <FormDescription>
                            Enter the name of your farm or agricultural establishment
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="farmSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Farm Size</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" className="bg-neutral-700 border-neutral-600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sizeUnit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-neutral-700 border-neutral-600">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="acres">Acres</SelectItem>
                                <SelectItem value="hectares">Hectares</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <Sprout className="h-5 w-5" />
                      Crop Information
                    </h3>
                    <Separator className="bg-neutral-700" />

                    <FormField
                      control={form.control}
                      name="primaryCrop"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Crop</FormLabel>
                          <FormControl>
                            <Combobox
                              options={cropOptions}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder="Select primary crop"
                            />
                          </FormControl>
                          <FormDescription>
                            Select the main crop you cultivate
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <Leaf className="h-5 w-5" />
                      Soil & Irrigation
                    </h3>
                    <Separator className="bg-neutral-700" />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="soilType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Soil Type</FormLabel>
                            <FormControl>
                              <Combobox
                                options={soilTypeOptions}
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder="Select soil type"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="irrigationType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Irrigation Type</FormLabel>
                            <FormControl>
                              <Combobox
                                options={irrigationTypeOptions}
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder="Select irrigation type"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Farm Location
                    </h3>
                    <Separator className="bg-neutral-700" />
                    
                    <div className="h-[300px] rounded-lg overflow-hidden border border-neutral-700">
                      <MapContainer
                        center={[mapCenter.lat, mapCenter.lng]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker
                          setLocation={(pos) => {
                            setMapCenter(pos);
                            form.setValue('location', pos);
                          }}
                        />
                        <Marker
                          position={[mapCenter.lat, mapCenter.lng]}
                          icon={icon}
                        />
                      </MapContainer>
                    </div>
                    <FormDescription>
                      Click on the map to update your farm's location
                    </FormDescription>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/dashboard')}
                      className="bg-neutral-700 hover:bg-neutral-600"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 