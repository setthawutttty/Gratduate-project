import { Mail, Home, FileText, Shield, Pocket, ChevronsRight, User, Users, UserPlus, Box, Briefcase} from 'react-feather'


// const datas = JSON.parse(authStorage).data.message[0].admin_permission

// const authStorage = localStorage.getItem("auth")

export default [
  {
    id: 'home',
    title: 'Home',
    icon: <Home size={20} />,
    navLink: '/home'
  },
  {
        id: 'user1',
        title: 'Device Manager',
        icon: <Box size={20} />,
        navLink: '/deviceuser'
  },
  {
        id: 'user',
        title: 'User Manager',
        icon: <User size={20} />,
        navLink: '/user'
  },
  {
    id: 'datalog',
    title: 'Datalog',
    icon: <Briefcase size={20} />,
    navLink: '/dataloguser'
  }   
]


// export default [
//     {
//       id: 'home',
//       title: 'Home',
//       icon: <Home size={20} />,
//       navLink: '/home'
//     },
//     {
//       id: 'device',
//       title: 'Device',
//       icon: <Box size={20} />,
//       children:[
//         {
//           id: 'user1',
//           title: 'Device Manager',
//           icon: <Box size={20} />,
//           navLink: '/deviceuser'
//         }
//       ]
//     },
//     {
//       id: 'user',
//       title: 'User',
//       icon: <Users size={20} />,
//       children:[
//         {
//           id: 'user',
//           title: 'User Manager',
//           icon: <User size={20} />,
//           navLink: '/user'
//         }
//       ]
//     },
//     {
//       id: 'datalog',
//       title: 'Datalog',
//       icon: <Home size={20} />,
//       navLink: '/datalog'
//     }   
//   ]