import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, Sword, Shield, Zap } from "lucide-react"
import FavoriteButton from "@/components/favorite-button"
import StatBar from "@/components/stat-bar"

interface Pokemon {
  id: number
  name: string
  sprites: {
    front_default: string
    other: {
      "official-artwork": {
        front_default: string
      }
    }
  }
  types: Array<{
    type: {
      name: string
    }
  }>
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
  height: number
  weight: number
  abilities: Array<{
    ability: {
      name: string
    }
  }>
  species: {
    flavor_text_entries: Array<{
      flavor_text: string
      language: {
        name: string
      }
    }>
  }
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

async function getPokemon(name: string): Promise<Pokemon | null> {
  try {
    const [pokemonRes, speciesRes] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
        next: { revalidate: 3600 },
      }),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`, {
        next: { revalidate: 3600 },
      }),
    ])

    if (!pokemonRes.ok || !speciesRes.ok) return null

    const [pokemon, species] = await Promise.all([pokemonRes.json(), speciesRes.json()])

    return { ...pokemon, species }
  } catch (error) {
    console.error("Error fetching Pokemon:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { name: string } }) {
  const pokemon = await getPokemon(params.name)

  if (!pokemon) {
    return {
      title: "Pokémon no encontrado",
    }
  }

  return {
    title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} - Pokédex`,
    description: `Información detallada sobre ${pokemon.name}, incluyendo estadísticas, tipos y habilidades.`,
    openGraph: {
      title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} - Pokédex`,
      description: `Descubre todo sobre ${pokemon.name}`,
      images: [pokemon.sprites.other["official-artwork"].front_default],
    },
  }
}

function getStatIcon(statName: string) {
  switch (statName) {
    case "attack":
      return <Sword className="w-4 h-4" />
    case "defense":
      return <Shield className="w-4 h-4" />
    case "speed":
      return <Zap className="w-4 h-4" />
    default:
      return <Star className="w-4 h-4" />
  }
}

export default async function PokemonPage({ params }: { params: { name: string } }) {
  const pokemon = await getPokemon(params.name)

  if (!pokemon) {
    notFound()
  }

  const description =
    pokemon.species.flavor_text_entries.find((entry) => entry.language.name === "es")?.flavor_text ||
    pokemon.species.flavor_text_entries.find((entry) => entry.language.name === "en")?.flavor_text ||
    "No hay descripción disponible."

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la Pokédex
            </Button>
          </Link>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl capitalize flex items-center gap-3">
                {pokemon.name}
                <span className="text-gray-500 text-xl">#{pokemon.id.toString().padStart(3, "0")}</span>
              </CardTitle>
              <FavoriteButton pokemonId={pokemon.id} />
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Imagen y información básica */}
              <div className="text-center">
                <div className="relative w-64 h-64 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <Image
                    src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                    width={240}
                    height={240}
                    className="object-contain"
                    priority
                  />
                </div>

                <div className="flex justify-center gap-2 mb-6">
                  {pokemon.types.map((type) => (
                    <Badge
                      key={type.type.name}
                      className={`${typeColors[type.type.name] || "bg-gray-400"} text-white text-sm px-3 py-1`}
                    >
                      {type.type.name.toUpperCase()}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-blue-700 text-sm">Altura</p>
                    <p className="text-2xl font-bold text-blue-800">{pokemon.height / 10}m</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-semibold text-green-700 text-sm">Peso</p>
                    <p className="text-2xl font-bold text-green-800">{pokemon.weight / 10}kg</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-left">
                  <h3 className="font-semibold text-gray-700 mb-2">Descripción</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {description.replace(/\f/g, " ").replace(/\n/g, " ")}
                  </p>
                </div>
              </div>

              {/* Estadísticas y habilidades */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Estadísticas Base</h3>
                <div className="space-y-4 mb-8">
                  {pokemon.stats.map((stat) => (
                    <StatBar
                      key={stat.stat.name}
                      name={stat.stat.name}
                      value={stat.base_stat}
                      icon={getStatIcon(stat.stat.name)}
                    />
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-4">Habilidades</h3>
                <div className="grid grid-cols-1 gap-3 mb-8">
                  {pokemon.abilities.map((ability) => (
                    <div key={ability.ability.name} className="bg-white p-3 rounded-lg border">
                      <span className="font-medium capitalize text-gray-800">
                        {ability.ability.name.replace("-", " ")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Estadísticas totales */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-700 mb-2">Total de Estadísticas</h4>
                  <p className="text-2xl font-bold text-purple-800">
                    {pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}