import { createBrowserRouter } from 'react-router-dom'

import ErrorPage from './routes/ErrorPage'
import Root from './routes/Root'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />
  }
])

export default router
