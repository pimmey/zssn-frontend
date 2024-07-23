import { SurvivorPublic } from '~/data/__generated__'

type ProfileProps = {
  survivor: SurvivorPublic
}
export default function Details({ survivor }: ProfileProps) {
  return (
    <div className="w-full rounded-3xl bg-gray-100 p-4 md:w-1/3">
      <div className="mb-4 text-2xl">Profile details</div>
      <ul>
        <li>Age: {survivor.age}</li>
        <li>Gender: {survivor.gender}</li>
        <li>
          Status:{' '}
          {survivor.is_infected ? (
            <span className="text-red-700">infected</span>
          ) : (
            <span>not infected</span>
          )}
        </li>
      </ul>
    </div>
  )
}
