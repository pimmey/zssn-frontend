import { ButtonHTMLAttributes, ReactNode } from 'react'

import { ButtonIntentsEnum } from './enums'

type ButtonProps = {
  children: ReactNode
  intent: ButtonIntentsEnum
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function Button(props: ButtonProps) {
  return (
    <button
      className={`rounded-3xl ${props.intent === 'primary' ? 'bg-amber-300' : 'bg-gray-300'} p-4 [&:disabled]:cursor-not-allowed [&:disabled]:opacity-50`}
      {...props}
    >
      {props.children}
    </button>
  )
}
