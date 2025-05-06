"use client";
import { useEffect, useState } from "react";
import type { Movie } from "@/lib/types";
import { fetchUserRating, getMovie, submitRating } from "@/lib/api";
import { StarRating } from "./star-rating";
import { Button } from "./ui/button";
import { ArrowLeft, Calendar, Clock, Film } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

export function MovieDetail({ id }: { id: number }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchMovieAndRating() {
      try {
        const data = await getMovie(id);
        setMovie(data);

        const userRatingData = await fetchUserRating(id);
        setUserRating(userRatingData || null);
      } catch (error) {
        console.error("Error fetching movie or user rating:", error);
      }
    }

    fetchMovieAndRating();
  }, [id]);

  const handleRatingChange = async (rating: number) => {
    if (isSubmitting || !movie) return;

    setIsSubmitting(true);
    setUserRating(rating);

    try {
      await submitRating(movie.id, rating);
      toast({
        title: "Rating submitted",
        description: `You rated "${movie.title}" ${rating} stars`,
      });
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  const backdropUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : `/placeholder.svg?height=1080&width=1920`;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `/placeholder.svg?height=750&width=500`;

  return (
    <div>
      <Link href="/">
        <Button variant="ghost" className="mb-8 hover:bg-gray-800/50">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Movies
        </Button>
      </Link>

      <div className="relative w-full h-[50vh] mb-12 rounded-3xl overflow-hidden">
        <Image
          src={backdropUrl || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <motion.div
          className="absolute bottom-0 left-0 p-8 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500">
            {movie.title}
          </h1>
          <div className="flex items-center gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-lg font-medium">
                {movie.vote_average?.toFixed(1)}
              </span>
            </div>
            {movie.genres && (
              <div className="flex items-center gap-2">
                <Film className="h-4 w-4 text-fuchsia-400" />
                <span>{movie.genres}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-fuchsia-400" />
              <span>2023</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-fuchsia-400" />
              <span>120 min</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-[350px_1fr] gap-12">
        <motion.div
          className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Image
            src={posterUrl || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold mb-6">Overview</h2>
          <p className="text-gray-300 mb-10 text-lg leading-relaxed">
            {movie.overview}
          </p>

          <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
            <h3 className="text-xl font-medium mb-6">Rate this movie</h3>
            <StarRating
              value={userRating || 0}
              onChange={handleRatingChange}
              disabled={isSubmitting}
              size="large"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
