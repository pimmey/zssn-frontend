import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import Button from '~/components/Button'
import { ButtonIntentsEnum } from '~/components/Button/enums'
import FormErrorMessage from '~/components/FormErrorMessage'
import FormGroup from '~/components/FormGroup'
import LocationFormGroup from '~/components/LocationFormGroup'
import PageTitle from '~/components/PageTitle'
import {
  InventoryItemsService,
  SurvivorCreate,
  SurvivorsService
} from '~/data/__generated__'
import { setMyId } from '~/data/local-storage'
import Container from '~/layout/main/components/Container'
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

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors }
  } = useForm<SurvivorCreate>({
    resolver: yupResolver<SurvivorCreate>(createSurvivorSchema)
  })

  const onSubmit: SubmitHandler<SurvivorCreate> = data => {
    createSurvivor(
      { requestBody: data },
      {
        onSuccess: data => {
          setMyId(String(data.id))
          toast.success('Welcome aboard!')
          navigate(`/profile/${data.id}`)
        }
      }
    )
  }

  useEffect(() => {
    if (inventoryItemsError) {
      toast.error(inventoryItemsError.message)
    }
  }, [inventoryItemsError])

  return (
    <Container>
      <PageTitle>Sign up</PageTitle>
      <div className="rounded-3xl bg-gray-100 p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          data-testid="sign-up-form"
        >
          <div className="flex flex-col gap-y-8 md:flex-row">
            <div className="md:w-2/3">
              <div className="mb-4 text-2xl">Personal data</div>
              <FormGroup>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  {...register('name')}
                  className="w-72"
                  data-testid="name-input"
                />
                <FormErrorMessage<SurvivorCreate>
                  id="name"
                  errors={errors}
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  min="0"
                  {...register('age')}
                  className="w-16"
                  data-testid="age-input"
                />
                <FormErrorMessage<SurvivorCreate>
                  id="age"
                  errors={errors}
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  {...register('gender')}
                  className="w-36"
                >
                  <option value="female">female</option>
                  <option value="male">male</option>
                  <option value="other">other</option>
                </select>
                <FormErrorMessage<SurvivorCreate>
                  id="gender"
                  errors={errors}
                />
              </FormGroup>
              <LocationFormGroup<SurvivorCreate>
                register={register}
                setValue={setValue}
                errors={errors}
              />
            </div>
            <div>
              <div className="mb-4 text-2xl">
                Define your inventory
              </div>
              {inventoryItems?.map((item, index) => (
                <FormGroup key={item.id}>
                  <label className="capitalize">{item.name}</label>
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
                    data-testid={`quantity-input-${index}`}
                    className="w-16"
                  />
                  {errors?.inventory?.[index]?.quantity ? (
                    <div className="text-sm">
                      {errors?.inventory[index].quantity.message}
                    </div>
                  ) : null}
                </FormGroup>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <Button intent={ButtonIntentsEnum.primary}>
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </Container>
  )
}
