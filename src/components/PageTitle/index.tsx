import { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
}

export default function PageTitle({ children }: ContainerProps) {
  return <div className="mb-8 text-4xl font-semibold">{children}</div>
}
