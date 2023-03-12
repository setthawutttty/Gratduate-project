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
    path: '/market',
    component: lazy(() => import('../../views/Market/Market'))
  },  
  // ร้านค้า
  {
    path: '/store',
    component: lazy(() => import('../../views/Store/Store'))
  },
  {
    path: '/store-detail',
    component: lazy(() => import('../../views/Store/Store-detail'))
  },
  {
    path: '/store-add',
    component: lazy(() => import('../../views/Store/AddStore'))
  },
  // ล็อคขายของ
  {
    path: '/saleslock',
    component: lazy(() => import('../../views/Saleslock/Saleslock'))
  },
  {
    path: '/saleslock-add',
    component: lazy(() => import('../../views/Saleslock/AddSaleslock'))
  },
  // จัดการบัญชีธนาคาร
  {
    path: '/bankaccount',
    component: lazy(() => import('../../views/Bankaccount/Bankaccount'))
  },
  {
    path: '/bankaccount-add',
    component: lazy(() => import('../../views/Bankaccount/AddBankaccount'))
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
