import {
  APIProvider,
  Map as GoogleMap
} from '@vis.gl/react-google-maps'

import { Survivor, SurvivorPublic } from '~/data/__generated__'

import Marker from './components/Marker'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID

type MapProps = {
  isFullScreen?: boolean
  defaultCenter: google.maps.LatLngLiteral
  data?: Survivor[] | SurvivorPublic
}
export default function Map({
  isFullScreen = false,
  data,
  defaultCenter
}: MapProps) {
  const style = isFullScreen
    ? { width: '100vw', height: '100vh' }
    : {
        width: '100%',
        height: 300,
        borderRadius: '1.5rem',
        overflow: 'hidden'
      }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapId={GOOGLE_MAP_ID}
        style={style}
        defaultCenter={defaultCenter}
        defaultZoom={13}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        {Array.isArray(data) ? (
          data?.map(survivor => (
            <Marker
              key={survivor.id}
              survivor={survivor}
              isClickable
            />
          ))
        ) : data ? (
          <Marker survivor={data} />
        ) : null}
      </GoogleMap>
    </APIProvider>
  )
}
