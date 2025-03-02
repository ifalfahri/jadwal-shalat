export const CitySelectorSkeleton = () => (
    <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
  );
  
export const DateSelectorSkeleton = () => (
    <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
  );
  
export const PrayerTimesDisplaySkeleton = () => (
    <div className="space-y-4">
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );