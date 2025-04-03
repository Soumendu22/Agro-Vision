"use client";

import { motion } from "framer-motion";

export function GradientBackground() {
  return (
    <motion.div
      className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-neutral-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-green-50/50 dark:from-blue-900/10 dark:via-transparent dark:to-green-900/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      />
    </motion.div>
  );
} 