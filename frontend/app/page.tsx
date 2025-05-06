"use client";
import { MovieGrid } from "@/components/movie-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieSkeleton } from "@/components/movie-skeleton";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import {
  fetchMoviesByCategory,
  getMovieCategories,
  getRecommendations,
  getMovies,
} from "@/lib/api";
import type { Movie } from "@/lib/types";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentMovies, setCurrentMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getMovieCategories();
        setCategories(["all", ...fetchedCategories]);
        fetchMoviesForCategory("popular");
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchMoviesForCategory = async (category: string) => {
    setLoading(true);
    try {
      let moviesData: Movie[] = [];

      if (category === "for-you") {
        moviesData = await getRecommendations();
      } else if (category === "all") {
        moviesData = await getMovies();
      } else {
        moviesData = await fetchMoviesByCategory(category);
      }

      setCurrentMovies(moviesData);
    } catch (error) {
      console.error(`Error fetching movies for ${category}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    fetchMoviesForCategory(category);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredMovies = searchQuery.trim()
    ? currentMovies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentMovies;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-500">
            MovieScope
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
          value={activeCategory}
          className="w-full"
          onValueChange={handleCategoryChange}
        >
          <TabsList className="w-full max-w-md mx-auto flex justify-center gap-2 mb-12 bg-gray-800/30 backdrop-blur-sm rounded-full p-1 border border-gray-800">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
            <TabsTrigger
              key="for-you"
              value="for-you"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white"
            >
              For You
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <MovieSkeleton count={12} />
          ) : filteredMovies.length > 0 ? (
            <MovieGrid movies={filteredMovies} />
          ) : (
            <div className="text-center text-gray-400">Nothing found</div>
          )}
        </Tabs>
      </div>
    </main>
  );
}
