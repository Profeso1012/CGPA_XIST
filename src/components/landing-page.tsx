"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChevronRight, Upload, PenLine, Calculator, ArrowRight, Info } from "lucide-react"
import { useInView } from "react-intersection-observer"
import Link from "next/link"

// Import images
const images = {
  hero: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jW5oIB0hAWB3TREkhVhwXvRl3zGp28.png",
  student1: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/slide1.jpg-Bh2keMCZl6dYLYieCkFnOY4RVqNd6A.jpeg",
  student2: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/slide2.jpg-FDNeY7DMWue4zfqW59FVAHZIVktJ3B.jpeg",
  student3: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/slide3.jpg-zffz6BVbUWjX5bf2bY3lOppdHdNfaA.jpeg",
  classroom:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background.jpg-cSTNGpbHcEcGeInP4NZwYLOdyo6MWx.jpeg",
}

// Tour steps
const tourSteps = [
  {
    title: "Welcome to CGPA Analyzer",
    description: "This tool helps you track, analyze, and simulate your academic performance. Let's take a quick tour!",
    target: "hero-section",
  },
  {
    title: "Upload Your Transcript",
    description: "Upload your academic transcript PDF and our AI will automatically extract your grades.",
    target: "feature-upload",
  },
  {
    title: "Manual Input",
    description: "Don't have a transcript? No problem! You can manually input your semester data.",
    target: "feature-manual",
  },
  {
    title: "Simulate Your CGPA",
    description: "Plan future semesters and see how they'll affect your CGPA.",
    target: "feature-simulate",
  },
  {
    title: "Get Detailed Reports",
    description: "View comprehensive reports and export them as PDFs.",
    target: "feature-reports",
  },
]

// Feature card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
}

export default function LandingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showTour, setShowTour] = useState(false)
  const [activeTab, setActiveTab] = useState("features")
  const [scrollY, setScrollY] = useState(0)

  // Refs for tour targets
  const sectionRefs = {
    "hero-section": useRef<HTMLDivElement>(null),
    "feature-upload": useRef<HTMLDivElement>(null),
    "feature-manual": useRef<HTMLDivElement>(null),
    "feature-simulate": useRef<HTMLDivElement>(null),
    "feature-reports": useRef<HTMLDivElement>(null),
  }

  // Intersection observers for animations
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [howItWorksRef, howItWorksInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Handle scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Start tour
  const startTour = () => {
    setCurrentStep(0)
    setShowTour(true)
  }

  // Next tour step
  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)

      // Scroll to the target element
      const targetRef = sectionRefs[tourSteps[currentStep + 1].target]
      if (targetRef && targetRef.current) {
        targetRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    } else {
      setShowTour(false)
    }
  }

  // Previous tour step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)

      // Scroll to the target element
      const targetRef = sectionRefs[tourSteps[currentStep - 1].target]
      if (targetRef && targetRef.current) {
        targetRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }

  // End tour
  const endTour = () => {
    setShowTour(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-cgpa-navy-dark dark:to-cgpa-navy-light">
      {/* Hero Section */}
      <section
        ref={sectionRefs["hero-section"]}
        className="relative pt-16 md:pt-20 pb-24 md:pb-32 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${images.classroom})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center gap-8 max-w-4xl mx-auto">
            <motion.div
              className="w-full text-center"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 text-white">
                <span className="block mb-2">Track, Analyze &</span>
                <span className="bg-gradient-to-r from-cgpa-blue to-cgpa-gold bg-clip-text text-transparent">
                  Improve Your CGPA
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed">
                The ultimate tool for students to monitor academic performance, simulate future scenarios, and achieve
                their target CGPA with precision and ease.
              </p>
              <div className="flex flex-wrap gap-6 justify-center">
                <Button
                  size="lg"
                  asChild
                  className="bg-cgpa-blue hover:bg-cgpa-blue-dark text-white animate-bounce-light text-lg px-8 py-6"
                >
                  <Link href="/run">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={startTour}
                  className="border-white text-gray-800 dark:text-white hover:bg-white/10 text-lg px-8 py-6"
                >
                  Take a Tour <Info className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="mt-6 bg-cgpa-gold text-white p-4 md:p-5 rounded-lg shadow-lg animate-float max-w-md mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <p className="font-bold text-base md:text-lg">AI-Powered Analysis</p>
              <p className="text-sm md:text-base">
                Extract data from your transcript automatically with our advanced AI technology
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-white dark:bg-cgpa-navy animated-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-gradient"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Powerful Features for Academic Success
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Everything you need to track, analyze, and improve your academic performance
            </motion.p>
          </div>

          <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-2 md:px-0">
            {/* Upload Feature */}
            <motion.div
              ref={sectionRefs["feature-upload"]}
              custom={0}
              variants={cardVariants}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              className="feature-card"
            >
              <Card className="h-full border-t-4 border-t-cgpa-blue">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-cgpa-blue" />
                  </div>
                  <CardTitle>Upload Transcript</CardTitle>
                  <CardDescription>
                    Upload your academic transcript and let our AI extract your grades automatically
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our advanced AI can read and extract data from most university transcript formats, saving you time
                    and effort.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="text-cgpa-blue hover:text-cgpa-blue-dark">
                    Learn More <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Manual Input Feature */}
            <motion.div
              ref={sectionRefs["feature-manual"]}
              custom={1}
              variants={cardVariants}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              className="feature-card"
            >
              <Card className="h-full border-t-4 border-t-cgpa-gold">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-4">
                    <PenLine className="h-6 w-6 text-cgpa-gold" />
                  </div>
                  <CardTitle>Manual Input</CardTitle>
                  <CardDescription>Manually input your semester data with our intuitive interface</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Don't have a transcript? No problem! Our user-friendly interface makes it easy to input your grades
                    manually.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="text-cgpa-gold hover:text-cgpa-gold-dark">
                    Learn More <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Simulation Feature */}
            <motion.div
              ref={sectionRefs["feature-simulate"]}
              custom={2}
              variants={cardVariants}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              className="feature-card"
            >
              <Card className="h-full border-t-4 border-t-cgpa-blue">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <Calculator className="h-6 w-6 text-cgpa-blue" />
                  </div>
                  <CardTitle>CGPA Simulation</CardTitle>
                  <CardDescription>Simulate future semesters and see how they affect your CGPA</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Plan ahead by simulating different grade scenarios and see what you need to achieve your target
                    CGPA.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="text-cgpa-blue hover:text-cgpa-blue-dark">
                    Learn More <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Reports Feature */}
            <motion.div
              ref={sectionRefs["feature-reports"]}
              custom={3}
              variants={cardVariants}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              className="feature-card"
            >
              <Card className="h-full border-t-4 border-t-cgpa-gold">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-cgpa-gold"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <CardTitle>Detailed Reports</CardTitle>
                  <CardDescription>Get comprehensive reports and export them as PDFs</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Generate detailed reports with visualizations and insights about your academic performance.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="text-cgpa-gold hover:text-cgpa-gold-dark">
                    Learn More <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-cgpa-navy-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              How It Works
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Three simple steps to analyze and improve your academic performance
            </motion.p>
          </div>

          <div ref={howItWorksRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/*
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {/* Step 1 */}
            <motion.div
              custom={0}
              variants={cardVariants}
              initial="hidden"
              animate={howItWorksInView ? "visible" : "hidden"}
              className="text-center"
            >
              <div className="relative mb-6 mx-auto">
                <div className="w-20 h-20 rounded-full bg-cgpa-blue flex items-center justify-center text-white text-2xl font-bold mx-auto">
                  1
                </div>
                <div className="hidden md:block absolute top-1/2 left-full w-full h-1 bg-gradient-to-r from-cgpa-blue to-transparent transform -translate-y-1/2"></div>
              </div>
              <h3 className="text-xl font-bold mb-3">Upload or Input Data</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upload your transcript PDF or manually input your semester data
              </p>
              <img
                src={images.student1 || "/placeholder.svg"}
                alt="Student uploading transcript"
                className="mt-6 rounded-lg shadow-md mx-auto h-48 object-cover"
              />
            </motion.div>

            {/* Step 2 */}
            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              animate={howItWorksInView ? "visible" : "hidden"}
              className="text-center"
            >
              <div className="relative mb-6 mx-auto">
                <div className="w-20 h-20 rounded-full bg-cgpa-gold flex items-center justify-center text-white text-2xl font-bold mx-auto">
                  2
                </div>
                <div className="hidden md:block absolute top-1/2 left-full w-full h-1 bg-gradient-to-r from-cgpa-gold to-transparent transform -translate-y-1/2"></div>
              </div>
              <h3 className="text-xl font-bold mb-3">Analyze Your Performance</h3>
              <p className="text-gray-600 dark:text-gray-400">
                View your current CGPA and analyze your academic performance
              </p>
              <img
                src={images.student2 || "/placeholder.svg"}
                alt="Student analyzing performance"
                className="mt-6 rounded-lg shadow-md mx-auto h-48 object-cover"
              />
            </motion.div>

            {/* Step 3 */}
            <motion.div
              custom={2}
              variants={cardVariants}
              initial="hidden"
              animate={howItWorksInView ? "visible" : "hidden"}
              className="text-center"
            >
              <div className="relative mb-6 mx-auto">
                <div className="w-20 h-20 rounded-full bg-cgpa-blue flex items-center justify-center text-white text-2xl font-bold mx-auto">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Simulate Future Scenarios</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Plan future semesters and see what you need to achieve your target CGPA
              </p>
              <img
                src={images.student3 || "/placeholder.svg"}
                alt="Student planning future semesters"
                className="mt-6 rounded-lg shadow-md mx-auto h-48 object-cover"
              />
            </motion.div>
          </div>

          <div className="text-center mt-16">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-cgpa-blue to-cgpa-gold text-white hover:opacity-90"
            >
              <Link href="/run">
                Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-cgpa-navy">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              What Students Say
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join thousands of students who have improved their academic performance
            </motion.p>
          </div>

          <div ref={testimonialsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div
              custom={0}
              variants={cardVariants}
              initial="hidden"
              animate={testimonialsInView ? "visible" : "hidden"}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-full w-full text-gray-400"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div>
                      <CardTitle>Sarah Johnson</CardTitle>
                      <CardDescription>Computer Science Student</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    "This tool helped me track my progress and plan my remaining semesters effectively. I was able to
                    improve my CGPA from 3.2 to 3.8 in just two semesters!"
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              animate={testimonialsInView ? "visible" : "hidden"}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-full w-full text-gray-400"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div>
                      <CardTitle>Michael Chen</CardTitle>
                      <CardDescription>Engineering Student</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    "The simulation feature is a game-changer! I could see exactly what grades I needed to achieve my
                    target CGPA. The PDF extraction saved me hours of manual data entry."
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              custom={2}
              variants={cardVariants}
              initial="hidden"
              animate={testimonialsInView ? "visible" : "hidden"}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-full w-full text-gray-400"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div>
                      <CardTitle>Olivia Martinez</CardTitle>
                      <CardDescription>Business Student</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    "I was struggling to keep track of my academic progress until I found this tool. The intuitive
                    interface and detailed reports helped me identify areas for improvement."
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cgpa-blue to-cgpa-gold text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Improve Your Academic Performance?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of students who are using CGPA Analyzer to track, analyze, and improve their academic
            performance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button size="lg" asChild className="bg-white text-cgpa-blue hover:bg-gray-100 animate-pulse-light">
              <Link href="/run">
                Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Tour Dialog */}
      <Dialog open={showTour} onOpenChange={setShowTour}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{tourSteps[currentStep].title}</DialogTitle>
            <DialogDescription>{tourSteps[currentStep].description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <div>
              {currentStep > 0 && (
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={endTour}>
                Skip Tour
              </Button>
              <Button onClick={nextStep}>{currentStep < tourSteps.length - 1 ? "Next" : "Finish"}</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

