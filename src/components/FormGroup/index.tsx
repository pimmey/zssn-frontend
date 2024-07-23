import { ReactNode } from 'react'

type FormGroupProps = {
  children: ReactNode
}
export default function FormGroup({ children }: FormGroupProps) {
  return (
    <div className="mb-4 flex flex-col items-start [&_input]:border [&_input]:p-2 [&_select]:p-2">
      {children}
    </div>
  )
}
