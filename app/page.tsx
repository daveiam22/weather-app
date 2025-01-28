'use client'

import { useState } from 'react'
import WeatherCard from '@/components/weather-card'
import { ZipCodeInput } from '@/components/zip-code-input'
import ThemeToggle from '@/components/theme-toggle'

export default function Home() {
  const [zipCodes, setZipCodes] = useState<string[]>(['10001', '90210', '60601'])

  const handleAddZipCode = (newZipCode: string) => {
    setZipCodes((prevZipCodes) => {
      const filteredZipCodes = prevZipCodes.filter((zip) => zip !== newZipCode)
      return [...filteredZipCodes, newZipCode].slice(-3) // Keep only the last 3 ZIP codes
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Weather App</h1>
          <ThemeToggle />
        </div>
        <div className="mb-8">
          <ZipCodeInput onZipCodeChange={handleAddZipCode} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {zipCodes.map((zipCode) => (
            <WeatherCard key={zipCode} zipCode={zipCode} />
          ))}
        </div>
      </div>
    </div>
  )
}

