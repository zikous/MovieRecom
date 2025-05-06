import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function MovieDetailSkeleton() {
  return (
    <div>
      <Link href="/">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Movies
        </Button>
      </Link>

      <Skeleton className="w-full h-[50vh] mb-12 rounded-3xl" />

      <div className="grid md:grid-cols-[350px_1fr] gap-12">
        <Skeleton className="aspect-[2/3] rounded-2xl" />
        <div>
          <Skeleton className="h-8 w-1/2 mb-6" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-3/4 mb-10" />

          <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
            <Skeleton className="h-6 w-1/3 mb-6" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
