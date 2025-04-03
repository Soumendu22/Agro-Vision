"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { useEffect, useState } from "react";

interface FloatingLeavesProps {
  count?: number;
  size?: "small" | "medium" | "large";
}

interface LeafPosition {
  id: number;
  initialTop: number;
  initialLeft: number;
  finalTop: number;
  finalLeft: number;
  rotation: number;
  scale: number;
  duration: number;
}

export function FloatingLeaves({ count = 8, size = "large" }: FloatingLeavesProps) {
  const [mounted, setMounted] = useState(false);
  const [leaves, setLeaves] = useState<LeafPosition[]>([]);

  useEffect(() => {
    setMounted(true);
    const newLeaves = Array.from({ length: count }).map((_, i) => ({
      id: i,
      initialTop: Math.random() * 100,
      initialLeft: Math.random() * 100,
      finalTop: Math.random() * 100,
      finalLeft: Math.random() * 100,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
      duration: Math.random() * 20 + 30
    }));
    setLeaves(newLeaves);
  }, [count]);

  const leafSizes = {
    small: "w-6 h-6",
    medium: "w-10 h-10",
    large: "w-16 h-16"
  };

  const leafColors = [
    "text-green-500/20",
    "text-emerald-500/20",
    "text-lime-500/20",
    "text-green-600/10"
  ];

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute"
          initial={{ 
            top: `${leaf.initialTop}%`, 
            left: `${leaf.initialLeft}%`,
            rotate: 0,
            scale: leaf.scale
          }}
          animate={{ 
            top: [`${leaf.initialTop}%`, `${leaf.finalTop}%`],
            left: [`${leaf.initialLeft}%`, `${leaf.finalLeft}%`],
            rotate: 360,
          }}
          transition={{
            duration: leaf.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Leaf 
            className={`
              ${leafSizes[size]} 
              ${leafColors[leaf.id % leafColors.length]}
              transform rotate-${leaf.rotation}
            `} 
          />
        </motion.div>
      ))}
    </div>
  );
} 