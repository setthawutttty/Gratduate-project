import { Mail, Home, FileText } from 'react-feather'

export default [
  {
    id: 'home',
    title: 'Home',
    icon: <Home size={20} />,
    navLink: '/home'
  },
  {
    id: 'secondPage',
    title: 'Second Page',
    icon: <Mail size={20} />,
    navLink: '/second-page'
  },
  {
    id: 'invoiceApp',
    title: 'Group',
    icon: <FileText size={20} />,
    children:[
      {
        id: 'groupAdd',
        title: 'Details Group',
        icon: <Mail size={20} />,
        navLink: '/group-detail'
      },
      {
        id: 'groupAdd',
        title: 'Add Group',
        icon: <Mail size={20} />,
        navLink: '/group-add'
      }
    ]
  }
]