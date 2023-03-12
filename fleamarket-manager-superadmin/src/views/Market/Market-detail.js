import { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
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


const Market = () => {
  const history = useHistory()
  const params = new URLSearchParams(history.location.search)
  if (!params.get('marketid')) {
    history.push('/store')
  }

  const marketid = params.get('marketid')

  const url = apiConfig.mainurl.url
  const [data, setData] = useState([])
  const [datatable, setDatatable] = useState([])
  const [isLoading, setisLoading] = useState(true)
  const [userdata, setUserdata] = useState([])
  const [userdata2, setUserdata2] = useState([])

  const fetchApi = async (datauser) => {
    await axios.get(`${url}/api/market?id=${marketid}`).then((res) => {
      setData(res.data.data[0])
      console.log(res.data.data[0])
      setDatatable([])
    })

    console.log(`${url}/api/market/listimage?market_id=${marketid}`)
    await axios.get(`${url}/api/market/listimage?market_id=${marketid}`).then((res) => {
      setDatatable(res.data.data)
      console.log(res.data.data)
    })

    console.log(`${url}/api/users?id=${datauser.user.id}`)
    axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
    await axios.get(`${url}/api/users?id=${datauser.user.id}`).then(res => {
      setUserdata2(res.data.data[0])
      setisLoading(false)
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
      setUserdata(JSON.parse(authStorage))
      // setUserdata2(JSON.parse(authStorage).user)  
      // axios.get(`${url}/api/users?id=${JSON.parse(authStorage).user.id}`).then(res => setUserdata2(res.data.data[0]))
      fetchApi(JSON.parse(authStorage))
    }
  }


  const [avatar, setAvatar] = useState('')
  const [avatar2, setAvatar2] = useState('')
  const [imagedetail, setImagedetail] = useState([])
  const [isUploadding, setIsUploadding] = useState(false)

  useEffect(() => {
    getLocal()
    setIsUploadding(false)
  }, [])
  useEffect(() => {
    try {

      setAvatar(data.img === null ? "https://api.fleamarket-rmutl.com/img/market/profile/null.png" : data.img)
      console.log("data.user.img")
      console.log(data.img)
    } catch {
      //   history.push("/store")
    }
  }, [data])

  const submitForm = async () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
    console.log(`${url}/api/market?id=${data.id}`)
    console.log(`update ผู้ใช้ : ${userdata2}`)
    console.log(userdata2)
    console.log({
      name: data.name,
      location_lat: data.location_lat,
      location_lng: data.location_lng,
      details: data.details,
      openTime: data.openTime,
      closeTime: data.closeTime,
      mondayOpen: data.mondayOpen,
      tuesdayOpen: data.tuesdayOpen,
      wednesdayOpen: data.wednesdayOpen,
      thursdayOpen: data.thursdayOpen,
      fridayOpen: data.fridayOpen,
      saturdayOpen: data.saturdayOpen,
      sundayOpen: data.sundayOpen
    })
    await axios.put(`${url}/api/market?id=${data.id}`, {
      name: `${data.name}`,
      location_lat: `${data.location_lat}`,
      location_lng: `${data.location_lng}`,
      details: `${data.details}`,
      openTime: `${data.openTime}`,
      closeTime: `${data.closeTime}`,
      mondayOpen: `${data.mondayOpen}`,
      tuesdayOpen: `${data.tuesdayOpen}`,
      wednesdayOpen: `${data.wednesdayOpen}`,
      thursdayOpen: `${data.thursdayOpen}`,
      fridayOpen: `${data.fridayOpen}`,
      saturdayOpen: `${data.saturdayOpen}`,
      sundayOpen: `${data.sundayOpen}`
    }).then(data2 => {
      console.log(`update ร้านค้า : ${data2.data}`)
      console.log(data.data)

      if (data2.data.code === 200) {
        console.log(`update ผู้ใช้ : ${userdata2}`)
        console.log(`${url}/api/users?id=${data.userId}`)
        axios.put(`${url}/api/users?id=${data.userId}`, {
          name: `${data.userName}`,
          email: `${data.userEmail}`,
          permission: `MARKET`,
          tel: `${data.userTel}`
        }).then(data => {
          console.log(data.data)
          if (data.data.code === 200) {
            // setTimeout(() => {
            console.log("setTimeout")
            fetchApi(userdata)
            Swal.fire({
              title: 'สำเร็จ',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            })
          } else {
            Swal.fire({
              title: 'ไม่สำเร็จ',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-danger'
              }
            })
          }
        })
      } else {
        Swal.fire({
          title: 'ไม่สำเร็จ',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        })
      }
    })
  }

  const onChangeDetailImage = e => {
    setImagedetail(e.target.files)
  }

  const uploadImageDetail = async () => {
    // console.log(imagedetail)
    // // imagedetail.map(datas => {
    // //   console.log(datas)
    // // })
    setIsUploadding(true)
    const formData = new FormData()
    Array.from(imagedetail).forEach(file => formData.append("file", file))
    // formData.append("file", imagedetail[0])
    formData.append("id", data.id)
    await axios.post(`${url}/api/market/uploadillustration`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }).then(res => {
      console.log(res.data)
      if (res.data.code === 200) {
        Swal.fire({
          title: 'สำเร็จ',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
        setImagedetail([])
        setIsUploadding(false)
        fetchApi(userdata)
      } else {
        setImagedetail([])
        setIsUploadding(false)
        Swal.fire({
          title: 'ไม่สำเร็จ',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        })
      }
    })
  }


  const onChange = e => {
    setAvatar2(e.target.files)
    const reader = new FileReader(),
      files = e.target.files
    reader.onload = function () {
      setAvatar(reader.result)
      console.log(avatar)
    }
    reader.readAsDataURL(files[0])
  }

  const uploadProfile = async () => {
    const formData = new FormData()
    formData.append("file", avatar2[0])
    formData.append("id", data.id)
    await axios.post(`${url}/api/market/uploadprofile`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }).then(res => {
      if (res.data.code === 200) {
        Swal.fire({
          title: 'สำเร็จ',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      } else {
        Swal.fire({
          title: 'ไม่สำเร็จ',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        })
      }
    })
  }

  const deleteImg = (data) => {
    console.log(data)
    Swal.fire({
      title: 'ยืนยันการลบรูปภาพ',
      text: `ยืนยันการลบรูปภาพ '${data.id}'`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยันการลบ',
      cancelButtonText: 'ยกเลิก',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ms-1'
      },
      buttonsStyling: false
    })
      .then(function (result) {
        if (result.value) {
          axios.delete(`${url}/api/market/deleteimage?id=${data.id}`).then((res) => {
            if (res.data.data.err) {
              Swal.fire({
                title: 'Error',
                icon: 'error',
                customClass: {
                  confirmButton: 'btn btn-danger'
                }
              })
              return 0
            } else {
              fetchApi(userdata)
              Swal.fire({
                icon: 'success',
                title: 'ลบข้อมูลสำเร็จ',
                text: 'ลบข้อมูลสำเร็จ',
                showConfirmButton: false,
                timer: 500
              })
            }
          })
        }
      })
  }
  const basicColumns = [
    {
      name: 'ลำดับ',
      sortable: true,
      selector: (row, key) => key + 1
    },
    {
      name: 'รูปภาพ',
      sortable: true,
      selector: (row) => {
        return (
          <img src={row.path} width="150" />
        )
      }
    },
    {
      name: 'วันที่เพิ่ม',
      sortable: true,
      selector: row => new Date(row.updateAt).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'long'
      })
    },
    {
      name: 'จัดการ',
      allowOverflow: true,
      cell: (data) => {
        return (
          <div className='d-flex'>
            <Trash size={15} onClick={() => deleteImg(data)} style={{ cursor: 'pointer' }} />
          </div>
        )
      }
    }
  ]

  if (isLoading) {
    return (
      <div>
        <CardHeader>
          <CardTitle tag='h4'><div><div class="spinner-border text-primary" role="status"></div>&nbsp;&nbsp;กำลังโหลด</div></CardTitle>
        </CardHeader>
      </div>
    )
  }
  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>รายละเอียดตลาด</CardTitle>
          <Button tag={Label} color="warning" onClick={() => fetchApi(userdata)}>รีเฟรช</Button>
        </CardHeader>
        <CardBody className='py-2 my-25'>
          <div className='d-flex'>
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
                {/* <Button className='mb-75' color='secondary' size='sm' outline onClick={handleImgReset}>
                  
                </Button> */}
                <p className='mb-0'>อนุญาต JPG, GIF หรือ PNG ขนาดสูงสุด 800kB</p>
              </div>
            </div>
          </div>
          <Form className='mt-2 pt-50'>
            {/* <Form className='mt-2 pt-50' onSubmit={submitForm}> */}
            <Row>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='firstName'>
                  ชื่อตลาด
                </Label>
                <Input id='storename' type='text' name='storename' placeholder='ชื่อตลาด'
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  value={data.name}
                />
              </Col>
              <Col sm='1' className='mb-1'>
                <Label className='form-label' for='firstName'>
                  ละติจูด
                </Label>
                <Input id='storename' type='text' name='storename' placeholder='ละติจูด'
                  onChange={(e) => setData({ ...data, location_lat: e.target.value })}
                  value={data.location_lat}
                />
              </Col>
              <Col sm='1' className='mb-1'>
                <Label className='form-label' for='firstName'>
                  ลองจิจูด
                </Label>
                <Input id='storename' type='text' name='storename' placeholder='ลองจิจูด'
                  onChange={(e) => setData({ ...data, location_lng: e.target.value })}
                  value={data.location_lng}
                />
              </Col>
              <Col sm='2' className='mb-1'>
                <Label className='form-label' for='firstName'>
                  เวลาเปิด
                </Label>
                <Input id='storename' type='time' name='storename' placeholder='เวลาเปิด' step="1"
                  onChange={(e) => setData({ ...data, openTime: e.target.value })}
                  value={data.openTime}
                />
              </Col>
              <Col sm='2' className='mb-1'>
                <Label className='form-label' for='firstName'>
                  เวลาปิด
                </Label>
                <Input id='storename' type='time' name='storename' placeholder='เวลาปิด' step="1"
                  onChange={(e) => setData({ ...data, closeTime: e.target.value })}
                  value={data.closeTime}
                />
              </Col>

              <Col sm='12' className='mb-1'>
                <Label className='form-label' for='lastName'>
                  รายละเอียดตลาด
                </Label>
                <Input
                  name='text'
                  type='textarea'
                  id='exampleText'
                  placeholder='รายละเอียดตลาด'
                  // onChange={(e) => setdetailvalue(e.target.value) }
                  onChange={(e) => setData({ ...data, details: e.target.value })}
                  value={data.details}
                />
                <Label className='text-red' style={(data.details).length > 255 ? { color: 'red' } : { color: 'black' }}>
                  {`${data.details.length}`}
                </Label>
                <Label className='text-red'>
                  /255
                </Label>
              </Col>

              <Col sm='12' className='mb-1'>
                <Label className='form-label' for='lastName'>
                  วันทำการ
                </Label>
                <br />
                <FormGroup
                  check
                  inline
                >
                  <Input type="checkbox"
                    onChange={(e) => setData({ ...data, sundayOpen: e.target.checked ? 1 : 0 })}
                    checked={data.sundayOpen}
                  />
                  <Label check>
                    อาทิตย์
                  </Label>
                </FormGroup>
                <FormGroup
                  check
                  inline
                >
                  <Input type="checkbox"
                    onChange={(e) => setData({ ...data, mondayOpen: e.target.checked ? 1 : 0 })}
                    checked={data.mondayOpen}
                  />
                  <Label check>
                    จันทร์
                  </Label>
                </FormGroup>
                <FormGroup
                  check
                  inline
                >
                  <Input type="checkbox"
                    onChange={(e) => setData({ ...data, tuesdayOpen: e.target.checked ? 1 : 0 })}
                    checked={data.tuesdayOpen}
                  />
                  <Label check>
                    อังคาร
                  </Label>
                </FormGroup>
                <FormGroup
                  check
                  inline
                >
                  <Input type="checkbox"
                    onChange={(e) => setData({ ...data, wednesdayOpen: e.target.checked ? 1 : 0 })}
                    checked={data.wednesdayOpen}
                  />
                  <Label check>
                    พุธ
                  </Label>
                </FormGroup>
                <FormGroup
                  check
                  inline
                >
                  <Input type="checkbox"
                    onChange={(e) => setData({ ...data, thursdayOpen: e.target.checked ? 1 : 0 })}
                    checked={data.thursdayOpen}
                  />
                  <Label check>
                    พฤหัสบดี
                  </Label>
                </FormGroup>
                <FormGroup
                  check
                  inline
                >
                  <Input type="checkbox"
                    onChange={(e) => setData({ ...data, fridayOpen: e.target.checked ? 1 : 0 })}
                    checked={data.fridayOpen}
                  />
                  <Label check>
                    ศุกร์
                  </Label>
                </FormGroup>
                <FormGroup
                  check
                  inline
                >
                  <Input type="checkbox"
                    onChange={(e) => setData({ ...data, saturdayOpen: e.target.checked ? 1 : 0 })}
                    checked={data.saturdayOpen}
                  />
                  <Label check>
                    เสาร์
                  </Label>
                </FormGroup>
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='emailInput'>
                  อีเมล
                </Label>
                <Input id='emailInput' type='email' name='email' placeholder='อีเมล'
                  onChange={(e) => setData({ ...data, location_lng: e.target.value })}
                  value={data.userEmail} disabled
                />
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='company'>
                  ชื่อผู้ดูแล
                </Label>
                <Input id='company' name='company' placeholder='ชื่อผู้ดูแล'
                  onChange={(e) => setData({ ...data, userName: e.target.value })}
                  value={data.userName}
                />
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='phNumber'>
                  เบอร์โทรศัพท์
                </Label>
                <Input id='company' name='company' placeholder='เบอร์โทรศัพท์'
                  onChange={(e) => setData({ ...data, userTel: e.target.value })}
                  value={data.userTel}
                />
              </Col>

              <Col className='mt-2' sm='12'>
                <Button className='me-1' color='primary' onClick={submitForm}>
                  {/* <Button type='submit' className='me-1' color='primary'  onClick={submitForm}> */}
                  บันทึก
                </Button>
                {/* <Button className='me-1' color='primary' onClick={submitForm}>
                  Save changes2
                </Button>          */}
                {/* <Button color='warning' onClick={ () => history.push("/")}> */}
                <Button color='warning' onClick={() => fetchApi(userdata)}>

                  ยกเลิก
                </Button>
                
                {/* <Button color='secondary' onClick={ () => console.log(data)}>
                data
                </Button>
                <Button color='secondary' onClick={ () => console.log(userdata2)}>
                userdata2
                </Button> */}
                {/* <Button color='secondary' onClick={ () => console.log(data)}>
                data
                </Button> */}
                {/* <Button color='secondary' onClick={submitForm}>
                  ทดสอบ2
                </Button>
                <Button color='secondary' onClick={ () => console.log(userdata2)}>
                userdata2
                </Button> */}

              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>

      {/* รายละเอียดรูปภาพ */}

      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>ระบบจัดการรูปภาพ</CardTitle>
        </CardHeader>
        <CardBody className='py-2 my-25'>
          {/* <Button tag={Label} color="primary" >+ เพิ่มรูปภาพ
          <Input type='file' onChange={onChangeDetailImage} hidden accept='image/*' />
        </Button> */}

          {/* <Button tag={Label} className='mb-75 me-75' size='sm' color='primary'> */}
          <Button tag={Label} color="primary" >
            เลือกรูปภาพ
            <Input type='file' onChange={onChangeDetailImage} hidden accept='image/*' multiple />
          </Button>
          <span className='align-middle ms-1' />
          <Button tag={Label} color="danger" onClick={uploadImageDetail} disabled={imagedetail.length === 0}>อัพโหลด</Button>
          {/* <span className='align-middle ms-1'/>
        <Button tag={Label} color="warning" onClick={() => fetchApi(userdata)}>รีเฟรช</Button>
        <span className='align-middle ms-1'/>
        <Button tag={Label} color="warning" onClick={() => console.log(imagedetail)}>ดูรูป</Button> */}
          <span className='align-middle ms-1'><p>เลือก {imagedetail.length} ไฟล์</p></span>
          {isUploadding ? <div><div class="spinner-border text-primary" role="status"></div>&nbsp;&nbsp;กำลังอัพโหลด</div> : null}
          {/* <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>กำลังอัพโหลด */}

          <br />
          <br />
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
          // theme="solarized"
          />
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default Market
