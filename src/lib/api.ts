import type { PrayerTime, MonthlyPrayerTimes, City } from "./types"

const API_BASE_URL = "https://api.myquran.com/v2"

export async function fetchPrayerTimes(cityId: string, date: string): Promise<PrayerTime> {
  try {
    const response = await fetch(`${API_BASE_URL}/sholat/jadwal/${cityId}/${date}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch prayer times: ${response.status}`)
    }

    const data = await response.json()

    if (!data.status) {
      throw new Error(data.message || "Failed to fetch prayer times")
    }

    return data.data
  } catch (error) {
    console.error("Error fetching prayer times:", error)
    throw error
  }
}

export async function fetchMonthlyPrayerTimes(
  cityId: string,
  year: string,
  month: string,
): Promise<MonthlyPrayerTimes> {
  try {
    const response = await fetch(`${API_BASE_URL}/sholat/jadwal/${cityId}/${year}/${month}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch monthly prayer times: ${response.status}`)
    }

    const data = await response.json()

    if (!data.status) {
      throw new Error(data.message || "Failed to fetch monthly prayer times")
    }

    return data.data
  } catch (error) {
    console.error("Error fetching monthly prayer times:", error)
    throw error
  }
}

export async function fetchCities(): Promise<City[]> {
    const response = await fetch(`https://api.myquran.com/v2/sholat/kota/semua`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch cities: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.status || !Array.isArray(result.data)) {
      throw new Error("Invalid response from API");
    }
    
    // Transform API data format to match our City type
    return result.data.map((item: { id: string; lokasi: string }) => ({
      id: item.id,
      name: item.lokasi,
    }));
  }