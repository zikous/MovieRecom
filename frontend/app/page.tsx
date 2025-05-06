"use client";
import { MovieGrid } from "@/components/movie-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import { MovieSkeleton } from "@/components/movie-skeleton";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchMoviesByCategory } from "@/lib/api";
import type { Movie } from "@/lib/types";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<{ [key: string]: Movie[] }>({});
  const [activeCategory, setActiveCategory] = useState("popular");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const categories = ["popular", "top-rated", "upcoming", "recommended"];
        const moviesData: { [key: string]: Movie[] } = {};

        for (const category of categories) {
          moviesData[category] = await fetchMoviesByCategory(category);
        }

        setMovies(moviesData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredMovies = searchQuery.trim()
    ? Object.fromEntries(
        Object.entries(movies).map(([category, movieList]) => [
          category,
          movieList.filter((movie) =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        ])
      )
    : movies;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-500">
            MovieMind
          </h1>
          <p className="text-gray-400 max-w-md">
            Discover movies tailored to your taste
          </p>
        </div>

        <div className="relative mb-12 max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
          />
        </div>

        <Tabs
          defaultValue="popular"
          className="w-full"
          onValueChange={(value) => setActiveCategory(value)}
        >
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-4 mb-12 bg-gray-800/30 backdrop-blur-sm rounded-full p-1 border border-gray-800">
            <TabsTrigger
              value="popular"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white"
            >
              Popular
            </TabsTrigger>
            <TabsTrigger
              value="top-rated"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white"
            >
              Top Rated
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="recommended"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white"
            >
              For You
            </TabsTrigger>
          </TabsList>

          <TabsContent value="popular">
            <Suspense fallback={<MovieSkeleton count={12} />}>
              <MovieGrid movies={filteredMovies[activeCategory] || []} />
            </Suspense>
          </TabsContent>

          <TabsContent value="top-rated">
            <Suspense fallback={<MovieSkeleton count={12} />}>
              <MovieGrid movies={filteredMovies[activeCategory] || []} />
            </Suspense>
          </TabsContent>

          <TabsContent value="upcoming">
            <Suspense fallback={<MovieSkeleton count={12} />}>
              <MovieGrid movies={filteredMovies[activeCategory] || []} />
            </Suspense>
          </TabsContent>

          <TabsContent value="recommended">
            <Suspense fallback={<MovieSkeleton count={12} />}>
              <MovieGrid movies={filteredMovies[activeCategory] || []} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
