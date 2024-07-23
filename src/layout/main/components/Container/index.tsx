import { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
}
export default function Container({ children }: ContainerProps) {
  return (
    <div className="container mx-auto mb-8 px-4 pt-24">
      {children}
    </div>
  )
}
