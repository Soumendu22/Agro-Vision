"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bot,
  Calculator,
  Users,
  LineChart,
  Warehouse,
  Cloud,
  Bug,
  Shield,
  MessageSquare,
  Sprout,
  Droplet,
  Wallet,
  Globe,
  Leaf,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { FloatingLeaves } from "@/components/floating-leaves";

const features = [
  {
    icon: <Bot className="h-6 w-6" />,
    title: "Voice-Based AI Assistant",
    description:
      "Hands-free AI assistant for farmers, making operations more convenient.",
    gradient: "from-purple-500/20 to-purple-500/5",
  },
  {
    icon: <Calculator className="h-6 w-6" />,
    title: "Carbon Footprint Calculator",
    description:
      "Track and reduce your farm's environmental impact with our advanced calculator.",
    gradient: "from-green-500/20 to-green-500/5",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Farmers' Community",
    description: "Connect, share, and learn from farmers across the globe.",
    gradient: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    title: "Market Price Predictions",
    description: "AI-powered price forecasts to maximize your profits.",
    gradient: "from-orange-500/20 to-orange-500/5",
  },
  {
    icon: <Warehouse className="h-6 w-6" />,
    title: "Smart Greenhouse",
    description:
      "Automated environment control for optimal growing conditions.",
    gradient: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    icon: <Cloud className="h-6 w-6" />,
    title: "Weather Forecasting",
    description: "Real-time weather updates and climate trend analysis.",
    gradient: "from-sky-500/20 to-sky-500/5",
  },
  {
    icon: <Bug className="h-6 w-6" />,
    title: "Disease Detection",
    description: "Early detection of crop diseases using AI analysis.",
    gradient: "from-red-500/20 to-red-500/5",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Pest Control",
    description: "Smart recommendations for sustainable pest management.",
    gradient: "from-indigo-500/20 to-indigo-500/5",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "AI Chatbot",
    description: "24/7 agricultural assistance at your fingertips.",
    gradient: "from-teal-500/20 to-teal-500/5",
  },
  {
    icon: <Sprout className="h-6 w-6" />,
    title: "Yield Prediction",
    description: "Data-driven insights for crop yield optimization.",
    gradient: "from-lime-500/20 to-lime-500/5",
  },
  {
    icon: <Droplet className="h-6 w-6" />,
    title: "Irrigation Management",
    description: "Smart water management for sustainable farming.",
    gradient: "from-cyan-500/20 to-cyan-500/5",
  },
  {
    icon: <Wallet className="h-6 w-6" />,
    title: "Financial Assistant",
    description: "AI-powered financial planning and management.",
    gradient: "from-rose-500/20 to-rose-500/5",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Multilingual Support",
    description: "Breaking language barriers in agriculture.",
    gradient: "from-violet-500/20 to-violet-500/5",
  },
];

