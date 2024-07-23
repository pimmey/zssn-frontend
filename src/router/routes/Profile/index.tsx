import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'

import Button from '~/components/Button'
import { ButtonIntentsEnum } from '~/components/Button/enums'
import Map from '~/components/Map'
import PageTitle from '~/components/PageTitle'
import UserEmoji from '~/components/UserEmoji'
import { SurvivorsService } from '~/data/__generated__'
import { getMyId } from '~/data/local-storage'
import Container from '~/layout/main/components/Container'

import Details from './components/Details'
import Inventory from './components/Inventory'
import ReportButton from './components/ReportButton'
import UpdateLocation from './components/UpdateLocation'

export default function Profile() {
  const myId = getMyId()
  const { id = '' } = useParams()

  const [showUpdateLocationForm, setShowUpdateLocationForm] =
    useState<boolean>(false)

  const { data: survivor, error: survivorError } = useQuery({
    queryKey: ['survivors', id],
    queryFn: async () =>
      SurvivorsService.readSurvivor({ survivorId: Number(id) })
  })

  const onUpdateLocationClick = () => setShowUpdateLocationForm(true)

  const isFlagDisabled =
    survivor?.reported_by.some(
      reporterId => reporterId === Number(myId)
    ) ?? false

  useEffect(() => {
    if (survivorError) {
      toast.error(survivorError.message)
    }
  }, [survivorError])

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
            <ReportButton id={id} isDisabled={isFlagDisabled} />
          ) : null}
        </div>
        {showUpdateLocationForm && (
          <UpdateLocation
            id={id}
            setShowUpdateLocationForm={setShowUpdateLocationForm}
          />
        )}
        <div className="mb-4">
          <Map
            data={survivor}
            defaultCenter={{
              lat: survivor.latitude,
              lng: survivor.longitude
            }}
          />
        </div>
        <div className="flex flex-col gap-x-4 gap-y-4 md:flex-row">
          <Details survivor={survivor} />
          <Inventory survivor={survivor} id={id} />
        </div>
      </Container>
    )
  )
}
