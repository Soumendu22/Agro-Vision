"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Weather } from "@/components/Weather";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [farmLocation, setFarmLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);

    // Get farm location from user data
    if (userData.farmDetails?.location) {
      setFarmLocation(userData.farmDetails.location);
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-900">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-800 rounded-xl p-6 shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">
              Welcome to Your Dashboard, {user.name}
            </h1>
            <Button
              onClick={() => router.push("/edit-profile")}
              variant="outline"
              className="bg-neutral-700 hover:bg-neutral-600"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Farm Profile
            </Button>
          </div>

          {farmLocation && (
            <div className="mb-6">
              <Weather lat={farmLocation.lat} lon={farmLocation.lng} />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Add your dashboard content here */}
            <DashboardCard
              title="Farm Analysis"
              description="View detailed analysis of your farm's performance"
            />
            <DashboardCard
              title="Sustainability Score"
              description="Manage and monitor your crops"
            />
            <DashboardCard
              title="Weather Insights"
              description="Check weather forecasts and alerts"
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function DashboardCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    switch (title) {
      case "Weather Insights":
        router.push("/weather-insights");
        break;
      case "Sustainability Score":
        router.push("/sustainability-score");
        break;
      // Add other cases for different cards
      default:
        break;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-neutral-700 rounded-lg p-6 hover:bg-neutral-600 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-neutral-300">{description}</p>
    </motion.div>
  );
}
