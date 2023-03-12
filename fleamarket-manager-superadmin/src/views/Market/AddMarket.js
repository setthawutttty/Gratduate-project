// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
// ** Third Party Components
import Select from 'react-select'
import Cleave from 'cleave.js/react'
import { Controller } from 'react-hook-form'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useHistory } from "react-router-dom"
import apiConfig from '../../configs/apiConfig'
import DataTable from 'react-data-table-component'
import Swal from "sweetalert2"

import { Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback, FormGroup } from 'reactstrap'

import { MoreVertical, Edit, User, Check, X, DownloadCloud, FileText, Archive, Trash, ChevronDown, Delete, TrendingUp, Box, DollarSign } from 'react-feather'


const AddMarket = () => {
  const history = useHistory()

  const url = apiConfig.mainurl.url
  console.log(url)

  const [datainput, setDatainput] = useState({ market_name: "", tel: "", name: "", email: "" })

  const fetchApi = async (datauser) => {

    console.log(`${url}/api/users?id=${datauser.user.id}`)
    axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`

  }

  const getLocal = () => {
    const authStorage = localStorage.getItem("auth")
    const savedStorage = localStorage.getItem("saved")
    if (authStorage === null || savedStorage === null) {
      history.push('/login')
      localStorage.clear()
    } else if (savedStorage && (new Date().getTime() - savedStorage > 50 * 60 * 1000)) {
      history.push('/login')
      localStorage.clear()
    } else if (authStorage) {
      fetchApi(JSON.parse(authStorage))
      console.log(JSON.parse(authStorage).user)
      setDatainput({ ...datainput, market_id: JSON.parse(authStorage).user.market_id })

    }
  }

  useEffect(() => {
    getLocal()
  }, [])

  const submitForm = async () => {
    console.log(datainput)
    console.log(`Bearer ${JSON.parse(localStorage.getItem("auth")).token}`)
    if (
      datainput.email.length === 0 ||
      datainput.name.length === 0 ||
      datainput.market_name.length === 0 ||
      datainput.tel.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        showConfirmButton: false,
        timer: 1000
      })
      return 0
    }
    // axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
    axios.post(`${url}/api/auth/register`, {
      name: datainput.name,
      email: datainput.email,
      password: "12345678",
      permission: "MARKET",
      tel: datainput.tel
    }).then(datas => {
      console.log(datas.data)
      if (datas.data.code === 200) {
        // #####################################
        axios.post(`${url}/api/market`, {
          name: datainput.market_name,
          location_lat: "0",
          location_lng: "0",
          details: datainput.market_name,
          openTime: "10:30:00",
          closeTime: "20:30:00",
          users_id: datas.data.data
        }).then(data2 => {
          console.log(data2.data)
          if (data2.data.code === 200) {
            Swal.fire({
              title: `เพิ่มตลาดสำเร็จ`,
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            })
            history.push(`/market`)
          } else {
            Swal.fire({
              title: `เพิ่มตลาดไม่สำเร็จ`,
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

  const [emailready, setEmailready] = useState(false)

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
        setDatainput({ ...datainput, market_name: "", tel: "", name: "" })
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
          setDatainput({ ...datainput, market_name: "", tel: "", name: "" })
          setEmailready(true)
        } else {
          Swal.fire({
            title: `อีเมล ${datainput.email} ไม่สามารถใช้ได้`,
            icon: 'error',
            showConfirmButton: false,
            timer: 1000
          })
          setEmailready(false)
          setDatainput({ ...datainput, market_name: "", tel: "", name: "" })
        }
      })
    }

  }

  const clearemailFunc = () => {
    setDatainput({ ...datainput, email: "" })
    setEmailready(false)
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>เพิ่มตลาด</CardTitle>
          {/* <Button tag={Label} color="warning" onClick={() => fetchApi(userdata)}>รีเฟรช</Button> */}
        </CardHeader>
        <CardBody className='py-2 my-25'>

          <Form className='mt-2 pt-50'>
            <Row>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='emailInput'>
                  อีเมล
                </Label>
                <Input id='emailInput' type='email' name='email' placeholder='อีเมล'
                  onChange={(e) => setDatainput({ ...datainput, email: e.target.value })}
                  value={datainput.email}
                  disabled={emailready}
                />
              </Col>

              <Col sm='6' className='mt-2'>
                <Button color='primary' onClick={checkemailFunc} disabled={emailready}>
                  ตรวจสอบอีเมล
                </Button>
                <Button className='ms-2' color='primary' onClick={clearemailFunc} disabled={!emailready}>
                  แก้ไขอีเมล
                </Button>
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='company'>
                  ชื่อผู้ดูแล
                </Label>
                <Input id='company' name='company' placeholder='ชื่อผู้ดูแล'
                  onChange={(e) => {
                    setDatainput({ ...datainput, name: e.target.value })
                    // setEmailready(true)
                  }}
                  value={datainput.name}
                  disabled={!emailready}
                />
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='phNumber'>
                  เบอร์โทรศัพท์
                </Label>
                <Input id='company' name='company' placeholder='เบอร์โทรศัพท์'
                  onChange={(e) => setDatainput({ ...datainput, tel: e.target.value })}
                  value={datainput.tel}
                  disabled={!emailready}
                />
              </Col>

              <Col sm='12' className='mb-1'>
                <Label className='form-label' for='company'>
                  ชื่อตลาด
                </Label>
                <Input id='company' name='company' placeholder='ชื่อตลาด'
                  onChange={(e) => {
                    setDatainput({ ...datainput, market_name: e.target.value })
                    // setEmailready(true)
                  }}
                  value={datainput.market_name}
                  disabled={!emailready}
                />
              </Col>


              <Col className='mt-2' sm='12'>
                <Button className='me-1' color='primary' onClick={submitForm}>
                  บันทึก
                </Button>
                <Button color='warning' onClick={() => history.push("/")}>
                  {/* <Button color='warning' onClick={() => fetchApi(userdata)}> */}
                  ยกเลิก
                </Button>
                {/* <Button color='warning' onClick={() => console.log(data)}>
                  ดูข้อมูล
                </Button>
                <Button color='warning' onClick={() => console.log(datainput)}>
                  ดูข้อมูล 2
                </Button> */}
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default AddMarket
