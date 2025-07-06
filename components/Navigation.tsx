'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navigation = () => {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/discover', label: 'Discover' }
  ]

  return (
    <div className="flex items-center gap-6 ml-8">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
            pathname === item.href
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}

export default Navigation
