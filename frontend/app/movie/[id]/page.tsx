import { MovieDetail } from "@/components/movie-detail";
import { Suspense } from "react";
import { MovieDetailSkeleton } from "@/components/movie-detail-skeleton";

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<MovieDetailSkeleton />}>
          <MovieDetail id={Number.parseInt(id)} />
        </Suspense>
      </div>
    </main>
  );
}
