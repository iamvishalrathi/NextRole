'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchFiltersProps {
  searchParams: {
    search?: string
    category?: 'mock' | 'job' | 'all'
    type?: 'technical' | 'behavioral' | 'mixed' | 'all'
    level?: 'entry' | 'mid' | 'senior' | 'all'
  }
  totalCount: number
}

const SearchFilters = ({ searchParams, totalCount }: SearchFiltersProps) => {
  const router = useRouter()
  const params = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '')

  // Update search term when searchParams changes
  useEffect(() => {
    setSearchTerm(searchParams.search || '')
  }, [searchParams.search])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const current = new URLSearchParams(Array.from(params.entries()))
      
      if (searchTerm === '') {
        current.delete('search')
      } else {
        current.set('search', searchTerm)
      }
      
      const search = current.toString()
      const query = search ? `?${search}` : ''
      router.push(`/discover${query}`)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, params, router])

  const updateFilter = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(params.entries()))
    
    if (value === 'all' || value === '') {
      current.delete(key)
    } else {
      current.set(key, value)
    }
    
    const search = current.toString()
    const query = search ? `?${search}` : ''
    router.push(`/discover${query}`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    router.push('/discover')
  }

  // Generate placeholder text based on selected filters
  const getSearchPlaceholder = () => {
    let placeholder = 'Search by role...'
    
    if (searchParams.category && searchParams.category !== 'all') {
      placeholder = `Search ${searchParams.category} interview roles...`
    }
    
    if (searchParams.type && searchParams.type !== 'all') {
      placeholder = `Search ${searchParams.type} roles...`
    }
    
    if (searchParams.level && searchParams.level !== 'all') {
      placeholder = `Search ${searchParams.level} level roles...`
    }
    
    if (searchParams.category && searchParams.category !== 'all' && 
        searchParams.type && searchParams.type !== 'all') {
      placeholder = `Search ${searchParams.type} ${searchParams.category} roles...`
    }
    
    return placeholder
  }

  return (
    <div className="card-border w-full mb-8">
      <div className="dark-gradient rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-primary-100">Filter Interviews</h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-primary-300">Found:</span>
              <span className="text-lg font-semibold text-primary-100">{totalCount}</span>
              <span className="text-sm text-primary-300">interviews</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="text-sm border-primary-500/30 text-primary-200 hover:bg-primary-500/20"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Search Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-primary-300">
              Search Roles
            </label>
            <Input
              placeholder={getSearchPlaceholder()}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 px-4 bg-dark-200 border-primary-500/30 text-primary-100 placeholder:text-light-400 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-primary-300">
              Category
            </label>
            <select
              value={searchParams.category || 'all'}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full h-12 px-4 bg-dark-200 border border-primary-500/30 text-primary-100 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
            >
              <option value="all" className="bg-dark-200 text-primary-100">All Categories</option>
              <option value="mock" className="bg-dark-200 text-primary-100">Mock Interviews</option>
              <option value="job" className="bg-dark-200 text-primary-100">Job Interviews</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-primary-300">
              Interview Type
            </label>
            <select
              value={searchParams.type || 'all'}
              onChange={(e) => updateFilter('type', e.target.value)}
              className="w-full h-12 px-4 bg-dark-200 border border-primary-500/30 text-primary-100 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
            >
              <option value="all" className="bg-dark-200 text-primary-100">All Types</option>
              <option value="technical" className="bg-dark-200 text-primary-100">Technical</option>
              <option value="behavioral" className="bg-dark-200 text-primary-100">Behavioral</option>
              <option value="mixed" className="bg-dark-200 text-primary-100">Mixed</option>
            </select>
          </div>

          {/* Level Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-primary-300">
              Experience Level
            </label>
            <select
              value={searchParams.level || 'all'}
              onChange={(e) => updateFilter('level', e.target.value)}
              className="w-full h-12 px-4 bg-dark-200 border border-primary-500/30 text-primary-100 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
            >
              <option value="all" className="bg-dark-200 text-primary-100">All Levels</option>
              <option value="entry" className="bg-dark-200 text-primary-100">Entry Level</option>
              <option value="mid" className="bg-dark-200 text-primary-100">Mid Level</option>
              <option value="senior" className="bg-dark-200 text-primary-100">Senior Level</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchFilters
