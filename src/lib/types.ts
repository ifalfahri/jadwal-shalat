export interface City {
    id: string
    name: string
  }
  
  export interface PrayerTimeData {
    tanggal: string
    imsak: string
    subuh: string
    terbit: string
    dhuha: string
    dzuhur: string
    ashar: string
    maghrib: string
    isya: string
    date: string
  }
  
  export interface PrayerTime {
    id: number
    lokasi: string
    daerah: string
    jadwal: PrayerTimeData
  }
  
  export interface MonthlyPrayerTimes {
    id: number
    lokasi: string
    daerah: string
    jadwal: PrayerTimeData[]
  }
  
  