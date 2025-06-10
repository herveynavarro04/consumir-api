import { Suspense } from "react"
import PokemonGrid from "@/components/pokemon-grid"
import SearchAndFilters from "@/components/search-and-filters"
import { Card, CardContent } from "@/components/ui/card"

async function getPokemonList() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
    if (!response.ok) throw new Error("Failed to fetch")
    const data = await response.json()
    return data.results
  } catch (error) {
    console.error("Error fetching Pokemon list:", error)
    return []
  }
}

async function getPokemonTypes() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/type", {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })
    if (!response.ok) throw new Error("Failed to fetch")
    const data: { results: { name: string; url: string }[] } = await response.json()
    return data.results.map((type: { name: string; url: string }) => type.name)
  } catch (error) {
    console.error("Error fetching types:", error)
    return []
  }
}

function LoadingSkeleton() {
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

export default async function HomePage() {
  const [pokemonList, pokemonTypes] = await Promise.all([getPokemonList(), getPokemonTypes()])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Pokédex</h1>
          <p className="text-gray-600 text-lg">Projecto para consumir api</p>
        </header>

        <SearchAndFilters types={pokemonTypes} />

        <Suspense fallback={<LoadingSkeleton />}>
          <PokemonGrid initialPokemon={pokemonList} />
        </Suspense>
      </div>
    </div>
  )
}