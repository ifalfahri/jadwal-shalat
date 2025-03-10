import { CitySelector } from "@/components/city-selector";
import { DateSelector } from "@/components/date-selector";
import {
  BasicSkeleton,
  PrayerTimesDisplaySkeleton,
} from "@/components/fallback";
import { PrayerTimesDisplay } from "@/components/prayer-times-display";
import { ViewToggle } from "@/components/view-toggle";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-emerald-800 dark:text-emerald-200 mb-8">
          Jadwal Shalat
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 flex-wrap mb-6">
            <div className="md:w-auto">
              <Suspense fallback={<BasicSkeleton />}>
                <ViewToggle />
              </Suspense>
            </div>
            <div className="md:flex-1">
              <Suspense fallback={<BasicSkeleton />}>
                <CitySelector />
              </Suspense>
            </div>
            <div className="md:flex-1">
              <Suspense fallback={<BasicSkeleton />}>
                <DateSelector />
              </Suspense>
            </div>
          </div>
          <Suspense fallback={<PrayerTimesDisplaySkeleton />}>
            <PrayerTimesDisplay />
          </Suspense>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Data provided by{" "}
          <Link
            className="hover:text-emerald-500"
            href="https://documenter.getpostman.com/view/841292/2s9YsGittd"
          >
            MyQuran API
          </Link>{" "}
          © {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  );
}
