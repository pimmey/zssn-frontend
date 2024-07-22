import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import { SurvivorsService } from '~/data/__generated__'
import { getMyId } from '~/data/local-storage'

export default function Profile() {
  const navigate = useNavigate()
  const myId = getMyId()
  const { id } = useParams()

  const { data: survivor } = useQuery({
    queryKey: ['survivors', id],
    queryFn: async () =>
      SurvivorsService.readSurvivor({ survivorId: Number(id) })
  })

  const goToTrade = () => navigate(`/trade/${id}`)

  return (
    <div>
      Profile! is this me? {String(myId === id)}
      <div>
        <button>Update location</button>
      </div>
      <div>
        is infected? {String(survivor?.is_infected)}
        <button>Flag as infected</button>
      </div>
      <div>
        {survivor?.name} /{survivor?.gender}
      </div>
      <div>
        {survivor?.inventory.map(inventoryItem => (
          <div key={inventoryItem.id}>
            {inventoryItem.item_name} - {inventoryItem.quantity}
          </div>
        ))}
      </div>
      <div>
        {myId !== id ? (
          <button onClick={goToTrade}>Trade</button>
        ) : null}
      </div>
    </div>
  )
}
