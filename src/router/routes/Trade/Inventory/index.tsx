import { UseFormRegister } from 'react-hook-form'

import { InventoryPublic, Trade } from '~/data/__generated__'

import { TradeSuffixEnum } from '../enums'

type InventoryProps = {
  inventory: InventoryPublic[] | undefined
  register: UseFormRegister<Trade>
  suffix: TradeSuffixEnum
}

export default function Inventory({
  inventory,
  register,
  suffix
}: InventoryProps) {
  return (
    <div>
      {inventory?.map((inventoryItem, index) => (
        <div key={inventoryItem.id}>
          {inventoryItem.item_name} - {inventoryItem.quantity} x{' '}
          {inventoryItem.points}
          <input
            type="hidden"
            defaultValue={inventoryItem.item_id}
            {...register(`${suffix}.${index}.item_id`, {
              valueAsNumber: true
            })}
          />
          <input
            type="number"
            min={0}
            max={inventoryItem.quantity}
            defaultValue={0}
            {...register(`${suffix}.${index}.quantity`, {
              valueAsNumber: true,
              min: 0,
              max: inventoryItem.quantity
            })}
          />
        </div>
      ))}
    </div>
  )
}
