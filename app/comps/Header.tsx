'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed w-full  bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="ml-15 text-3xl font-bold text-gray-800">
            Portfolio 
          </div>
          
          {/* Desktop Menu */}
          <div className=" mr-15 hidden md:flex space-x-8">
            <Link href="#home" className="text-gray-900 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="#about" className="text-gray-900 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="#projects" className="text-gray-900 hover:text-blue-600 transition-colors">
              Projects
            </Link>
            <Link href="/blog" className="text-gray-900 hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <Link href="#contact" className="text-gray-900 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${isOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-gray-600 mt-1 transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-gray-600 mt-1 transition-all ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <Link href="#home" className="block py-2 text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="#about" className="block py-2 text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="#projects" className="block py-2 text-gray-600 hover:text-gray-900">
              Projects
            </Link>
            <Link href="#skills" className="block py-2 text-gray-600 hover:text-gray-900">
              Skills
            </Link>
            <Link href="/blog" className="block py-2 text-gray-600 hover:text-gray-900">
              Blog
            </Link>
            <Link href="#contact" className="block py-2 text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}