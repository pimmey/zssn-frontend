import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()
  let errorMessage

  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMessage = error.statusText
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  } else {
    console.error(error)
    errorMessage = 'Unknown error'
  }

  return (
    <div id="error-page" className="p-4">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <pre className="bg-gray-200 p-4">{errorMessage}</pre>
    </div>
  )
}
