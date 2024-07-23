import { useQuery } from '@tanstack/react-query'
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin
} from '@vis.gl/react-google-maps'
import { useNavigate } from 'react-router-dom'

import UserEmoji from '~/components/UserEmoji'
import { SurvivorsService } from '~/data/__generated__/services.gen'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID

export default function Root() {
  const query = useQuery({
    queryKey: ['survivors'],
    queryFn: SurvivorsService.readSurvivors
  })
  const navigate = useNavigate()

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Map
        mapId={GOOGLE_MAP_ID}
        style={{ width: '100vw', height: '100vh' }}
        defaultCenter={{ lat: -8.695063, lng: 115.259628 }}
        defaultZoom={13}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        {query.data?.map(survivor => (
          <AdvancedMarker
            key={survivor.id}
            position={{
              lat: survivor.latitude,
              lng: survivor.longitude
            }}
            title={survivor.name}
            clickable
            onClick={() => navigate(`/profile/${survivor.id}`)}
          >
            <Pin
              background={survivor.is_infected ? 'red' : 'green'}
              borderColor={
                survivor.is_infected ? 'darkred' : 'darkgreen'
              }
            >
              <UserEmoji
                gender={survivor.gender}
                isInfected={Boolean(survivor.is_infected)}
              />
            </Pin>
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  )
}
