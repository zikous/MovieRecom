"use client";

import { MovieCard } from "./movie-card";
import type { Movie } from "@/lib/types";
import { motion } from "framer-motion";

export function MovieGrid({ movies }: { movies: Movie[] }) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium text-gray-400 mb-3">
          No movies found
        </h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {movies.map((movie, index) => (
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <MovieCard movie={movie} />
        </motion.div>
      ))}
    </div>
  );
}
