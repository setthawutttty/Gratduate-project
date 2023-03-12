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
// import DataTable, { createTheme } from 'react-data-table-component'
import Swal from "sweetalert2"
// ** Utils
import { selectThemeColors } from '@utils'
// ** Reactstrap Imports
import { Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback, FormGroup } from 'reactstrap'

import { MoreVertical, Edit, User, Check, X, DownloadCloud, FileText, Archive, Trash, ChevronDown, Delete, TrendingUp, Box, DollarSign } from 'react-feather'
// ** Utils
// import { selectThemeColors } from '@utils'

// const currencyOptions = [
//   { value: 'usd', label: 'USD' },
//   { value: 'euro', label: 'Euro' },
//   { value: 'pound', label: 'Pound' },
//   { value: 'bitcoin', label: 'Bitcoin' }
// ]

const AddStore = () => {
  const history = useHistory()
  // const params = new URLSearchParams(history.location.search)
  // if (!params.get('storeid')) {
  //     history.push('/store')
  // }

  // const storeid = params.get('storeid')
  // const storeid = 8
  // createTheme('solarized', {
  //   text: {
  //     primary: '#268bd2',
  //     secondary: '#2aa198'
  //   },
  //   background: {
  //     default: '#002b36'
  //   },
  //   context: {
  //     background: '#cb4b16',
  //     text: '#FFFFFF'
  //   },
  //   divider: {
  //     default: '#073642'
  //   },
  //   action: {
  //     button: 'rgba(0,0,0,.54)',
  //     hover: 'rgba(0,0,0,.08)',
  //     disabled: 'rgba(0,0,0,.12)'
  //   }
  // }, 'dark')

  const url = apiConfig.mainurl.url
  console.log(url)
  const [data, setData] = useState([])
  useEffect(() => {
    console.log(data)
  }, [data])
  // useEffect(() => {
  //     console.log(data)
  //     setData([])
  // }, [])
  // const [datatable, setDatatable] = useState([])
  // const [isLoading, setisLoading] = useState(true)
  // const [userdata, setUserdata] = useState([])
  // const [userdata2, setUserdata2] = useState([])

  const [datainput, setDatainput] = useState({ details: "", storename: "", tel: "", name: "", email: "" })
  // setDatainput({...datainput, details : "", storename : "", tel : "", name : ""})

  // const [storetype, setStoreType] = useState([])

  // const [detailvalue, setdetailvalue] = useState("")
  const [storetype, setStoreType] = useState([])
  const fetchApi = async (datauser) => {
    // console.log(`${url}/api/market?id=${storeid}`)
    // console.log(`Bearer ${datauser.token}`)
    // console.log(`userdata ${userdata}`)
    // console.log(`datauser`)
    // console.log(datauser)

    console.log(`${url}/api/users?id=${datauser.user.id}`)
    axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`

    await axios.get(`${url}/api/store/type`).then(async (res) => {
      // console.log(res.data)
      if (res.data.status) {
        const datas = []
        await (res.data.data).map(data => {
          datas.push({ value: data.id, label: data.name })
        })
        setStoreType(datas)
        // setisLoading(false)
      } else {
        // localStorage.clear()
        // history.push('/login')
      }

      // })
    })
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
      //   setUserdata(JSON.parse(authStorage))

      // setUserdata2(JSON.parse(authStorage).user)  
      // axios.get(`${url}/api/users?id=${JSON.parse(authStorage).user.id}`).then(res => setUserdata2(res.data.data[0]))
      fetchApi(JSON.parse(authStorage))
      console.log(JSON.parse(authStorage).user)

      setDatainput({ ...datainput, market_id: JSON.parse(authStorage).user.market_id })

    }
  }


  //   const [avatar, setAvatar] = useState('')
  //   const [avatar2, setAvatar2] = useState('')
  //   const [imagedetail, setImagedetail] = useState([])
  //   const [isUploadding, setIsUploadding] = useState(false)

  useEffect(() => {
    getLocal()
    // caches.keys().then((names) => {
    //     names.forEach((name) => {
    //       caches.delete(name)
    //     })
    //   })
    // caches
    // setIsUploadding(false)
  }, [])

  //   useEffect(() => {
  //     try {

  //       setAvatar(data.img === null ? "https://api.fleamarket-rmutl.com/img/market/profile/null.png" : data.img)
  //       console.log("data.user.img")
  //       console.log(data.img)
  //     } catch {
  //     //   history.push("/store")
  //     }
  //   }, [data])

  const defaultValuestoreType = () => {
    return ({ value: 0, label: "กรุณาเลือกประเภทร้านค้า" })
    // return ({ value: data.storetypeId, label: data.storetype })
  }

  const onChangestoreType = (e) => {
    setData({ ...data, storetypeId: e.value, storetype: e.label })
  }

  const submitForm = async () => {
    console.log(datainput)
    console.log(`Bearer ${JSON.parse(localStorage.getItem("auth")).token}`)
    if (datainput.details.length === 0 ||
      datainput.details.email ||
      datainput.details.name ||
      datainput.details.storename ||
      datainput.details.tel) {
      Swal.fire({
        icon: 'error',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        showConfirmButton: false,
        timer: 1000
      })
      return 0
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
    axios.post(`${url}/api/auth/register`, {
      name: datainput.name,
      email: datainput.email,
      password: "12345678",
      permission: "STORE",
      tel: datainput.tel
    }).then(datas => {
      console.log(datas.data)
      if (datas.data.code === 200) {
        // #####################################
        console.log({
          name: datainput.storename,
          details: datainput.details,
          storetype_id: data.storetypeId,
          market_id: datainput.market_id,
          users_id: datas.data.data
        })
        axios.post(`${url}/api/store`, {
          name: datainput.storename,
          details: datainput.details,
          storetype_id: data.storetypeId,
          market_id: datainput.market_id,
          users_id: datas.data.data
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
            history.push(`/store-detail?storeid=${data2.data.data.id}`)
          } else {
            Swal.fire({
              title: `เพิ่มร้านค้าไม่สำเร็จ`,
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-danger'
              }
            })
            axios.delete(`${url}/api/users?id=${datas.data.data}`)
          }
        })

        // Swal.fire({
        //     title: `สามารถใช้ได้`,
        //     icon: 'success',
        //     customClass: {
        //     confirmButton: 'btn btn-success'
        //   }
        // })
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

    // Swal.fire({
    //     title: 'สำเร็จ',
    //     icon: 'success',
    //     customClass: {
    //     confirmButton: 'btn btn-success'
    // }})
  }

  const [emailready, setEmailready] = useState(false)

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email)
  }
  const checkemailFunc = () => {
    if (!isValidEmail(datainput.email)) {
      setEmailready(false)
      if (!datainput) {
        // if (datainput.email.length === 0 || !datainput) {
        // Swal.fire({
        //     title: 'กรุณากรอกอีเมล',
        //     icon: 'error',
        //     customClass: {
        //     confirmButton: 'btn btn-danger'
        //   }
        // })
        Swal.fire({
          icon: 'error',
          title: 'กรุณากรอกอีเมล',
          showConfirmButton: false,
          timer: 1000
        })
      } else {
        // Swal.fire({
        //     title: 'รูปแบบอีเมลไม่ถูกต้อง',
        //     icon: 'error',
        //     customClass: {
        //     confirmButton: 'btn btn-danger'
        //   }
        // })
        Swal.fire({
          icon: 'error',
          title: 'รูปแบบอีเมลไม่ถูกต้อง',
          showConfirmButton: false,
          timer: 1000
        })
        setDatainput({ ...datainput, details: "", storename: "", tel: "", name: "" })
      }
    } else {
      axios.post(`${url}/api/auth/checkemail`, {
        email: datainput.email
      }).then(data => {
        console.log(data.data)
        if (data.data.code === 200) {
          // Swal.fire({
          //     title: `อีเมล ${datainput.email} สามารถใช้ได้`,
          //     icon: 'success',
          //     customClass: {
          //     confirmButton: 'btn btn-success'
          //   }
          // })
          Swal.fire({
            title: `อีเมล ${datainput.email} สามารถใช้ได้`,
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          // setDatainput({details,storename,tel,name,email})
          setDatainput({ ...datainput, details: "", storename: "", tel: "", name: "" })
          setEmailready(true)
        } else {
          // Swal.fire({
          //     title: `อีเมล ${datainput.email} ไม่สามารถใช้ได้`,
          //     icon: 'error',
          //     customClass: {
          //     confirmButton: 'btn btn-danger'
          //   }
          // })
          Swal.fire({
            title: `อีเมล ${datainput.email} ไม่สามารถใช้ได้`,
            icon: 'error',
            showConfirmButton: false,
            timer: 1000
          })
          setEmailready(false)
          setDatainput({ ...datainput, details: "", storename: "", tel: "", name: "" })
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
          <CardTitle tag='h4'>เพิ่มร้านค้า</CardTitle>
          {/* <Button tag={Label} color="warning" onClick={() => fetchApi(userdata)}>รีเฟรช</Button> */}
        </CardHeader>
        <CardBody className='py-2 my-25'>
          {/* <div className='d-flex'>
            <div className='me-25'>
              <img className='rounded me-50' src={avatar} alt='Generic placeholder image' height='100' width='100' />
            </div>
            <div className='d-flex align-items-end mt-75 ms-1'>
              <div>
                <Button tag={Label} className='mb-75 me-75' size='sm' color='primary'>
                  เลือกรูปภาพ
                  <Input type='file' onChange={onChange} hidden accept='image/*' />
                </Button>
                <Button className='mb-75 me-75' size='sm' color='danger' onClick={uploadProfile}>
                  อัพโหลด
                </Button>
                <p className='mb-0'>อนุญาต JPG, GIF หรือ PNG ขนาดสูงสุด 800kB</p>
              </div>
            </div>
          </div> */}
          <Form className='mt-2 pt-50'>
            {/* <Form className='mt-2 pt-50' onSubmit={submitForm}> */}
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

              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='company'>
                  ชื่อร้านค้า
                </Label>
                <Input id='company' name='company' placeholder='ชื่อร้านค้า'
                  onChange={(e) => {
                    setDatainput({ ...datainput, storename: e.target.value })
                    // setEmailready(true)
                  }}
                  value={datainput.storename}
                  disabled={!emailready}
                />
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='currency'>
                  ประเภทร้านค้า
                </Label>
                <Select
                  id='storeType'
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={storetype}
                  theme={selectThemeColors}
                  defaultValue={defaultValuestoreType}
                  onChange={onChangestoreType}
                  //   disabled={!emailready}
                  isDisabled={!emailready}
                //   defaultValue={storetype[0]}
                //   defaultInputValue={storetype[0]}
                />
              </Col>
              <Col sm='12' className='mb-1'>
                <Label className='form-label' for='lastName'>
                  รายละเอียดร้านค้า
                </Label>
                <Input
                  name='text'
                  type='textarea'
                  id='exampleText'
                  placeholder='รายละเอียดร้านค้า'
                  // onChange={(e) => setdetailvalue(e.target.value) }
                  onChange={(e) => setDatainput({ ...datainput, details: e.target.value })}
                  value={datainput.details}
                  disabled={!emailready}
                />
                {/* <Label className='text-red' style={(datainput.details).length > 255 ? {color:'red'} : {color:'black'} }>
                    {`${datainput.details.length}`}
                </Label> */}
                <Label className='text-red'>
                  {`${typeof datainput.details === "undefined" ? 0 : datainput.details.length}`}
                </Label>
                <Label className='text-red'>
                  /255
                </Label>
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

      {/* รายละเอียดรูปภาพ */}

      {/* <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>ระบบจัดการรูปภาพ</CardTitle>
        </CardHeader>
        <CardBody className='py-2 my-25'>
        <Button tag={Label} color="primary" >
          เลือกรูปภาพ
          <Input type='file' onChange={onChangeDetailImage} hidden accept='image/*' multiple />
        </Button>
        <span className='align-middle ms-1'/>
        <Button tag={Label} color="danger" onClick={uploadImageDetail} disabled={imagedetail.length === 0}>อัพโหลด</Button>
        <span className='align-middle ms-1'><p>เลือก {imagedetail.length} ไฟล์</p></span>
        {isUploadding ? <div><div class="spinner-border text-primary" role="status"></div>&nbsp;&nbsp;กำลังอัพโหลด</div> : null }        
        <br/>
        <br/>
        <DataTable
          noHeader
          pagination
          data={datatable}
          columns={basicColumns}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          noDataComponent="ไม่พบข้อมูล"
          paginationPerPage={5}
        />
        </CardBody>
      </Card> */}
    </Fragment>
  )
}

export default AddStore
