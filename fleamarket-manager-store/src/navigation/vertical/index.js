import { Mail, Home, FileText, Shield, Pocket, ChevronsRight, User, Users, UserPlus, Briefcase, Feather, ShoppingBag, ShoppingCart } from 'react-feather'

export default [
  {
    id: 'home',
    title: 'หน้าแรก',
    icon: <Home size={20} />,
    navLink: '/home'
  },
  {
    id: 'ร้านค้า',
    title: 'ระบบจัดการร้านค้า',
    icon: <ShoppingCart size={20} />,
    navLink: '/store'
  },
  {
    id: 'saleslock',
    title: 'ระบบจัดการการจองพื้นที่',
    icon: <Pocket size={20} />,
    navLink: '/saleslock'
  }
]