'use client'

import { useState, useMemo } from 'react'
import { Command } from '@/components/ui/command'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { MOCK_BRANDS } from './mock-data'

interface Brand {
  id: string
  name: string
  logoUrl: string
  models: Model[]
}

interface Model {
  id: string
  name: string
  year: number
  brandId: string
}

export default function ModelChooser() {
  const [open, setOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [modelCommandOpen, setModelCommandOpen] = useState(false)

  const filteredResults = useMemo(() => {
    if (!searchQuery) {
      return {
        brands: MOCK_BRANDS,
        models: MOCK_BRANDS.flatMap(brand =>
          brand.models.map(model => ({
            ...model,
            brandName: brand.name
          }))
        )
      }
    }

    const searchLower = searchQuery.toLowerCase()
    const filteredBrands = MOCK_BRANDS.filter(brand =>
      brand.name.toLowerCase().includes(searchLower)
    )

    const filteredModels = MOCK_BRANDS.flatMap(brand =>
      brand.models
        .filter(model =>
          model.name.toLowerCase().includes(searchLower) ||
          brand.name.toLowerCase().includes(searchLower)
        )
        .map(model => ({
          ...model,
          brandName: brand.name
        }))
    )

    return { brands: filteredBrands, models: filteredModels }
  }, [searchQuery])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Choisissez votre véhicule</h1>

      {/* Barre de recherche rapide */}
      <div className="mb-12">
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <span>🔎 Rechercher un modèle...</span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen} title="Recherche de véhicule">
          <CommandInput
            placeholder="Rechercher une marque ou un modèle..."
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
            <CommandGroup heading="Modèles">
              {filteredResults.models.map(model => (
                <CommandItem
                  key={model.id}
                  onSelect={() => {
                    const brand = MOCK_BRANDS.find(b => b.id === model.brandId)
                    if (brand) {
                      setSelectedBrand(brand)
                      setSelectedModel(model)
                    }
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center">
                    {/* Afficher la première lettre de la marque si pas de logo */}
                    <span className="w-6 h-6 flex items-center justify-center mr-2 text-sm bg-secondary rounded">
                      {model.brandName[0]}
                    </span>
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-xs text-muted-foreground">{model.brandName}</div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Marques">
              {filteredResults.brands.map(brand => (
                <CommandItem
                  key={brand.id}
                  onSelect={() => {
                    setSelectedBrand(brand)
                    setOpen(false)
                  }}
                >
                  {brand.logoUrl ? (
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                  ) : (
                    <span className="mr-2">{brand.name[0].toUpperCase()}</span>
                  )}
                  {brand.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Sélection par marque</h2>
          <div className="flex flex-wrap gap-4">
            {MOCK_BRANDS.map(brand => (
              <Button
                key={brand.id}
                className="flex flex-col items-center justify-center p-4 w-[150px] h-[150px]"
                onClick={() => {
                  setSelectedBrand(brand)
                  setOpen(false)
                }}
              >
                {brand.logoUrl ? (
                  <Image
                    src={brand.logoUrl}
                    alt={brand.name}
                    width={64}
                    height={64}
                    className="mb-2"
                  />
                ) : (
                  <span className="text-4xl">{brand.name[0].toUpperCase()}</span>
                )}
                <span className="text-sm">{brand.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Sélecteur de modèle */}
        {selectedBrand && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">
              Sélectionnez un modèle {selectedBrand.name}
            </h3>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setModelCommandOpen(true)}
            >
              {selectedModel ? `${selectedModel.name} (${selectedModel.year})` : `Choisir un modèle ${selectedBrand.name}`}
            </Button>
            <CommandDialog open={modelCommandOpen} onOpenChange={setModelCommandOpen}>
              <CommandInput
                placeholder={`Rechercher un modèle ${selectedBrand.name}...`}
              />
              <CommandList>
                <CommandEmpty>Aucun modèle trouvé.</CommandEmpty>
                <CommandGroup>
                  {selectedBrand.models.map(model => (
                    <CommandItem
                      key={model.id}
                      onSelect={() => {
                        setSelectedModel(model)
                        setModelCommandOpen(false)
                      }}
                    >
                      {model.name} ({model.year})
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </CommandDialog>
          </div>
        )}

        {/* Affichage du modèle sélectionné */}
        {selectedModel && (
          <div className="mt-12 p-6 border rounded-lg bg-secondary/10">
            <h3 className="text-xl font-semibold mb-4">Votre sélection</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-full">
                <span className="text-2xl font-bold">
                  {selectedBrand?.name[0].toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-lg font-medium">
                  {selectedBrand?.name} {selectedModel.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  Année: {selectedModel.year}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
