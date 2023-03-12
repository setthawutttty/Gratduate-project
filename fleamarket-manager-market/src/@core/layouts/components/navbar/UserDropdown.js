// ** React Imports
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { isUserLoggedIn } from '@utils'

// ** Third Party Components
import { User, Mail, CheckSquare, MessageSquare, Settings, CreditCard, HelpCircle, Power, Pass, Key } from 'react-feather'

// ** Reactstrap Imports
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-27.jpg'

const UserDropdown = () => {
  // ** State
  // const [userData] = useState(null)
  // const [userData, setUserData] = useState(null)

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      // setUserData(JSON.parse(localStorage.getItem('userData')))
      console.log(localStorage.getItem('userData'))
    }
  }, [])

  //** Vars
  const userAvatar = defaultAvatar
  // const userAvatar = (userData && userData.avatar) || defaultAvatar
  const authStorage = localStorage.getItem("auth")
  console.log(authStorage)
  if (!authStorage) {
    return <Link to="/login"/>
  }
  // console.log(JSON.parse(authStorage).data.message[0].admin_name)
  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name fw-bold'>{JSON.parse(authStorage).user.name}</span>
          <span className='user-status'>{JSON.parse(authStorage).user.permission}</span>
        </div>
        <Avatar img={userAvatar} imgHeight='40' imgWidth='40' status='online' />
      </DropdownToggle>
      <DropdownMenu end>
        {/* <DropdownItem tag={Link} href='/pages/profile' onClick={e => e.preventDefault()}> */}
        <DropdownItem tag={Link} to='/profile'>
          <Key size={14} className='me-75' />
          <span className='align-middle'>Change Password</span>
        </DropdownItem>
        
        {/* <DropdownItem tag='a' href='/apps/todo' onClick={e => e.preventDefault()}>
          <CheckSquare size={14} className='me-75' />
          <span className='align-middle'>Tasks</span>
        </DropdownItem>
        <DropdownItem tag='a' href='/apps/chat' onClick={e => e.preventDefault()}>
          <MessageSquare size={14} className='me-75' />
          <span className='align-middle'>Chats</span>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem tag='a' href='/pages/account-settings' onClick={e => e.preventDefault()}>
          <Settings size={14} className='me-75' />
          <span className='align-middle'>Settings</span>
        </DropdownItem>
        <DropdownItem tag='a' href='/pages/pricing' onClick={e => e.preventDefault()}>
          <CreditCard size={14} className='me-75' />
          <span className='align-middle'>Pricing</span>
        </DropdownItem>
        <DropdownItem tag='a' href='/pages/faq' onClick={e => e.preventDefault()}>
          <HelpCircle size={14} className='me-75' />
          <span className='align-middle'>FAQ</span>
        </DropdownItem> */}
        <DropdownItem onClick={() => localStorage.clear()} tag={Link} to='/login'>
          <Power size={14} className='me-75' />
          <span className='align-middle'>Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
