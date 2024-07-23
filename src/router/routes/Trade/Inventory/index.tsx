import { UseFormRegister } from 'react-hook-form'

import FormGroup from '~/components/FormGroup'
import { InventoryPublic, Trade } from '~/data/__generated__'

import { FromToSuffixEnum } from '../enums'

type InventoryProps = {
  inventory: InventoryPublic[] | undefined
  register: UseFormRegister<Trade>
  suffix: FromToSuffixEnum
}

export default function Inventory({
  inventory,
  register,
  suffix
}: InventoryProps) {
  return (
    <div>
      {inventory?.map((inventoryItem, index) => (
        <FormGroup key={inventoryItem.id}>
          <label htmlFor={`${suffix}_items.${index}.quantity`}>
            <span className="capitalize">
              {inventoryItem.item_name}
            </span>
            : {inventoryItem.quantity} &times; {inventoryItem.points}{' '}
            pts
          </label>
          <input
            type="hidden"
            defaultValue={inventoryItem.item_id}
            {...register(`${suffix}_items.${index}.item_id`, {
              valueAsNumber: true
            })}
          />
          <input
            type="number"
            min={0}
            max={inventoryItem.quantity}
            defaultValue={0}
            id={`${suffix}_items.${index}.quantity`}
            {...register(`${suffix}_items.${index}.quantity`, {
              valueAsNumber: true,
              min: 0,
              max: inventoryItem.quantity
            })}
            className="w-16"
          />
        </FormGroup>
      ))}
    </div>
  )
}
