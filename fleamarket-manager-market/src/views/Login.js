/* eslint-disable object-shorthand */
import { useSkin } from '@hooks/useSkin'
import { Link, useHistory } from 'react-router-dom'
import { Facebook, Twitter, Mail, GitHub } from 'react-feather'
import InputPasswordToggle from '@components/input-password-toggle'
import { Row, Col, CardTitle, CardText, Form, Label, Input, Button } from 'reactstrap'
import '@styles/react/pages/page-authentication.scss'
// import source from 'soss-logo.png'
// import axios from 'axios'
import { useState } from 'react'
import axios from 'axios'
import apiConfig from '../configs/apiConfig'
import Swal from "sweetalert2"

const LoginCover = () => {
  const history = useHistory()
  const { skin } = useSkin()
  const url = apiConfig.mainurl.url
  // console.log(`url = ${url}`)
  // const [data, setData] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const illustration = skin === 'dark' ? 'logo.png' : 'logo.png',
  // const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default
  // const source = require(`soss-logo.png`)
  const loginFunc = async () => {
    await axios.post(`${url}/api/auth/login`, {
        email : username,
        password : password
    }).then(res => {
      console.log(res.data)

      if (!res.data.status) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'การเข้าสู่ระบบผิดพลาด',
          showConfirmButton: false,
          timer: 1500
        })
        // setUsername("")
        // setPassword("")
      } else {
        console.log(res.data.data.user.permission)
        if (res.data.data.user.permission === "MARKET") {
          localStorage.setItem('saved', new Date().getTime())
          localStorage.setItem("auth", JSON.stringify(res.data.data))
           
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

          Toast.fire({
            icon: 'success',
            title: 'กำลังเข้าสู่ระบบ'
          }).then(() => {
            history.push('/home')
          })
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'สิทธิ์การเข้าถึงระบบระบบผิดพลาด',
            showConfirmButton: false,
            timer: 1500
          })
          // setUsername("")
          // setPassword("")
        }
      }
    })
    // console.log(`username = ${username}`)
    // console.log(`password = ${password}`)
  }
  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          <img src="logo.png" width='100px' height='60px'/>          
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bold mb-1'>
              ยินดีต้อนรับสู่ระบบจัดการตลาดเชียงใหม่ (ตลาด)
            </CardTitle>
            <Form className='auth-login-form mt-2' onSubmit={loginFunc}>
              <div className='mb-1'>
                <Label className='form-label' for='login-email'>
                  ชื่อผู้ใช้
                </Label>
                <Input type='text' id='login-email' placeholder='ชื่อผู้ใช้' value={username} onChange={e => setUsername(e.target.value)} autoFocus />
              </div>
              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    รหัสผ่าน
                  </Label>
                </div>
                <InputPasswordToggle className='input-group-merge' id='login-password' value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <Button color='primary' onClick={loginFunc}>
                เข้าสู่ระบบ
              </Button>
              <Button color='warning' className='ms-1' onClick={() => history.push('/register')}>
                สมัครสมาชิก
              </Button>
            </Form>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default LoginCover
