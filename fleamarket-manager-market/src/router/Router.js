// ** React Imports
import { Suspense, lazy, Fragment } from 'react'

// ** Utils
import { useLayout } from '@hooks/useLayout'
import { useRouterTransition } from '@hooks/useRouterTransition'

// ** Custom Components
import LayoutWrapper from '@layouts/components/layout-wrapper'

// ** Router Components
import { BrowserRouter as AppRouter, Route, Switch, Redirect, useHistory } from 'react-router-dom'

// ** Routes & Default Routes
import { DefaultRoute, Routes } from './routes'

// ** Layouts
import BlankLayout from '@layouts/BlankLayout'
import VerticalLayout from '@src/layouts/VerticalLayout'
import HorizontalLayout from '@src/layouts/HorizontalLayout'

// const getLocal = () => {
//   const authStorage = localStorage.getItem("auth")
//   const savedStorage = localStorage.getItem("saved")
//   const datas = JSON.parse(a)
//   if (datas) {
//     // console.log((JSON.parse(a)).timestamp)
//     const hours = 2
//     if (savedStorage && (new Date().getTime() - savedStorage > hours * 60 * 1000)) {
//       // if (saved && (new Date().getTime() - saved > hours * 60 * 60 * 1000)) {
//       history.push('/login')
//       localStorage.clear()
//     }
//     console.log(`saved = ${savedStorage}`)
//     console.log(new Date((JSON.parse(a)).timestamp).getDate())
//     console.log(new Date().getMonth())
//   } else {
//     localStorage.clear()  
//   }    
// }
const Router = () => {
  const history = useHistory()
  
  // ** Hooks
  const { layout, setLayout, setLastLayout } = useLayout()
  const { transition, setTransition } = useRouterTransition()
  // localStorage.setItem('saved', new Date().getTime())
//   localStorage.setItem("auth", JSON.stringify({
//     store: "Smart Parcel Box",
//     timestamp: "Wed Mar 01 2022 19:20:33 GMT+0700 (Indochina Time)",
//     serverstatus: true,
//     page: "/login admin",
//     data: {
//         err: false,
//         status: true,
//         login: true,
//         message: [
//             {
//                 admin_id: 2,
//                 admin_username: "adminkomkawila",
//                 admin_email: "adminkomkawila@gmail.com",
//                 admin_password: "$2a$10$Yq5jvSz.mvcfyuSGuD6qbeoO6mdb9GpXhJPmml560Jz23HWDJqpr.",
//                 admin_name: "phanuwat kawila",
//                 admin_tel: "0620243887",
//                 group_id: 0,
//                 admin_permission: 1,
//                 admin_createtime: "2022-03-02T07:52:58.000Z",
//                 admin_updatetime: "2022-03-02T07:52:58.000Z"
//             }
//         ]
//     }
// }))
  // ** Default Layout
  const DefaultLayout = layout === 'horizontal' ? 'HorizontalLayout' : 'VerticalLayout'

  // ** All of the available layouts
  const Layouts = { BlankLayout, VerticalLayout, HorizontalLayout }

  // ** Current Active Item
  const currentActiveItem = null

  // ** Return Filtered Array of Routes & Paths
  const LayoutRoutesAndPaths = layout => {
    const LayoutRoutes = []
    const LayoutPaths = []

    if (Routes) {
      Routes.filter(route => {
        // ** Checks if Route layout or Default layout matches current layout
        if (route.layout === layout || (route.layout === undefined && DefaultLayout === layout)) {
          LayoutRoutes.push(route)
          LayoutPaths.push(route.path)
        }
      })
    }

    return { LayoutRoutes, LayoutPaths }
  }

  const NotAuthorized = lazy(() => import('@src/views/NotAuthorized'))

  // ** Init Error Component
  const Error = lazy(() => import('@src/views/Error'))

  /**
   ** Final Route Component Checks for Login & User Role and then redirects to the route
   */
  // const FinalRoute = props => {
  //   const route = props.route
  //   let action, resource

  //   // ** Assign vars based on route meta
  //   if (route.meta) {
  //     action = route.meta.action ? route.meta.action : null
  //     resource = route.meta.resource ? route.meta.resource : null
  //   }

  //   if (
  //     (!isUserLoggedIn() && route.meta === undefined) ||
  //     (!isUserLoggedIn() && route.meta && !route.meta.authRoute && !route.meta.publicRoute)
  //   ) {
  //     /**
  //      ** If user is not Logged in & route meta is undefined
  //      ** OR
  //      ** If user is not Logged in & route.meta.authRoute, !route.meta.publicRoute are undefined
  //      ** Then redirect user to login
  //      */

  //     return <Redirect to='/login' />
  //   } else if (route.meta && route.meta.authRoute && isUserLoggedIn()) {
  //     // ** If route has meta and authRole and user is Logged in then redirect user to home page (DefaultRoute)
  //     return <Redirect to='/' />
  //   } else if (isUserLoggedIn() && !ability.can(action || 'read', resource)) {
  //     // ** If user is Logged in and doesn't have ability to visit the page redirect the user to Not Authorized
  //     return <Redirect to='/misc/not-authorized' />
  //   } else {
  //     // ** If none of the above render component
  //     return <route.component {...props} />
  //   }
  // }

  const Authcom = () => {    
    const authStorage = localStorage.getItem("auth")
    const savedStorage = localStorage.getItem("saved")
    // localStorage.clear()
    // console.log(window.location.href)
    if (window.location.href.indexOf("/register") !== -1) {
      return <Redirect to='/register' />
    } else {
      if (authStorage === null || savedStorage === null) {
        // history.push('/login')
        localStorage.clear()
        return <Redirect to='/login' />
      } else if (savedStorage && (new Date().getTime() - savedStorage > 50 * 60 * 1000)) {
        // history.push('/login')
        return <Redirect to='/login' />
        // localStorage.clear()
      } else if (authStorage) {
        // history.push('/home')
        return <Redirect to='/home' />
      }
    }

  }

  // ** Return Route to Render
  const ResolveRoutes = () => {
    console.log(history)
    return Object.keys(Layouts).map((layout, index) => {
      // ** Convert Layout parameter to Layout Component
      // ? Note: make sure to keep layout and component name equal

      const LayoutTag = Layouts[layout]

      // ** Get Routes and Paths of the Layout
      const { LayoutRoutes, LayoutPaths } = LayoutRoutesAndPaths(layout)

      // ** We have freedom to display different layout for different route
      // ** We have made LayoutTag dynamic based on layout, we can also replace it with the only layout component,
      // ** that we want to implement like VerticalLayout or HorizontalLayout
      // ** We segregated all the routes based on the layouts and Resolved all those routes inside layouts

      // ** RouterProps to pass them to Layouts
      const routerProps = {}
      return (
        <Route path={LayoutPaths} key={index}>
          <LayoutTag
            layout={layout}
            setLayout={setLayout}
            transition={transition}
            routerProps={routerProps}
            setLastLayout={setLastLayout}
            setTransition={setTransition}
            currentActiveItem={currentActiveItem}
          >
            <Switch>
              {LayoutRoutes.map(route => {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact === true}
                    render={props => {
                      // ** Assign props to routerProps
                      Object.assign(routerProps, {
                        ...props,
                        meta: route.meta
                      })

                      return (
                        <Fragment>
                          {/* Layout Wrapper to add classes based on route's layout, appLayout and className */}

                          {route.layout === 'BlankLayout' ? (
                            <Fragment>
                              <route.component {...props} />
                              <Authcom  />
                            </Fragment>
                          ) : (
                            <LayoutWrapper
                              layout={DefaultLayout}
                              transition={transition}
                              setTransition={setTransition}
                              /* Conditional props */
                              /*eslint-disable */
                              {...(route.appLayout
                                ? {
                                    appLayout: route.appLayout
                                  }
                                : {})}
                              {...(route.meta
                                ? {
                                    routeMeta: route.meta
                                  }
                                : {})}
                              {...(route.className
                                ? {
                                    wrapperClass: route.className
                                  }
                                : {})}
                              /*eslint-enable */
                            >
                              <Suspense fallback={null}>
                                <route.component {...props} />
                              </Suspense>
                            </LayoutWrapper>
                          )}
                        </Fragment>
                      )
                    }}
                  />
                )
              })}
            </Switch>
          </LayoutTag>
        </Route>
      )
    })
  }

  
  // console.log(authStorage)
  // console.log(savedStorage)  
  return (
    <AppRouter basename={process.env.REACT_APP_BASENAME}>
      <Switch>
        {/* If user is logged in Redirect user to DefaultRoute else to login */}
        <Route
          exact
          path='/'
          render={() => {
            return <Redirect to={DefaultRoute} />
          }}
        />
        {/* Not Auth Route */}
        <Route
          exact
          path='/misc/not-authorized'
          render={() => (
            <Layouts.BlankLayout>
              <NotAuthorized />
            </Layouts.BlankLayout>
          )}
        />
        {ResolveRoutes()}
        <Authcom />

        {/* NotFound Error page */}
        <Route path='*' component={Error} />
      </Switch>
    </AppRouter>
  )
}

export default Router
