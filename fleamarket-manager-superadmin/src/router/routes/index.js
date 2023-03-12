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
  {
    path: '/market-detail',
    component: lazy(() => import('../../views/Market/Market-detail'))
  },
  {
    path: '/market-add',
    component: lazy(() => import('../../views/Market/AddMarket'))
  },  
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
  {
    path: '/account-settings',
    component: lazy(() => import('../../views/account-settings/AccountTabContent'))
  },
  {
    path: '/account-settings2',
    element: lazy(() => import('../../views/account-settings/AccountTabContent'))
  },
  
  
  {
    path: '/group-detail',
    component: lazy(() => import('../../views/Group/Group'))
  },
  {
    path: '/group-add',
    component: lazy(() => import('../../views/Group/Groupadd'))
  },  
  {
    path: '/device',
    component: lazy(() => import('../../views/Device/Device'))
  },    
  {
    path: '/device-add',
    component: lazy(() => import('../../views/Device/Deviceadd'))
  },
  {
    path: '/user',
    component: lazy(() => import('../../views/User/User'))
  },      
  {
    path: '/admin',
    component: lazy(() => import('../../views/Admin/Admin'))
  },
  {
    path: '/admin-add',
    component: lazy(() => import('../../views/Admin/Adminadd'))
  },  
  {
    path: '/deviceuser',
    component: lazy(() => import('../../views/Device/Deviceuser'))
  },
  {
    path: '/datalog',
    component: lazy(() => import('../../views/Datalog/Datalogadmin'))
  },
  {
    path: '/dataloguser',
    component: lazy(() => import('../../views/Datalog/Dataloguser'))
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
