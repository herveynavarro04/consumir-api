"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export default function FavoriteButton({ pokemonId }: { pokemonId: number }) {
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("pokemonFavorites") || "[]")
    setIsFavorite(favorites.includes(pokemonId))
  }, [pokemonId])

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("pokemonFavorites") || "[]")
    let newFavorites

    if (favorites.includes(pokemonId)) {
      newFavorites = favorites.filter((id: number) => id !== pokemonId)
    } else {
      newFavorites = [...favorites, pokemonId]
    }

    localStorage.setItem("pokemonFavorites", JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleFavorite}
      className={isFavorite ? "text-red-500" : "text-gray-400"}
    >
      <Heart className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`} />
    </Button>
  )
}
