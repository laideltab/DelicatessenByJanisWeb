import { squareClient } from './client'

export type SquareProduct = {
  id: string
  name: string
  description: string
  price: number
  currency: string
  imageUrl: string | null
  categoryId: string | null
  available: boolean
  variations: SquareVariation[]
}

export type SquareVariation = {
  id: string
  name: string
  price: number
  currency: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapVariation(v: any): SquareVariation {
  return {
    id: v.id ?? '',
    name: v.itemVariationData?.name ?? '',
    price: Number(v.itemVariationData?.priceMoney?.amount ?? 0) / 100,
    currency: v.itemVariationData?.priceMoney?.currency ?? 'USD',
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapItem(item: any): SquareProduct {
  const data = item.itemData ?? {}
  const firstVariation = data.variations?.[0]?.itemVariationData
  return {
    id: item.id ?? '',
    name: data.name ?? '',
    description: data.description ?? '',
    price: Number(firstVariation?.priceMoney?.amount ?? 0) / 100,
    currency: firstVariation?.priceMoney?.currency ?? 'USD',
    imageUrl: null,
    categoryId: data.categoryId ?? null,
    available: true,
    variations: (data.variations ?? []).map(mapVariation),
  }
}

export async function getAllProducts(): Promise<SquareProduct[]> {
  const response = await squareClient.catalog.list({ types: 'ITEM' })
  const items: SquareProduct[] = []
  for await (const item of response) {
    if (item.type === 'ITEM' && item.itemData) {
      items.push(mapItem(item))
    }
  }
  return items
}

export async function getProductById(id: string): Promise<SquareProduct | null> {
  try {
    const response = await squareClient.catalog.object.get({
      objectId: id,
      includeRelatedObjects: true,
    })
    const item = response.object
    if (!item || item.type !== 'ITEM') return null
    return mapItem(item)
  } catch {
    return null
  }
}

export async function getCategories(): Promise<{ id: string; name: string }[]> {
  const categories: { id: string; name: string }[] = []
  const response = await squareClient.catalog.list({ types: 'CATEGORY' })
  for await (const cat of response) {
    categories.push({
      id: cat.id ?? '',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name: (cat as any).categoryData?.name ?? '',
    })
  }
  return categories
}
