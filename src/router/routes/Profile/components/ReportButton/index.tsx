import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import Button from '~/components/Button'
import { ButtonIntentsEnum } from '~/components/Button/enums'
import queryClient from '~/data'
import {
  ErrorResponse,
  ReportInfectionData,
  SuccessResponse,
  SurvivorPublic,
  SurvivorsService
} from '~/data/__generated__'
import { getMyId } from '~/data/local-storage'

type MutationErrorData = {
  body: ErrorResponse
}

type ReportProps = {
  id: string
  isDisabled: boolean
}
export default function ReportButton({
  id,
  isDisabled
}: ReportProps) {
  const myId = getMyId()

  const { mutate: reportAsInfected } = useMutation<
    SuccessResponse,
    MutationErrorData,
    ReportInfectionData
  >({
    mutationFn: SurvivorsService.reportInfection,
    onMutate: async data => {
      await queryClient.cancelQueries({ queryKey: ['survivors', id] })

      const previousSurvivorData = queryClient.getQueryData([
        'survivors',
        id
      ])

      queryClient.setQueryData(
        ['survivors', id],
        (previous: SurvivorPublic) => {
          if (data?.requestBody?.reporter_id) {
            return {
              ...previous,
              reported_by: [
                ...previous.reported_by,
                data.requestBody.reporter_id
              ]
            }
          }
        }
      )

      return previousSurvivorData
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['survivors', id], context)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['survivors', id] })
    }
  })

  const onReportAsInfectedClick = () => {
    reportAsInfected(
      {
        requestBody: {
          reporter_id: Number(myId),
          survivor_id: Number(id)
        }
      },
      {
        onSuccess: data => {
          toast.success(data.message)
        },
        onError: data => {
          if (data.body.message) {
            toast.error(data.body.message)
          } else {
            toast.error('Something went wrong 🥲')
          }
        }
      }
    )
  }

  return (
    <Button
      intent={ButtonIntentsEnum.primary}
      disabled={isDisabled}
      onClick={onReportAsInfectedClick}
    >
      Flag as infected
    </Button>
  )
}
