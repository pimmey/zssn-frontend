import { useQuery } from '@tanstack/react-query'

import { SurvivorsService } from '~/data/__generated__/services.gen'

export default function Root() {
  const query = useQuery({
    queryKey: ['survivors'],
    queryFn: SurvivorsService.survivorsReadSurvivorsEndpoint
  })

  console.log({ query })

  return (
    <div className="p-8">
      {query.data?.map(survivor => (
        <div key={survivor.id}>{survivor.name}</div>
      ))}
    </div>
  )
}
