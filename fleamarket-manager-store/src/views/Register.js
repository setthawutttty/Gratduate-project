/* eslint-disable object-shorthand */
import { useSkin } from "@hooks/useSkin"
import { Link, useHistory } from "react-router-dom"
import { Facebook, Twitter, Mail, GitHub } from "react-feather"
import InputPasswordToggle from "@components/input-password-toggle"
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button
} from "reactstrap"
import "@styles/react/pages/page-authentication.scss"
import { useState, useEffect } from "react"
import axios from "axios"
import apiConfig from "../configs/apiConfig"
import Swal from "sweetalert2"
import Select from 'react-select'
import { selectThemeColors } from '@utils'

const RegisterCover = () => {
  const history = useHistory()
  const { skin } = useSkin()
  const url = apiConfig.mainurl.url

  const [datainput, setDatainput] = useState({
    store_name: "", name: "", email: "", password: "", tel: "", submitpassword: ""
  })
  const [emailready, setEmailready] = useState(false)
  const [market, setMarket] = useState([])
  // const [defaultValuemarket, setDefaultValuemarket] = useState([])

  // const [data, setData] = useState([])

  useEffect(async () => {
    if (1 + 1 === 5) {
      history.push("/")
      console.log(datainput)
      console.log(setDatainput)
      axios.get(url)
      setEmailready(false)
    }
    await axios.get(`${url}/api/market`).then(async (res) => {
      console.log(res.data)
      if (res.data.status) {
        const datas = []
        await (res.data.data).map(data => {
          datas.push({ value: data.id, label: `${data.id} : ${data.name}` })
        })
        // setDefaultValuemarket({ value: res.data.data[0].id, label: res.data.data[0].name })
        setMarket(datas)
      } else {
        localStorage.clear()
        history.push('/login')
      }

    })
  }, [])

  const illustration = skin === "dark" ? "logo.png" : "logo.png",
    source = require(`@src/assets/images/pages/${illustration}`).default

  // console.log(url)

  // const defaultValuestoreType = () => {
  //   return ({ value: 0, label: 0 })
  // }

  const onChangestoreType = (e) => {
    setDatainput({ ...datainput, market : {marketId: e.value, marketname: e.label }})
  }

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email)
  }

  const checkemailFunc = () => {
    if (!isValidEmail(datainput.email)) {
      setEmailready(false)
      if (!datainput) {
        Swal.fire({
          icon: 'error',
          title: 'กรุณากรอกอีเมล',
          showConfirmButton: false,
          timer: 1000
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'รูปแบบอีเมลไม่ถูกต้อง',
          showConfirmButton: false,
          timer: 1000
        })
        setDatainput({ ...datainput, store_name: "", name: "", email: "", password: "", submitpassword: "", tel: "" })
      }
    } else {
      axios.post(`${url}/api/auth/checkemail`, {
        email: datainput.email
      }).then(data => {
        console.log(data.data)
        if (data.data.code === 200) {
          Swal.fire({
            title: `อีเมล ${datainput.email} สามารถใช้ได้`,
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          setDatainput({ ...datainput, store_name: "", name: "", password: "", submitpassword: "", tel: "" })
          setEmailready(true)
        } else {
          Swal.fire({
            title: `อีเมล ${datainput.email} ไม่สามารถใช้ได้`,
            icon: 'error',
            showConfirmButton: false,
            timer: 1000
          })
          setEmailready(false)
          setDatainput({ ...datainput, store_name: "", name: "", email: "", password: "", submitpassword: "", tel: "" })
        }
      })
    }

  }

  const clearemailFunc = () => {
    setDatainput({ ...datainput, email: "" })
    setEmailready(false)
  }

  const registerFunc = () => {
    if (datainput.store_name.length === 0 ||
      datainput.name.length === 0 ||
      datainput.email.length === 0 ||
      datainput.password.length === 0 ||
      datainput.submitpassword.length === 0 ||
      datainput.tel.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        showConfirmButton: false,
        timer: 1000
      })
      return 0
    }
    if (datainput.password !== datainput.submitpassword) {
      Swal.fire({
        icon: 'error',
        title: 'รหัสผ่านไม่ตรงกัน',
        showConfirmButton: false,
        timer: 1000
      })
      return 0

    }
    // บันทึกลง DATABASE
    axios.post(`${url}/api/auth/register`, {
      name: datainput.name,
      email: datainput.email,
      password: datainput.password,
      permission: "STORE",
      tel: datainput.tel
    }).then(datas => {
      console.log(datas.data)
      if (datas.data.code === 200) {
        // #####################################
        axios.post(`${url}/api/store`, {
          name: `${datainput.store_name}`,
          details: `${datainput.store_name}`,
          storetype_id: 1,
          market_id: `${datainput.market.marketId}`,
          users_id: `${datas.data.data}`
        }).then(data2 => {
          console.log(data2.data)
          if (data2.data.code === 200) {
            Swal.fire({
              title: `เพิ่มร้านค้าสำเร็จ`,
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            })
            history.push(`/`)
          } else {
            Swal.fire({
              title: `เพิ่มร้านค้าไม่สำเร็จ`,
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-danger'
              }
            })
            // axios.delete(`${url}/api/users?id=${datas.data.data}`)
          }
        })
      } else {
        Swal.fire({
          title: `ไม่สามารถใช้ได้`,
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        })
      }
    })

  }

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <img src="logo.png" width="100px" height="60px" />
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="4" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="8"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="8" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              สมัครสมาชิก ระบบจัดการตลาดเชียงใหม่ (ร้านค้า)
            </CardTitle>
            <Row>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='emailInput'>
                  อีเมล
                </Label>
                <Input id='emailInput' type='email' name='email' placeholder='อีเมล' disabled={emailready}
                  onChange={(e) => setDatainput({ ...datainput, email: e.target.value })}
                  value={datainput.email} />
              </Col>

              <Col sm='6' className='mt-2'>
                <Button color='primary' onClick={checkemailFunc} disabled={emailready}>
                  ตรวจสอบอีเมล
                </Button>
                <Button className='ms-2' color='primary' onClick={clearemailFunc} disabled={!emailready}>
                  แก้ไขอีเมล
                </Button>
              </Col>
            </Row>
            <Row>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='textInput'>
                  รหัสผ่าน
                </Label>
                <Input id='textInput' type='password' name='text' placeholder='รหัสผ่าน' disabled={!emailready}
                  onChange={(e) => setDatainput({ ...datainput, password: e.target.value })}
                  value={datainput.password} />
              </Col>


              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='textInput'>
                  ยืนยันรหัสผ่าน
                </Label>
                <Input id='textInput' type='password' name='text' placeholder='ยืนยันรหัสผ่าน' disabled={!emailready}
                  onChange={(e) => setDatainput({ ...datainput, submitpassword: e.target.value })}
                  value={datainput.submitpassword} />
              </Col>
            </Row>
            <Row>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='textInput'>
                  ชื่อผู้ดูแล
                </Label>
                <Input id='textInput' type='text' name='text' placeholder='ชื่อผู้ดูแล' disabled={!emailready}
                  onChange={(e) => setDatainput({ ...datainput, name: e.target.value })}
                  value={datainput.name} />
              </Col>


              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='textInput'>
                  เบอร์โทรศัพท์
                </Label>
                <Input id='textInput' type='text' name='text' placeholder='เบอร์โทรศัพท์' disabled={!emailready}
                  onChange={(e) => setDatainput({ ...datainput, tel: e.target.value })}
                  value={datainput.tel} />
              </Col>
            </Row>

            <Row>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='currency'>
                  เลือกตลาด
                </Label>
                <Select
                  id='storeType'
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={market}
                  theme={selectThemeColors}
                  // defaultValue={defaultValuemarket}
                  onChange={onChangestoreType}
                  isDisabled={!emailready}
                  placeholder="กรุณาเลือกตลาด"
                //   defaultValue={data[0].storetypeId}
                />
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='textInput'>
                  ชื่อร้านค้า
                </Label>
                <Input id='textInput' type='text' name='text' placeholder='ชื่อร้านค้า' disabled={!emailready}
                  onChange={(e) => setDatainput({ ...datainput, store_name: e.target.value })}
                  value={datainput.store_name} />
              </Col>
            </Row>
            <Row>
              <Col sm='6' className='mb-1'>
                <Button color='primary' onClick={registerFunc}>
                  สมัครสมาชิก
                </Button>
                <Button color='warning' className='ms-1' onClick={() => history.push('/login')}>
                  เข้าสู่ระบบ
                </Button>
                {/* <Button color='danger' className='ms-1' onClick={() => console.log(datainput)}>
                  ดูข้อมูล
                </Button> */}
              </Col>
            </Row>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default RegisterCover
