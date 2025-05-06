"use client";

import type { Movie } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { StarRating } from "./star-rating";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { submitRating, fetchUserRating } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export function MovieCard({ movie }: { movie: Movie }) {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const rating = await fetchUserRating(movie.id);
        setUserRating(rating);
      } catch (error) {
        console.error("Error fetching ratings:", error);
        setUserRating(null);
      }
    };

    fetchRating();
  }, [movie.id]);

  const handleRatingChange = async (rating: number) => {
    if (isSubmitting) return;

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

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `/placeholder.svg?height=750&width=500`;

  return (
    <Card className="movie-card overflow-hidden bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl">
      <Link href={`/movie/${movie.id}`} className="block relative">
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-2xl">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <p className="text-sm text-gray-300 line-clamp-3">
              {movie.overview}
            </p>
          </div>
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-full px-2.5 py-1 text-xs font-bold flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span>{movie.vote_average?.toFixed(1)}</span>
          </div>
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/movie/${movie.id}`}>
          <h3 className="font-bold text-lg mb-1 line-clamp-1 hover:text-fuchsia-400 transition-colors">
            {movie.title}
          </h3>
        </Link>
        <div className="text-xs text-gray-400 mb-4 line-clamp-1">
          {movie.genres}
        </div>
        <StarRating
          value={userRating || 0}
          onChange={handleRatingChange}
          disabled={isSubmitting}
        />
      </div>
    </Card>
  );
}
