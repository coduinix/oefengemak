import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { AppLayout } from '@/app/layout'
import { AboutPage } from './routes/about'
import { DonerenPage } from './routes/doneren'
import { HomePage } from './routes/home'
import { NotFoundPage } from './routes/not-found'
import { SommenPage } from './routes/sommen.$type'

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'sommen/:type', element: <SommenPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'doneren', element: <DonerenPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
