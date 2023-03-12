
import {
  Card,
  CardHeader,
  CardTitle,
  CardText,
  CardLink,
  CardBody,
  Form,
  Modal,
  ModalBody,
  ModalHeader,
  Label,
  Input,
  Button,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  ListGroup,
  ListGroupItem,
  CardImg
} from "reactstrap"
import Avatar from '@components/avatar'
import Select from 'react-select'
import { MoreVertical, Edit, User, Check, X, DownloadCloud, FileText, Archive, Trash, ChevronDown, Delete, TrendingUp, Box, DollarSign } from 'react-feather'
import axios from 'axios'
import {useEffect, useState, Fragment} from 'react'
import { useHistory, Link } from "react-router-dom"
import Swal from "sweetalert2"
import DataTable from 'react-data-table-component'
import Cleave from 'cleave.js/react'
import apiConfig from '../../configs/apiConfig'

const Market = () => {
  const history = useHistory()
  const [isLoading, setisLoading] = useState(true)

  const [userdata, setUserdata] = useState([])
  
  const url = apiConfig.mainurl.url
  const [data, setData] = useState([])
  const [modaldata, setModaldata] = useState([])
  const [show, setShow] = useState(false)
  const [edit, setEdit] = useState(false)

  const fetchApi = () => {
      axios.get(`${url}/api/market`).then((res) => {
          setData(res.data.data)
          setisLoading(false)
      })
  }

  const fetchApiRefresh = () => {
      console.log(userdata)
      setisLoading(true)
      axios.get(`${url}/api/market`).then((res) => {
          setisLoading(false)
          setData(res.data.data)
      })
  }

const getLocal = () => {
  const authStorage = localStorage.getItem("auth")
  const savedStorage = localStorage.getItem("saved")
  if (authStorage === null || savedStorage === null) {
    history.push('/login')
    // return <Link to="/login"/>
    localStorage.clear()
  } else if (savedStorage && (new Date().getTime() - savedStorage > 50 * 60 * 1000)) {
    history.push('/login')
    // return <Link to="/login"/>
    localStorage.clear()
  } else if (authStorage) {
    setUserdata(JSON.parse(authStorage))
    fetchApi()
  }
}

useEffect(() => {
  getLocal()
}, [])


  const detailsFunc = (data) => {
    setModaldata(data)
    setShow(true)
    setEdit(false)
  }
  
  const dashboardFunc = (data) => {
    console.log(data)
    history.push(`/market-detail?marketid=${data.id}`)
  }
  
  const deleteFunc = (data) => {
    // console.log(data)
      Swal.fire({
          title: 'ยืนยันการลบตลาด',
          text: `ยืนยันการลบตลาด '${data.name}'`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'ยืนยันการลบ',
          cancelButtonText : 'ยกเลิก',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
          },
          buttonsStyling: false
        }).then(function (result) {
          if (result.value) {
            console.log(`${url}/api/market?id=${data.id}`)
            axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
            axios.delete(`${url}/api/market?id=${data.id}`).then((res) => {
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
                
              Swal.fire({
                icon: 'success',
                title: 'ลบสำเร็จ',
                text: 'ลบสำเร็จ',
                showConfirmButton: false,
                timer: 500
              })
              fetchApiRefresh()                                  
              }
            })              
          }
        })
    }

    const updateFunc = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Confirm Update '${modaldata.group_name}'`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            customClass: {
              confirmButton: 'btn btn-primary',
              cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
          }).then(function (result) {
            if (result.value) {
              axios.post(`${url}/api/datalog/admin`, {
                admin_id : admindata.admin_id,
                adminlog_detail : `[EDIT] ${modaldata.group_name}`
              })
              axios.put(`${url}/api/group/${modaldata.group_id}`, {
                group_name: modaldata.group_name,
                group_location: modaldata.group_location,
                group_detail: modaldata.group_detail,
                group_token: modaldata.group_token,
                group_password: modaldata.group_password,
                group_ads: modaldata.group_ads
              }).then((res) => {
                console.log("res = ")
                console.log(res)
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
                  Swal.fire({
                    icon: 'success',
                    title: 'Add Information!',
                    text: 'Successfully Added.',
                    customClass: {
                      confirmButton: 'btn btn-success'
                    }
                  }).then(function (result) {
                    if (result.value) {
                      setShow(false)
                      setEdit(false)
                      fetchApi()
                    }
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
        // minWidth:'50px',
        selector: (row, key) => key + 1
      },
      {
          name: 'ชื่อตลาด',
          sortable: true,
          // minWidth:'50px',
          selector: row => row.name
      },
      // {
      //     name: 'รายละเอียด',
      //     sortable: true,
      //     // minWidth: '50px',
      //     selector: row => row.details
      // },
      {
          name: 'ผู้ดูแล',
          sortable: true,
          // minWidth: '50px',
          selector: row => row.userName
      },        
      {
          name: 'จัดการ',
          allowOverflow: true,
          cell: (data) => {
          return (
              <div className='d-flex'>
              {/* <Box size={15} style={{cursor:'pointer'}}/> */}
              <Box size={15} onClick={() => history.push(`/store?marketid=${data.id}`)} style={{cursor:'pointer'}}/>
              <span className='align-middle ms-1'/>
              <FileText size={15} onClick={() => detailsFunc(data)} style={{cursor:'pointer'}}/>
              <span className='align-middle ms-1'/>
              <Edit size={15} onClick={() => dashboardFunc(data)} style={{cursor:'pointer'}}/>
              <span className='align-middle ms-1'/>
              {/* <Edit size={15} onClick={() => editFunc(data)} style={{cursor:'pointer'}}/>
              <span className='align-middle ms-1'/> */}
              <Trash size={15} onClick={() => deleteFunc(data)} style={{cursor:'pointer'}}/>
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
    <div>
      <Card className='card-statistics'>
        <CardHeader>
          <CardTitle tag='h4'>สรุป</CardTitle>
          {/* <CardText className='card-text font-small-2 me-25 mb-0'>Updated 1 month ago</CardText> */}
        </CardHeader>
        <CardBody className='statistics-body'>
          <Row>
            <Col>
              <div className='d-flex align-items-center'>
                <Avatar color='light-primary' icon={<TrendingUp size={24} />} className='me-2' />
                <div className='my-auto'>
                  <h4 className='fw-bolder mb-0'>{data.length}</h4>
                  <CardText className='font-small-3 mb-0'>จำนวนตลาด</CardText>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
      {/* <Button color="primary" onClick={() => history.push('/group-add')}>+ เพิ่มตลาด</Button> */}
      <Button color="primary" onClick={() => history.push('/market-add')}>+ เพิ่มตลาด</Button>
      <span className='align-middle ms-1'/>
      <Button color="warning" onClick={() => fetchApiRefresh()}>รีเฟรช</Button>
      <span className='align-middle ms-1'/>
      
      <br/>
      <br/>
      <DataTable
        noHeader
        pagination
        data={data}
        columns={basicColumns}
        className='react-dataTable'
        sortIcon={<ChevronDown size={10} />}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        noDataComponent="ไม่พบข้อมูล"
      />
      <Modal isOpen={show} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent'></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>รายละเอียดตลาด</h1>
            <img className='my-0 me-0 mt-2' width={150} src={modaldata.img} />
          </div>
                 
          <Row tag='form' className='gy-1 pt-75'>
            <Col md={12} xs={12}>
              <Label className='form-label' for='Name'>
                ชื่อตลาด
              </Label>
              <Input type='text' placeholder='ชื่อตลาด' defaultValue={modaldata.name} value={modaldata.name} onChange={(e) => setModaldata({...modaldata, name:e.target.value})} disabled={!edit}/>
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='Location'>
              รายละเอียดตลาด
              </Label>
              <Input type='text' placeholder='รายละเอียดตลาด' defaultValue={modaldata.details} value={modaldata.details} onChange={(e) => setModaldata({...modaldata, details:e.target.value})} disabled={!edit}/>
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='Detail'>
                อีเมลผู้ดูแล
              </Label>
              <Input type='text' placeholder='อีเมล' defaultValue={modaldata.userEmail} value={modaldata.userEmail} onChange={(e) => setModaldata({...modaldata, userEmail:e.target.value})} disabled={!edit}/>
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='Token'>
                เบอร์โทรศัพท์
              </Label>
              <Input type='text' placeholder='เบอร์โทรศัพท์' defaultValue={modaldata.userTel} value={modaldata.userTel} onChange={(e) => setModaldata({...modaldata, userTel:e.target.value})} disabled/>                
            </Col>
            {/* <Col md={12} xs={12}>
              <Label className='form-label' for='Ads'>
                รูปภาพ
              </Label>
              <Input type='text' placeholder='รูปภาพ' defaultValue={modaldata.group_ads} value={modaldata.group_ads} onChange={(e) => setModaldata({...modaldata, group_ads:e.target.value})} disabled={!edit}/>
            </Col>
            <Col md={12} xs={12}>
            {edit ? ( 
              <Label className='form-label' for='Ads'>
                รูปภาพ
              </Label>
            ) : null }
            {edit ? ( 
              <Card>
                <CardBody >
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <div className='d-flex align-items-center justify-content-center flex-column'>
                      <DownloadCloud size={64} />
                      <h5>ลากรูปภาพมาที่นี่</h5>
                      <p className='text-secondary'>
                      วางไฟล์ที่นี่หรือคลิก{' '}
                        <a href='/' onClick={e => e.preventDefault()}>
                        เรียกดู
                        </a>{' '}
                        เครื่องของคุณอย่างละเอียด
                         
                      </p>
                    </div>
                  </div>
                  {files.length ? (
                    <Fragment>
                      <ListGroup className='my-2'>{fileList}</ListGroup>
                      <div className='d-flex justify-content-end'>
                        <Button className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                          Remove
                        </Button>
                        <Button className='me-1' color='primary' onClick={uploadVideo}>Upload Files</Button>
                      </div>
                    </Fragment>
                  ) : null}
                
                {isUploading ? (
                  <div>
                    <div class="spinner-border text-success" role="status"></div>
                    <span class="sr-only"> Video Uploading...</span>
                  </div>) : null}                  
              </CardBody>
            </Card> 
            ) : null }
              
            </Col> */}
            
            <Col xs={12} className='text-center mt-2 pt-50'>
            {edit ? <Button className='me-1' color='primary' onClick={updateFunc}>
                Submit
              </Button> : null}
              
              <Button type='reset' color='danger' outline onClick={() => setShow(false)}>
                Close
              </Button>
            </Col>
            
          </Row>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default Market
