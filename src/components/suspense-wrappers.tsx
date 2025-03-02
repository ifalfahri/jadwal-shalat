import { Suspense, ReactNode } from "react"

type SuspenseWrapperProps = {
  children: ReactNode
  fallback?: ReactNode
}

export function SearchParamsSuspenseWrapper({ 
  children, 
  fallback = <div>Loading...</div> 
}: SuspenseWrapperProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>
}