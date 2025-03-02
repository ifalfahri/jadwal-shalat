"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { useSearchParams } from "next/navigation"
import { Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchPrayerTimes, fetchMonthlyPrayerTimes } from "@/lib/api"
import type { PrayerTime, MonthlyPrayerTimes } from "@/lib/types"

export function PrayerTimesDisplay() {
  const searchParams = useSearchParams()
  const cityId = searchParams.get("cityId") || "1301" // Default to Jakarta
  const dateParam = searchParams.get("date") || format(new Date(), "yyyy-MM-dd")
  const view = searchParams.get("view") || "daily"

  const [prayerTimes, setPrayerTimes] = useState<PrayerTime | null>(null)
  const [monthlyTimes, setMonthlyTimes] = useState<MonthlyPrayerTimes | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Fetch prayer times based on selected city and date
  useEffect(() => {
    setLoading(true)

    if (view === "daily") {
      fetchPrayerTimes(cityId, dateParam)
        .then((data) => {
          setPrayerTimes(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching prayer times:", error)
          setLoading(false)
        })
    } else {
      const [year, month] = dateParam.split("-")
      fetchMonthlyPrayerTimes(cityId, year, month)
        .then((data) => {
          setMonthlyTimes(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching monthly prayer times:", error)
          setLoading(false)
        })
    }
  }, [cityId, dateParam, view])

  // Format time for comparison
  const formatTimeForComparison = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number)
    const now = new Date()
    now.setHours(hours, minutes, 0, 0)
    return now
  }

// Check if a prayer time is active (most recent prayer before current time)
const isActivePrayer = (prayerName: string) => {
    if (!prayerTimes) return false

    const now = currentTime
    const prayers = [
      { name: "Imsak", time: prayerTimes.jadwal.imsak },
      { name: "Subuh", time: prayerTimes.jadwal.subuh },
      { name: "Terbit", time: prayerTimes.jadwal.terbit },
      { name: "Dhuha", time: prayerTimes.jadwal.dhuha },
      { name: "Dzuhur", time: prayerTimes.jadwal.dzuhur },
      { name: "Ashar", time: prayerTimes.jadwal.ashar },
      { name: "Maghrib", time: prayerTimes.jadwal.maghrib },
      { name: "Isya", time: prayerTimes.jadwal.isya },
    ]
    
    // Find the most recent prayer before current time
    let lastPassedPrayer: string | null = null
    
    for (const prayer of prayers) {
      const prayerTime = formatTimeForComparison(prayer.time)
      
      if (now >= prayerTime) {
        lastPassedPrayer = prayer.name
      } else {
        break
      }
    }
    
    return prayerName === lastPassedPrayer
  }

  // Get next prayer time
  const getNextPrayer = () => {
    if (!prayerTimes) return null

    const prayers = [
      { name: "Subuh", time: prayerTimes.jadwal.subuh },
      { name: "Dzuhur", time: prayerTimes.jadwal.dzuhur },
      { name: "Ashar", time: prayerTimes.jadwal.ashar },
      { name: "Maghrib", time: prayerTimes.jadwal.maghrib },
      { name: "Isya", time: prayerTimes.jadwal.isya },
    ]

    const now = currentTime

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(":").map(Number)
      const prayerTime = new Date(now)
      prayerTime.setHours(hours, minutes, 0, 0)

      if (prayerTime > now) {
        return prayer
      }
    }

    // If all prayers for today have passed, return tomorrow's Subuh
    return { name: "Subuh (besok)", time: prayerTimes.jadwal.subuh }
  }

  const nextPrayer = getNextPrayer()

  if (loading) {
    return (
      <div className="space-y-4 mt-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (view === "daily" && prayerTimes) {
    const { jadwal, lokasi, daerah } = prayerTimes

    return (
      <div className="mt-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300">
            {lokasi}, {daerah}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{jadwal.tanggal}</p>

          {nextPrayer && (
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900 rounded-lg flex items-center">
              <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
              <span className="text-emerald-800 dark:text-emerald-200">
                Waktu shalat selanjutnya: <strong>{nextPrayer.name}</strong> pada <strong>{nextPrayer.time}</strong>
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Imsak", time: jadwal.imsak },
            { name: "Subuh", time: jadwal.subuh },
            { name: "Terbit", time: jadwal.terbit },
            { name: "Dhuha", time: jadwal.dhuha },
            { name: "Dzuhur", time: jadwal.dzuhur },
            { name: "Ashar", time: jadwal.ashar },
            { name: "Maghrib", time: jadwal.maghrib },
            { name: "Isya", time: jadwal.isya },
        ].map((prayer) => {
            const isActive = isActivePrayer(prayer.name)

            return (
              <Card
                key={prayer.name}
                className={`overflow-hidden transition-all duration-100 hover:bg-emerald-50 hover:shadow-md ${isActive ? "bg-emerald-50 dark:bg-emerald-900 border-emerald-500 dark:border-emerald-400 shadow-md" : ""}`}
              >
                <CardContent className="p-0">
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{prayer.name}</h3>
                    <p
                      className={`text-2xl font-bold ${
                        isActive ? "text-emerald-600 dark:text-emerald-300" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {prayer.time}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  if (view === "monthly" && monthlyTimes) {
    const { jadwal, lokasi, daerah } = monthlyTimes

    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-4">
          {lokasi}, {daerah}
        </h2>

        <Tabs defaultValue="table" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-emerald-100 dark:bg-emerald-800">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-center">Imsak</th>
                    <th className="p-2 text-center">Subuh</th>
                    <th className="p-2 text-center">Dzuhur</th>
                    <th className="p-2 text-center">Ashar</th>
                    <th className="p-2 text-center">Maghrib</th>
                    <th className="p-2 text-center">Isya</th>
                  </tr>
                </thead>
                <tbody>
                  {jadwal.map((day, index) => (
                    <tr
                      key={day.date}
                      className={`${
                        index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-750"
                      } hover:bg-emerald-50 dark:hover:bg-emerald-900/30`}
                    >
                      <td className="p-2 border-b border-gray-200 dark:border-gray-700">{day.tanggal}</td>
                      <td className="p-2 text-center border-b border-gray-200 dark:border-gray-700">{day.imsak}</td>
                      <td className="p-2 text-center border-b border-gray-200 dark:border-gray-700">{day.subuh}</td>
                      <td className="p-2 text-center border-b border-gray-200 dark:border-gray-700">{day.dzuhur}</td>
                      <td className="p-2 text-center border-b border-gray-200 dark:border-gray-700">{day.ashar}</td>
                      <td className="p-2 text-center border-b border-gray-200 dark:border-gray-700">{day.maghrib}</td>
                      <td className="p-2 text-center border-b border-gray-200 dark:border-gray-700">{day.isya}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <div className="space-y-4">
              {jadwal.map((day) => (
                <Card key={day.date}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{day.tanggal}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Imsak</p>
                        <p className="font-medium">{day.imsak}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Subuh</p>
                        <p className="font-medium">{day.subuh}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Dzuhur</p>
                        <p className="font-medium">{day.dzuhur}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Ashar</p>
                        <p className="font-medium">{day.ashar}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Maghrib</p>
                        <p className="font-medium">{day.maghrib}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Isya</p>
                        <p className="font-medium">{day.isya}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-300">
      Failed to load prayer times. Please try again.
    </div>
  )
}

