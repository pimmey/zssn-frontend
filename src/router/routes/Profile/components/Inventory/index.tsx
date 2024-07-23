import { useNavigate } from 'react-router-dom'

import Button from '~/components/Button'
import { ButtonIntentsEnum } from '~/components/Button/enums'
import { SurvivorPublic } from '~/data/__generated__'
import { getMyId } from '~/data/local-storage'

type InventoryProps = {
  survivor: SurvivorPublic
  id: string
}
export default function Inventory({ survivor, id }: InventoryProps) {
  const navigate = useNavigate()
  const myId = getMyId()

  const goToTrade = () => navigate(`/profile/${id}/trade`)

  return (
    <div className="w-full rounded-3xl bg-gray-100 p-4 md:w-2/3">
      <div className="mb-4 text-2xl">Inventory</div>
      {survivor?.inventory.map(inventoryItem => (
        <div key={inventoryItem.id} className="capitalize">
          {inventoryItem.item_name}: {inventoryItem.quantity}
        </div>
      ))}
      <div className="mt-4 flex justify-end">
        {myId !== id ? (
          <Button
            intent={ButtonIntentsEnum.secondary}
            onClick={goToTrade}
            disabled={survivor.is_infected}
          >
            Trade
          </Button>
        ) : null}
      </div>
    </div>
  )
}
