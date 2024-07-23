import { createBrowserRouter } from 'react-router-dom'

import MainLayout from '~/layout/main'

import ErrorPage from './routes/ErrorPage'
import Profile from './routes/Profile'
import Root from './routes/Root'
import SignUp from './routes/SignUp'
import Trade from './routes/Trade'

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Root />
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
        path: '/profile/:id/trade',
        element: <Trade />
      }
    ]
  }
])

export default router
