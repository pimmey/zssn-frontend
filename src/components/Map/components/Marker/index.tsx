import { AdvancedMarker, Pin } from '@vis.gl/react-google-maps'
import { useNavigate } from 'react-router-dom'

import UserEmoji from '~/components/UserEmoji'
import { Survivor, SurvivorPublic } from '~/data/__generated__'

type MarkerProps = {
  survivor: SurvivorPublic | Survivor
  isClickable?: boolean
}
export default function Marker({
  survivor,
  isClickable
}: MarkerProps) {
  const navigate = useNavigate()

  return (
    <AdvancedMarker
      position={{
        lat: survivor.latitude,
        lng: survivor.longitude
      }}
      title={survivor.name}
      clickable={isClickable}
      onClick={() => navigate(`/profile/${survivor.id}`)}
    >
      <Pin
        background={survivor.is_infected ? 'red' : 'green'}
        borderColor={survivor.is_infected ? 'darkred' : 'darkgreen'}
      >
        <UserEmoji
          gender={survivor.gender}
          isInfected={Boolean(survivor.is_infected)}
        />
      </Pin>
    </AdvancedMarker>
  )
}
