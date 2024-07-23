import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useParams } from 'react-router-dom'

import Button from '~/components/Button'
import { ButtonIntentsEnum } from '~/components/Button/enums'
import PageTitle from '~/components/PageTitle'
import queryClient from '~/data'
import {
  TradeService,
  Trade as TradeValues
} from '~/data/__generated__'
import { getMyId } from '~/data/local-storage'
import Container from '~/layout/main/components/Container'

import Inventory from './Inventory'
import { FromToSuffixEnum, TradeItemsSuffixEnum } from './enums'
import { calculatePoints } from './utils/calculate-points.ts'

const INITIAL_POINTS: Record<FromToSuffixEnum, number> = {
  from: 0,
  to: 0
}

export default function Trade() {
  const { id } = useParams()

  const [points, setPoints] = useState(INITIAL_POINTS)

  const { data: tradeData } = useQuery({
    queryKey: ['trade', id],
    queryFn: async () =>
      TradeService.getTradeData({
        fromSurvivorId: Number(getMyId()),
        toSurvivorId: Number(id)
      })
  })

  const { mutate: tradeItems } = useMutation({
    mutationFn: TradeService.tradeItems
  })

  const { handleSubmit, register, watch, reset } =
    useForm<TradeValues>()

  const onSubmit: SubmitHandler<TradeValues> = data => {
    const requestBody: TradeValues = {
      ...data,
      from_survivor_id: Number(getMyId()),
      to_survivor_id: Number(id)
    }

    tradeItems(
      { requestBody },
      {
        onSuccess(data) {
          queryClient.invalidateQueries({ queryKey: ['trade', id] })
          reset()
          setPoints(INITIAL_POINTS)
          toast.success(data.message)
        },
        onError(error) {
          toast.error(error.message)
        }
      }
    )
  }

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (
        tradeData?.from_survivor &&
        value.from_items &&
        value.to_items
      ) {
        if (name?.includes(TradeItemsSuffixEnum.from_items)) {
          const fromPoints = calculatePoints(
            value.from_items,
            tradeData?.from_survivor?.inventory
          )
          setPoints(points => ({
            ...points,
            from: fromPoints
          }))
        } else if (name?.includes(TradeItemsSuffixEnum.to_items)) {
          const toPoints = calculatePoints(
            value.to_items,
            tradeData?.to_survivor?.inventory
          )
          setPoints(points => ({
            ...points,
            to: toPoints
          }))
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, tradeData])

  const isTradeButtonDisabled =
    points.from !== points.to || points.from === 0 || points.to === 0

  return (
    <Container>
      <PageTitle>
        <Link to={`/profile/${tradeData?.to_survivor.id}`}>←</Link> /
        Trade
      </PageTitle>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-3xl bg-gray-100 p-8"
      >
        <div className="mb-4 flex flex-col gap-y-8 md:flex-row">
          {Object.values(FromToSuffixEnum).map(suffix => (
            <div key={suffix} className="md: w-1/2">
              <div className="mb-2 text-2xl">
                {tradeData?.[`${suffix}_survivor`].name}
              </div>
              <Inventory
                inventory={
                  tradeData?.[`${suffix}_survivor`].inventory
                }
                register={register}
                suffix={suffix}
              />
              <div className="bg-gray-300 p-2">
                Points: {points[suffix]}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button
            intent={ButtonIntentsEnum.primary}
            disabled={isTradeButtonDisabled}
          >
            Trade
          </Button>
        </div>
      </form>
    </Container>
  )
}
