import {
  InventoryCreate,
  InventoryPublic
} from '~/data/__generated__'

const getPoints = (
  itemId: number,
  inventory: InventoryPublic[]
): number => {
  return (
    inventory.find(inventoryItem => inventoryItem.item_id === itemId)
      ?.points ?? 0
  )
}

export const calculatePoints = (
  items: (Partial<InventoryCreate> | undefined)[],
  inventory: InventoryPublic[]
): number => {
  return (
    items?.reduce((acc, item) => {
      if (item?.quantity && item.item_id) {
        const quantity = Number(item.quantity)
        const points = getPoints(Number(item?.item_id), inventory)
        if (quantity > 0) {
          acc += quantity * points
        }
      }
      return acc
    }, 0) || 0
  )
}
