"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    // Prevent body scrolling when menu is open
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 dark:bg-cgpa-navy-dark/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gradient">CGPA Analyzer</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-cgpa-blue ${
                pathname === "/" ? "text-cgpa-blue" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Home
            </Link>
            <Link
              href="/run"
              className={`text-sm font-medium transition-colors hover:text-cgpa-blue ${
                pathname === "/run" ? "text-cgpa-blue" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Analyzer
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-cgpa-blue ${
                pathname === "/about" ? "text-cgpa-blue" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              About
            </Link>
            <ModeToggle />
            <button className="bg-gradient-to-r from-cgpa-blue to-cgpa-gold text-white hover:opacity-90 px-4 py-2 rounded-md text-sm font-medium">
              <Link href="/run">Get Started</Link>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ModeToggle />
            <button
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={toggleMobileMenu}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Side Navigation - Full width with solid background */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={toggleMobileMenu}
            />

            {/* Side Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-xs bg-cgpa-blue z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-white/20">
                  <Link href="/" className="text-2xl font-bold text-white">
                    CGPA Analyzer
                  </Link>
                  <button onClick={toggleMobileMenu} className="p-2 rounded-md text-white hover:bg-white/10">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-8 px-6 space-y-8">
                  <Link
                    href="/"
                    className={`block text-2xl font-medium transition-colors hover:text-white/80 ${
                      pathname === "/" ? "text-white" : "text-white/90"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/run"
                    className={`block text-2xl font-medium transition-colors hover:text-white/80 ${
                      pathname === "/run" ? "text-white" : "text-white/90"
                    }`}
                  >
                    Analyzer
                  </Link>
                  <Link
                    href="/about"
                    className={`block text-2xl font-medium transition-colors hover:text-white/80 ${
                      pathname === "/about" ? "text-white" : "text-white/90"
                    }`}
                  >
                    About
                  </Link>
                </div>

                <div className="p-6 border-t border-white/20">
                  <button className="w-full bg-white text-cgpa-blue hover:bg-white/90 px-4 py-4 rounded-md text-xl font-medium">
                    <Link href="/run">Get Started</Link>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

