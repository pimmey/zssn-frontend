import { createBrowserRouter } from 'react-router-dom'

import ErrorPage from './routes/ErrorPage'
import Profile from './routes/Profile'
import Root from './routes/Root'
import SignUp from './routes/SignUp'
import Trade from './routes/Trade'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />
  },
  {
    path: '/sign-up',
    element: <SignUp />
  },
  {
    path: '/profile/:id',
    element: <Profile />
  },
  {
    path: '/trade/:id',
    element: <Trade />
  }
])

export default router
