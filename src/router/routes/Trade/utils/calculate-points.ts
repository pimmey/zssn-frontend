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
        acc +=
          Number(item.quantity) *
          getPoints(Number(item?.item_id), inventory)
      }
      return acc
    }, 0) || 0
  )
}
