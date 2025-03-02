"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DateSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [date, setDate] = useState<Date>(new Date())
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const dateParam = searchParams.get("date")
    if (dateParam) {
      setDate(new Date(dateParam))
    }
  }, [searchParams])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return

    setDate(selectedDate)
    setOpen(false)

    const params = new URLSearchParams(searchParams.toString())
    params.set("date", format(selectedDate, "yyyy-MM-dd"))

    router.push(`?${params.toString()}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "EEEE, dd MMMM yyyy", { locale: id }) : <span>Pilih tanggal</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus locale={id} />
      </PopoverContent>
    </Popover>
  )
}

