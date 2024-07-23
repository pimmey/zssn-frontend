import { FieldErrors, FieldValues, Path } from 'react-hook-form'

type FormErrorMessageProps<T extends FieldValues> = {
  id: Path<FieldValues>
  errors: FieldErrors<T>
}
export default function FormErrorMessage<T extends FieldValues>({
  id,
  errors
}: FormErrorMessageProps<T>) {
  const error = errors[id]?.message
  return error ? <div className="text-sm">{String(error)}</div> : null
}
