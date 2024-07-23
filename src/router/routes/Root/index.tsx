import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

import Map from '~/components/Map'
import { SurvivorsService } from '~/data/__generated__/services.gen'

export default function Root() {
  const { data: survivors, error: survivorsError } = useQuery({
    queryKey: ['survivors'],
    queryFn: SurvivorsService.readSurvivors
  })

  useEffect(() => {
    if (survivorsError) {
      toast.error(survivorsError.message)
    }
  }, [survivorsError])

  return (
    <Map
      data={survivors}
      isFullScreen
      defaultCenter={{ lat: -8.695063, lng: 115.259628 }}
    />
  )
}
