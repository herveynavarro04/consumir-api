import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pokédex Next.js",
  description: "Una Pokédex moderna construida con Next.js y la PokéAPI",
  keywords: ["pokemon", "pokedex", "nextjs", "react"],
  authors: [{ name: "Tu Nombre" }],
  openGraph: {
    title: "Pokédex Next.js",
    description: "Explora el mundo Pokémon con nuestra Pokédex interactiva",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}