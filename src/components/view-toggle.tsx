"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CalendarDays, CalendarIcon } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ViewToggle() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [view, setView] = useState<string>("daily")

  useEffect(() => {
    const viewParam = searchParams.get("view")
    if (viewParam) {
      setView(viewParam)
    }
  }, [searchParams])

  const handleViewChange = (value: string) => {
    if (!value) return

    setView(value)

    const params = new URLSearchParams(searchParams.toString())
    params.set("view", value)

    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex justify-center">
      <ToggleGroup type="single" value={view} onValueChange={handleViewChange}>
        <ToggleGroupItem value="daily" aria-label="Daily view" className="px-2">
          <CalendarIcon className="h-4 w-4" />
          Daily
        </ToggleGroupItem>
        <ToggleGroupItem value="monthly" aria-label="Monthly view" className="px-4">
          <CalendarDays className="h-4 w-4" />
          Monthly
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

