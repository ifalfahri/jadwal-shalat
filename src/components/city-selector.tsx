"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { City } from "@/lib/types"
import { fetchCities } from "@/lib/api"

interface CitySelectorProps {
  defaultCity?: City
}

export function CitySelector({ defaultCity }: CitySelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState<City | null>(defaultCity || null)
 
  // Fetch cities from API when component mounts
  useEffect(() => {
    const loadCities = async () => {
      try {
        const fetchedCities = await fetchCities()
        setCities(fetchedCities)
      } catch (error) {
        console.error("Failed to load cities:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCities()
  }, [])

  // Set selected city from URL parameter when cities are loaded
  useEffect(() => {
    if (cities.length > 0) {
      const cityId = searchParams.get("cityId")
      if (cityId) {
        const city = cities.find((c) => c.id === cityId)
        if (city) {
          setSelectedCity(city)
        }
      }
    }
  }, [searchParams, cities])

  const handleCitySelect = (city: City) => {
    setSelectedCity(city)
    setOpen(false)

    const params = new URLSearchParams(searchParams.toString())
    params.set("cityId", city.id)

    router.push(`?${params.toString()}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {loading ? (
            "Memuat..."
          ) : selectedCity ? (
            selectedCity.name
          ) : (
            "Pilih Kota atau Kabupaten..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Cari Kota atau Kabupaten..." />
          <CommandList>
            {loading ? (
              <CommandItem disabled>Loading...</CommandItem>
            ) : (
              <>
                <CommandEmpty>Wilayah tidak ditemukan.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {cities.map((city) => (
                    <CommandItem
                      key={city.id}
                      value={city.name}
                      onSelect={() => handleCitySelect(city)}
                    >
                      <Check className={cn("mr-2 h-4 w-4", selectedCity?.id === city.id ? "opacity-100" : "opacity-0")} />
                      {city.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}