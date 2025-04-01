"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter, Instagram, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-cgpa-navy-dark dark:to-cgpa-navy-light p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">About Me</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">The developer behind CGPA Analyzer</p>
        </motion.div>

        <Card className="border-cgpa-blue/20 shadow-lg overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="md:order-2 flex-shrink-0"
              >
                <div className="rounded-full overflow-hidden shadow-xl w-24 h-24 md:w-32 md:h-32 mx-auto md:mx-0">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snapchat-833623666.jpg-3bnXBFoALsPQUWz6OjC5QwdfJd0H4u.jpeg"
                    alt="Oluwaseun - CGPA Analyzer Developer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:order-1 flex-grow"
              >
                <h2 className="text-2xl font-bold mb-4 text-cgpa-blue">Hello, I'm Oluwaseun</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  I'm a passionate Software Engineer and Aerospace Engineering student with a love for building tools
                  that solve real-world problems.
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  The CGPA Analyzer was born from my desire to help students track and improve their academic
                  performance. As a student myself, I understand the challenges of maintaining good grades and planning
                  for future semesters.
                </p>
                <p className="mb-6 text-gray-700 dark:text-gray-300">
                  When I'm not coding or studying, I enjoy exploring new technologies, contributing to open-source
                  projects, and mentoring aspiring developers.
                </p>

                <div className="space-y-3">
                  <h3 className="font-semibold text-cgpa-gold">Connect with me:</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" asChild className="gap-2">
                      <Link href="https://github.com/yourusername" target="_blank">
                        <Github size={16} /> GitHub
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="gap-2">
                      <Link href="https://linkedin.com/in/yourusername" target="_blank">
                        <Linkedin size={16} /> LinkedIn
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="gap-2">
                      <Link href="https://twitter.com/yourusername" target="_blank">
                        <Twitter size={16} /> Twitter
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="gap-2">
                      <Link href="https://instagram.com/yourusername" target="_blank">
                        <Instagram size={16} /> Instagram
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="gap-2">
                      <Link href="mailto:your.email@example.com">
                        <Mail size={16} /> Email Me
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="gap-2">
                      <Link href="tel:+1234567890">
                        <Phone size={16} /> WhatsApp
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Button asChild className="bg-gradient-to-r from-cgpa-blue to-cgpa-gold text-white hover:opacity-90">
            <Link href="/run">Try CGPA Analyzer</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

