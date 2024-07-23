import { useState } from 'react'
import {
  FieldErrors,
  FieldPath,
  Path,
  PathValue,
  UseFormRegister,
  UseFormSetValue
} from 'react-hook-form'
import toast from 'react-hot-toast'

import Button from '~/components/Button'
import { ButtonIntentsEnum } from '~/components/Button/enums'
import FormErrorMessage from '~/components/FormErrorMessage'
import FormGroup from '~/components/FormGroup'

type LocationValues = {
  longitude: number
  latitude: number
}

type LocationFormGroupProps<TFormValues extends LocationValues> = {
  register: UseFormRegister<TFormValues>
  setValue: UseFormSetValue<TFormValues>
  errors: FieldErrors<TFormValues>
}

type FieldValue<TFormValues extends LocationValues> = PathValue<
  TFormValues,
  Path<TFormValues>
>

export default function LocationFormGroup<
  TFormValues extends LocationValues
>({
  register,
  setValue,
  errors
}: LocationFormGroupProps<TFormValues>) {
  const [isLoadingPosition, setIsLoadingPosition] =
    useState<boolean>(false)

  const askForLocation = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setIsLoadingPosition(true)
        const coordinates: Array<keyof LocationValues> = [
          'longitude',
          'latitude'
        ]

        coordinates.forEach(coordinate => {
          setValue(
            coordinate as Path<TFormValues>,
            Number(
              coords[coordinate].toFixed(5)
            ) as FieldValue<TFormValues>
          )
        })

        setIsLoadingPosition(false)
      },
      e => {
        console.log({ e })
        toast('Cannot retrieve current position')
        setIsLoadingPosition(false)
      },
      { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
    )
  }

  return (
    <FormGroup>
      <div>
        <label htmlFor="latitude">Current position</label>
      </div>
      <div className="flex flex-col gap-x-2 gap-y-2 lg:flex-row">
        <input
          data-testid="latitude-input"
          type="number"
          {...register('latitude' as FieldPath<TFormValues>)}
          step=".00001"
          disabled={isLoadingPosition}
          placeholder="latitude"
        />
        <input
          data-testid="longitude-input"
          type="number"
          {...register('longitude' as FieldPath<TFormValues>)}
          step=".00001"
          disabled={isLoadingPosition}
          placeholder="longitude"
        />
        <Button
          intent={ButtonIntentsEnum.secondary}
          type="button"
          onClick={askForLocation}
        >
          📍 Detect location
        </Button>
      </div>
      <FormErrorMessage<TFormValues> id="latitude" errors={errors} />
      <FormErrorMessage<TFormValues> id="longitude" errors={errors} />
    </FormGroup>
  )
}