const FeatureCarousel = () => {
  return (
    <div className="relative">
      <FloatingLeaves count={6} size="small" />
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full max-w-6xl mx-auto"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {features.map((feature, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/3 transition-all duration-300 ease-in-out group"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Card className="border-0 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm h-full group-data-[state=current]:scale-110 transition-all duration-300">
                  <CardContent className="p-6 md:p-8">
                    <div className="space-y-4">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r ${feature.gradient}`}
                      >
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center gap-4 mt-8">
          <CarouselPrevious className="static" />
          <CarouselNext className="static" />
        </div>
      </Carousel>
    </div>
  );
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <FloatingLeaves count={12} size="large" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] rounded-full bg-gradient-to-br from-blue-50 via-blue-50/50 to-green-50/50 dark:from-blue-900/20 dark:via-blue-900/10 dark:to-green-900/20 blur-3xl" />
        </div>
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Launch Your AI Farming Startup with
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-100">
              AI-Powered Sustainable Farming Platform
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Revolutionize your farming practices with data-driven insights and
              AI technology for a more sustainable future.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-full px-8"
              >
                Try AI Examples
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8">
                View Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative scroll-mt-20">
        <FloatingLeaves count={8} size="medium" />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl font-bold">Comprehensive Features</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              A complete solution for AI-driven sustainable farming, empowering
              farmers with cutting-edge technology
            </p>
          </motion.div>

          <FeatureCarousel />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 relative bg-neutral-50 dark:bg-neutral-900/50">
        <FloatingLeaves count={6} size="small" />
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "1000+", label: "Farmers" },
              { number: "50+", label: "Countries" },
              { number: "95%", label: "Accuracy" },
              { number: "24/7", label: "Support" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                  {stat.number}
                </div>
                <div className="text-neutral-600 dark:text-neutral-400 mt-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 relative overflow-hidden">
        <FloatingLeaves count={6} size="medium" />
        <div className="container max-w-[1200px] mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 p-8 md:p-12">
            <div className="absolute inset-0 bg-grid-white/10" />
            <FloatingLeaves count={8} size="small" />
            <div className="relative z-10 text-center space-y-6 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Start Your Sustainable Farming Journey Today
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                Join thousands of farmers who are already using our AI-powered
                platform to revolutionize their farming practices.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full px-8 bg-white text-green-600 hover:bg-white/90 w-full sm:w-auto"
                >
                  Get Started Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 border-white text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners & Integrations */}
      <section className="py-16 relative bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
        <FloatingLeaves count={10} size="medium" />
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h3 className="text-xl font-semibold text-neutral-600 dark:text-neutral-400">
              Trusted by Leading Agricultural Organizations
            </h3>
            <p className="text-neutral-500 dark:text-neutral-500">
              Seamlessly integrate with your existing farming tools and
              platforms
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {[1, 2, 3, 4].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative w-full max-w-[160px] aspect-[3/2] rounded-lg bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm p-4 flex items-center justify-center group hover:bg-white dark:hover:bg-neutral-800 transition-all border border-neutral-200 dark:border-neutral-800"
              >
                <FloatingLeaves count={3} size="small" />
                <div className="w-full h-full bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded filter blur-xl absolute" />
                <span className="relative z-10 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                  Partner {index + 1}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button
              variant="outline"
              className="rounded-full border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              View All Partners
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-sm relative overflow-hidden">
        <FloatingLeaves count={12} size="small" />
        <div className="container px-4 py-12 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4 relative">
              <FloatingLeaves count={3} size="small" />
              <div className="flex items-center space-x-2">
                <Sprout className="h-6 w-6 text-green-600 dark:text-green-400" />
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                  Agro Vision
                </span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Revolutionizing farming with AI-driven solutions for a
                sustainable future.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: <Facebook size={20} />, href: "#" },
                  { icon: <Twitter size={20} />, href: "#" },
                  { icon: <Instagram size={20} />, href: "#" },
                  { icon: <Linkedin size={20} />, href: "#" },
                  { icon: <Github size={20} />, href: "#" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-neutral-600 hover:text-green-600 dark:text-neutral-400 dark:hover:text-green-400 transition-colors"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="relative">
              <FloatingLeaves count={2} size="small" />
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { name: "Features", href: "#features" },
                  { name: "About Us", href: "#about" },
                  { name: "Documentation", href: "#docs" },
                  { name: "Examples", href: "#examples" },
                  { name: "Blog", href: "#blog" },
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-neutral-600 hover:text-green-600 dark:text-neutral-400 dark:hover:text-green-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="relative">
              <FloatingLeaves count={2} size="small" />
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {[
                  { name: "Community", href: "#" },
                  { name: "Help Center", href: "#" },
                  { name: "Partners", href: "#" },
                  { name: "Pricing", href: "#" },
                  { name: "API", href: "#" },
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-neutral-600 hover:text-green-600 dark:text-neutral-400 dark:hover:text-green-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4 relative">
              <FloatingLeaves count={3} size="small" />
              <h3 className="font-semibold">Stay Updated</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Subscribe to our newsletter for the latest updates.
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-full px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                />
                <Button
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-green-600 to-blue-600"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 relative">
            <FloatingLeaves count={4} size="small" />
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                © 2024 Agro Vision. All rights reserved.
              </div>
              <div className="flex space-x-6">
                {[
                  { name: "Privacy Policy", href: "#" },
                  { name: "Terms of Service", href: "#" },
                  { name: "Cookie Policy", href: "#" },
                ].map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm text-neutral-600 hover:text-green-600 dark:text-neutral-400 dark:hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
