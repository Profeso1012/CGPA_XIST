import Link from "next/link"
import { Github, Linkedin, Twitter, Instagram, Mail, Phone } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-cgpa-navy-dark border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-gradient">CGPA Analyzer</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              The ultimate tool for students to track, analyze, and improve their academic performance.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-cgpa-blue">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-cgpa-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/run" className="text-gray-600 dark:text-gray-400 hover:text-cgpa-blue transition-colors">
                  Analyzer
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-cgpa-blue transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-cgpa-gold">Connect with Me</h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="https://github.com/yourusername"
                target="_blank"
                className="text-gray-600 dark:text-gray-400 hover:text-cgpa-blue transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </Link>
              <Link
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                className="text-gray-600 dark:text-gray-400 hover:text-cgpa-blue transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </Link>
              <Link
                href="https://twitter.com/yourusername"
                target="_blank"
                className="text-gray-600 dark:text-gray-400 hover:text-cgpa-blue transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="https://instagram.com/yourusername"
                target="_blank"
                className="text-gray-600 dark:text-gray-400 hover:text-cgpa-blue transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="mailto:your.email@example.com"
                className="text-gray-600 dark:text-gray-400 hover:text-cgpa-blue transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </Link>
              <Link
                href="tel:+1234567890"
                className="text-gray-600 dark:text-gray-400 hover:text-cgpa-blue transition-colors"
                aria-label="WhatsApp"
              >
                <Phone size={20} />
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Email: your.email@example.com
              <br />
              WhatsApp: +123 456 7890
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            &copy; {currentYear} Oluwaseun. All rights reserved. CGPA Analyzer is designed to help students track and
            improve their academic performance.
          </p>
        </div>
      </div>
    </footer>
  )
}

