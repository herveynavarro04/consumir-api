"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSearchParams } from "next/navigation"

interface PokemonListItem {
  name: string
  url: string
}

interface PokemonCardData {
  id: number
  name: string
  sprites: {
    front_default: string
  }
  types: Array<{
    type: {
      name: string
    }
  }>
}

const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-300",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-green-400",
  rock: "bg-yellow-800",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
}

export default function PokemonGrid({ initialPokemon }: { initialPokemon: PokemonListItem[] }) {
  const [pokemonData, setPokemonData] = useState<PokemonCardData[]>([])
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonCardData[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const search = searchParams.get("search") || ""
  const type = searchParams.get("type") || "all"

  useEffect(() => {
    const fetchPokemonData = async () => {
      setLoading(true)
      try {
        const promises = initialPokemon.slice(0, 50).map(async (pokemon) => {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
          return response.json()
        })

        const results = await Promise.all(promises)
        setPokemonData(results)
      } catch (error) {
        console.error("Error fetching Pokemon data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPokemonData()
  }, [initialPokemon])

  useEffect(() => {
    let filtered = pokemonData

    if (search) {
      filtered = filtered.filter((pokemon) => pokemon.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (type !== "all") {
      filtered = filtered.filter((pokemon) => pokemon.types.some((t) => t.type.name === type))
    }

    setFilteredPokemon(filtered)
  }, [pokemonData, search, type])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filteredPokemon.map((pokemon) => (
        <Link key={pokemon.id} href={`/pokemon/${pokemon.name}`}>
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-3 bg-gray-50 rounded-full flex items-center justify-center">
                  <Image
                    src={pokemon.sprites.front_default || "/placeholder.svg"}
                    alt={pokemon.name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <h3 className="font-semibold capitalize text-gray-800 mb-2">{pokemon.name}</h3>
                <p className="text-sm text-gray-500 mb-2">#{pokemon.id.toString().padStart(3, "0")}</p>
                <div className="flex justify-center gap-1 flex-wrap">
                  {pokemon.types.map((type) => (
                    <Badge
                      key={type.type.name}
                      className={`${typeColors[type.type.name] || "bg-gray-400"} text-white text-xs`}
                    >
                      {type.type.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}