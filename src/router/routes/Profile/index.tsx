import { useMutation, useQuery } from '@tanstack/react-query'
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin
} from '@vis.gl/react-google-maps'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

import Button from '~/components/Button'
import { ButtonIntentsEnum } from '~/components/Button/enums'
import LocationFormGroup from '~/components/LocationFormGroup'
import PageTitle from '~/components/PageTitle'
import UserEmoji from '~/components/UserEmoji'
import queryClient from '~/data'
import {
  SurvivorLocationUpdate,
  SurvivorsService
} from '~/data/__generated__'
import { getMyId } from '~/data/local-storage'
import Container from '~/layout/main/components/Container'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID

export default function Profile() {
  const navigate = useNavigate()
  const myId = getMyId()
  const { id } = useParams()
  const [showUpdateLocationForm, setShowUpdateLocationForm] =
    useState<boolean>(false)

  const { data: survivor } = useQuery({
    queryKey: ['survivors', id],
    queryFn: async () =>
      SurvivorsService.readSurvivor({ survivorId: Number(id) })
  })

  const { mutate: updateLocation } = useMutation({
    mutationFn: SurvivorsService.updateSurvivorLocation
  })

  const { mutate: reportAsInfected } = useMutation({
    mutationFn: SurvivorsService.reportInfection
  })

  const goToTrade = () => navigate(`/trade/${id}`)

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<SurvivorLocationUpdate>()

  const onSubmit = (data: SurvivorLocationUpdate) => {
    const requestBody: SurvivorLocationUpdate = {
      ...data,
      survivor_id: Number(id)
    }
    updateLocation(
      { requestBody },
      {
        onSuccess: data => {
          console.log({ data })
          queryClient.invalidateQueries({
            queryKey: ['survivors', id]
          })
          setShowUpdateLocationForm(false)
        }
      }
    )
  }

  const onUpdateLocationClick = () => setShowUpdateLocationForm(true)

  const isFlagDisabled = !survivor?.reported_by.some(
    reporterId => reporterId === Number(myId)
  )

  const onReportAsInfectedClick = () => {
    reportAsInfected(
      {
        requestBody: {
          reporter_id: Number(myId),
          survivor_id: Number(id)
        }
      },
      {
        onSuccess: data => toast.success(data.message),
        onError: data => {
          // console.log({ err, variables, context })
          toast.error(data.body!.message)
        }
      }
    )
  }

  return (
    survivor && (
      <Container>
        <PageTitle>
          <UserEmoji
            gender={survivor.gender}
            isInfected={survivor.is_infected}
          />{' '}
          {survivor.name}
        </PageTitle>
        <div className="mb-4 flex gap-x-2">
          {myId === id ? (
            <Button
              intent={ButtonIntentsEnum.secondary}
              onClick={onUpdateLocationClick}
            >
              Update location
            </Button>
          ) : null}
          {myId !== id ? (
            <Button
              intent={ButtonIntentsEnum.primary}
              disabled={isFlagDisabled}
              onClick={onReportAsInfectedClick}
            >
              Flag as infected
            </Button>
          ) : null}
        </div>

        {showUpdateLocationForm && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mb-4 rounded-3xl bg-gray-100 p-4"
          >
            <LocationFormGroup
              register={register}
              setValue={setValue}
              errors={errors}
            />
            <Button intent={ButtonIntentsEnum.primary}>Save</Button>
          </form>
        )}

        <div className="mb-4">
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <Map
              mapId={GOOGLE_MAP_ID}
              style={{
                width: '100%',
                height: 300,
                borderRadius: '1.5rem',
                overflow: 'hidden'
              }}
              defaultCenter={{
                lat: survivor.latitude,
                lng: survivor.longitude
              }}
              defaultZoom={14}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
            >
              <AdvancedMarker
                key={survivor.id}
                position={{
                  lat: survivor.latitude,
                  lng: survivor.longitude
                }}
                title={survivor.name}
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
            </Map>
          </APIProvider>
        </div>

        <div className="flex flex-col gap-x-4 gap-y-4 md:flex-row">
          <div className="w-full rounded-3xl bg-gray-100 p-4 md:w-1/3">
            <div className="text-2xl">Profile</div>
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
          <div className="w-full rounded-3xl bg-gray-100 p-4 md:w-2/3">
            <div className="text-2xl">Inventory</div>
            {survivor?.inventory.map(inventoryItem => (
              <div key={inventoryItem.id} className="capitalize">
                {inventoryItem.item_name} &times;{' '}
                {inventoryItem.quantity}
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
        </div>
      </Container>
    )
  )
}
