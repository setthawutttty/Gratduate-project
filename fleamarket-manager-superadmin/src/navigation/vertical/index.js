import { Mail, Home, FileText, Shield, Pocket, ChevronsRight, User, Users, UserPlus, Briefcase, Feather, ShoppingBag, ShoppingCart } from 'react-feather'


// const datas = JSON.parse(authStorage).data.message[0].admin_permission

// const authStorage = localStorage.getItem("auth")

export default [
  {
    id: 'home',
    title: 'หน้าแรก',
    icon: <Home size={20} />,
    navLink: '/home'
  },
  {
    id: 'market',
    title: 'ระบบจัดการตลาด',
    icon: <ShoppingBag size={20} />,
    navLink: '/market'
  }
  // {
  //   id: 'ตลาด',
  //   title: 'ระบบจัดการตลาด',
  //   icon: <ShoppingBag size={20} />,
  //   children:[
  //     {
  //       id: 'จัดการ',
  //       title: 'จัดการ',
  //       icon: <ChevronsRight size={20} />,
  //       navLink: '/market'
  //     },
  //     {
  //       id: 'เพิ่มร้านค้า',
  //       title: 'เพิ่มร้านค้า',
  //       icon: <ChevronsRight size={20} />,
  //       navLink: '/market-add'
  //     }
  //   ]
  // }
  // {
  //   id: 'ร้านค้า',
  //   title: 'ระบบจัดการร้านค้า',
  //   icon: <ShoppingCart size={20} />,
  //   children:[
  //     {
  //       id: 'จัดการ',
  //       title: 'จัดการ',
  //       icon: <ChevronsRight size={20} />,
  //       navLink: '/store'
  //     },
  //     {
  //       id: 'เพิ่มร้านค้า',
  //       title: 'เพิ่มร้านค้า',
  //       icon: <ChevronsRight size={20} />,
  //       navLink: '/store-add'
  //     }
  //   ]
  // },
  // {
  //   id: 'reservation',
  //   title: 'ระบบจัดการการจองพื้นที่',
  //   icon: <Pocket size={20} />,
  //   navLink: '/reservation'
  // }
]
