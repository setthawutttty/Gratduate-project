import { lazy } from 'react'

// ** Document title
const TemplateTitle = '%s - Flea Market'

// ** Default Route
const DefaultRoute = '/home'

// ** Merge Routes
const Routes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/Home'))
  },
  {
    path: '/register',
    component: lazy(() => import('../../views/Register')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/login',
    component: lazy(() => import('../../views/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/store',
    component: lazy(() => import('../../views/Store/Store'))
  },
  {
    path: '/saleslock',
    component: lazy(() => import('../../views/Saleslock/Saleslock'))
  },  
  {
    path: '/profile',
    component: lazy(() => import('../../views/Profiles/AccountTabContent'))
  }, 
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  }

  
]

export { DefaultRoute, TemplateTitle, Routes }
