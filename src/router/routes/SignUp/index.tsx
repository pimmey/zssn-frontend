import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import {
  InventoryItemsService,
  SurvivorCreate,
  SurvivorsService
} from '~/data/__generated__'
import { setMyId } from '~/data/local-storage'
import { createSurvivorSchema } from '~/router/routes/SignUp/schemas'

export default function SignUp() {
  const navigate = useNavigate()

  const { data: inventoryItems, error: inventoryItemsError } =
    useQuery({
      queryKey: ['inventory-items'],
      queryFn: InventoryItemsService.getInventoryItems
    })

  const { mutate: createSurvivor } = useMutation({
    mutationFn: SurvivorsService.createSurvivor
  })

  const [isLoadingPosition, setIsLoadingPosition] =
    useState<boolean>(false)
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors }
  } = useForm<SurvivorCreate>({
    resolver: yupResolver<SurvivorCreate>(createSurvivorSchema)
  })

  const onSubmit: SubmitHandler<SurvivorCreate> = data => {
    console.log(data)
    createSurvivor(
      { requestBody: data },
      {
        onSuccess: data => {
          setMyId(String(data.id))
          navigate(`/profile/${data.id}`)
        }
      }
    )
  }

  const askForLocation = () => {
    setIsLoadingPosition(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        console.log({ latitude, longitude })
        setValue('latitude', Number(latitude.toFixed(5)))
        setValue('longitude', Number(longitude.toFixed(5)))
        setIsLoadingPosition(false)
      },
      () => {
        console.log('Cannot retrieve coordinates')
        setIsLoadingPosition(false)
      },
      { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
    )
  }

  console.log({ errors, inventoryItemsError })

  return (
    <div>
      Sign up!
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-100 p-8"
      >
        <div>
          <label htmlFor="name">Name</label>
          <input {...register('name')} />
        </div>
        <div>
          <label htmlFor="age">Age</label>
          <input type="number" {...register('age')} />
        </div>
        <div>
          <label htmlFor="gender">Gender</label>
          <select {...register('gender')}>
            <option value="female">female</option>
            <option value="male">male</option>
            <option value="other">other</option>
          </select>
        </div>
        <div>
          <label htmlFor="latitude">Current position</label>
          <button type="button" onClick={askForLocation}>
            detect location
          </button>
          <input
            type="number"
            {...register('latitude')}
            step=".00001"
            disabled={isLoadingPosition}
          />
          <input
            type="number"
            {...register('longitude')}
            step=".00001"
            disabled={isLoadingPosition}
          />
        </div>
        <div>
          {inventoryItems?.map((item, index) => (
            <div key={item.id}>
              <label>{item.name}</label>
              <input
                type="hidden"
                value={+item.id}
                {...register(`inventory.${index}.item_id`)}
              />
              <input
                type="number"
                defaultValue={0}
                min={0}
                {...register(`inventory.${index}.quantity`)}
              />
            </div>
          ))}
        </div>
        <button>Submit</button>
      </form>
    </div>
  )
}
