import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'

import queryClient from '~/data'
import {
  TradeService,
  Trade as TradeValues
} from '~/data/__generated__'
import { getMyId } from '~/data/local-storage'

import Inventory from './Inventory'
import { TradeSuffixEnum } from './enums'
import { calculatePoints } from './utils/calculate-points.ts'

export default function Trade() {
  const { id } = useParams()

  const [toPoints, setToPoints] = useState<number>(0)
  const [fromPoints, setFromPoints] = useState<number>(0)

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
        if (name?.includes(TradeSuffixEnum.from_items)) {
          const fromPoints = calculatePoints(
            value.from_items,
            tradeData?.from_survivor?.inventory
          )

          console.log({ fromPoints })
          setFromPoints(fromPoints)
        } else if (name?.includes(TradeSuffixEnum.to_items)) {
          const toPoints = calculatePoints(
            value.to_items,
            tradeData?.to_survivor?.inventory
          )

          console.log({ toPoints })
          setToPoints(toPoints)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, tradeData])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gray-100 p-8"
    >
      Trade!
      <div>
        <div>from: {tradeData?.from_survivor.name}</div>
        <Inventory
          inventory={tradeData?.from_survivor?.inventory}
          register={register}
          suffix={TradeSuffixEnum.from_items}
        />
        from points: {fromPoints}
      </div>
      <div>
        <div>to: {tradeData?.to_survivor.name}</div>
        <Inventory
          inventory={tradeData?.to_survivor.inventory}
          register={register}
          suffix={TradeSuffixEnum.to_items}
        />
        to points: {toPoints}
      </div>
      <button>Trade</button>
    </form>
  )
}
