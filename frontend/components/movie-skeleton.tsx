import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function MovieSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl">
          <Skeleton className="aspect-[2/3] w-full rounded-t-2xl" />
          <div className="p-5">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-6 rounded-full" />
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
