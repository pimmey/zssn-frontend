import { useMutation } from '@tanstack/react-query'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'

import Button from '~/components/Button'
import { ButtonIntentsEnum } from '~/components/Button/enums'
import LocationFormGroup from '~/components/LocationFormGroup'
import queryClient from '~/data'
import {
  SurvivorLocationUpdate,
  SurvivorsService
} from '~/data/__generated__'

type UpdateLocationProps = {
  id: string
  setShowUpdateLocationForm: Dispatch<SetStateAction<boolean>>
}
export default function UpdateLocation({
  id,
  setShowUpdateLocationForm
}: UpdateLocationProps) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<SurvivorLocationUpdate>()

  const { mutate: updateLocation } = useMutation({
    mutationFn: SurvivorsService.updateSurvivorLocation
  })

  const onSubmit = (data: SurvivorLocationUpdate) => {
    const requestBody: SurvivorLocationUpdate = {
      ...data,
      survivor_id: Number(id)
    }
    updateLocation(
      { requestBody },
      {
        onSuccess: () => {
          // TODO: update map center
          queryClient.invalidateQueries({
            queryKey: ['survivors', id]
          })
          setShowUpdateLocationForm(false)
        }
      }
    )
  }

  return (
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
  )
}
