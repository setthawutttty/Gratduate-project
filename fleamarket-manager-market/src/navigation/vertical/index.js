import { Mail, Home, FileText, Shield, Pocket, ChevronsRight, User, Users, UserPlus, Briefcase, Feather, ShoppingBag, ShoppingCart, DollarSign } from 'react-feather'


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
  },
  // {
  //   id: 'store',
  //   title: 'ระบบจัดการร้านค้า',
  //   icon: <ShoppingCart size={20} />,
  //   navLink: '/store'
  // },
  {
    id: 'ร้านค้า',
    title: 'ระบบจัดการร้านค้า',
    icon: <ShoppingCart size={20} />,
    children:[
      {
        id: 'จัดการ',
        title: 'จัดการ',
        icon: <ChevronsRight size={20} />,
        navLink: '/store'
      },
      {
        id: 'เพิ่มร้านค้า',
        title: 'เพิ่มร้านค้า',
        icon: <ChevronsRight size={20} />,
        navLink: '/store-add'
      }
    ]
  },
  {
    id: 'saleslock',
    title: 'ระบบจัดการการจองพื้นที่',
    icon: <Pocket size={20} />,
    navLink: '/saleslock'
  },
  {
    id: 'saleslock',
    title: 'ระบบจัดการบัญชีธนาคาร',
    icon: <DollarSign size={20} />,
    navLink: '/bankaccount'
  }
  
  
  // {
  //   id: 'group',
  //   title: 'ระบบจัดการตลาด',
  //   icon: <ShoppingBag size={20} />,
  //   children:[
  //     {
  //       id: 'groupAdd',
  //       title: 'รายละเอียดตลาด',
  //       icon: <Feather size={20} />,
  //       navLink: '/market-detail'
  //     },
  //     {
  //       id: 'groupAdd',
  //       title: 'จัดการจองพื้นที่ร้านค้า',
  //       icon: <Feather size={20} />,
  //       navLink: '/group-add'
  //     }
  //   ]
  // },
  // {
  //   id: 'profile',
  //   title: 'Profile',
  //   icon: <Briefcase size={20} />,
  //   navLink: '/profile'
  // }
  // {
  //   id: 'admin',
  //   title: 'Admin',
  //   icon: <Shield size={20} />,
  //   children:[
  //     {
  //       id: 'admin',
  //       title: 'Admin Manager',
  //       icon: <ChevronsRight size={20} />,
  //       navLink: '/admin'
  //     },
  //     {
  //       id: 'adminAdd',
  //       title: 'Add Admin',
  //       icon: <ChevronsRight size={20} />,
  //       navLink: '/admin-add'
  //     }
  //   ]
  // },
  // {
  //   id: 'user',
  //   title: 'User',
  //   icon: <Users size={20} />,
  //   children:[
  //     {
  //       id: 'user',
  //       title: 'User Manager',
  //       icon: <User size={20} />,
  //       navLink: '/user'
  //     }
  //   ]
  // },
  // {
  //   id: 'datalog',
  //   title: 'Datalog',
  //   icon: <Briefcase size={20} />,
  //   navLink: '/datalog'
  // }
  // ,
  // {
  //   id: 'profile',
  //   title: 'Profile',
  //   icon: <Briefcase size={20} />,
  //   navLink: '/profile'
  // }
]
// console.log(!authStorage)
// if (!authStorage){
  
// }
// export default authStorageJSON.parse(authStorage).data.message[0].admin_permission === 0 ? [
//   {
//     id: 'home',
//     title: 'Home',
//     icon: <Home size={20} />,
//     navLink: '/home'
//   },
//   {
//     id: 'group',
//     title: 'Group',
//     icon: <Pocket size={20} />,
//     children:[
//       {
//         id: 'groupAdd',
//         title: 'Group Manager',
//         icon: <ChevronsRight size={20} />,
//         navLink: '/group-detail'
//       },
//       {
//         id: 'groupAdd',
//         title: 'Add Group',
//         icon: <ChevronsRight size={20} />,
//         navLink: '/group-add'
//       }
//     ]
//   },
//   {
//     id: 'admin',
//     title: 'Admin',
//     icon: <Shield size={20} />,
//     children:[
//       {
//         id: 'admin',
//         title: 'Admin Manager',
//         icon: <ChevronsRight size={20} />,
//         navLink: '/admin'
//       },
//       {
//         id: 'adminAdd',
//         title: 'Add Admin',
//         icon: <ChevronsRight size={20} />,
//         navLink: '/admin-add'
//       }
//     ]
//   },
//   {
//     id: 'user',
//     title: 'User',
//     icon: <Users size={20} />,
//     children:[
//       {
//         id: 'user',
//         title: 'User Manager',
//         icon: <User size={20} />,
//         navLink: '/user'
//       }
//     ]
//   }
// ] : [
//   {
//     id: 'home',
//     title: 'Home',
//     icon: <Home size={20} />,
//     navLink: '/home'
//   },
//   {
//     id: 'device',
//     title: 'Device',
//     icon: <Users size={20} />,
//     children:[
//       {
//         id: 'device',
//         title: 'Device Manager',
//         icon: <User size={20} />,
//         navLink: '/device'
//       }
//     ]
//   }
// ]
