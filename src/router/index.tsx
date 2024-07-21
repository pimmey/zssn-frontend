import { createBrowserRouter } from 'react-router-dom'

import SignUp from '~/router/routes/SignUp'

import ErrorPage from './routes/ErrorPage'
import Root from './routes/Root'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />
  },
  {
    path: '/sign-up',
    element: <SignUp />
  }
])

export default router
