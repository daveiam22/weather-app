'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ZipCodeInputProps {
  onZipCodeChange: (zipCode: string) => void
}

export function ZipCodeInput({ onZipCodeChange }: ZipCodeInputProps) {
  const [zipCode, setZipCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (zipCode.trim()) {
      onZipCodeChange(zipCode.trim())
      setZipCode('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        placeholder="Enter ZIP code"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        className="flex-grow"
        pattern="[0-9]{5}"
        title="Five digit ZIP code"
        maxLength={5}
        required
      />
      <Button type="submit">Get the Damn Weather</Button>
    </form>
  )
}

