// import { Card, CardHeader, CardBody, CardTitle, CardText, CardLink } from 'reactstrap'
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
    Badge
  } from "reactstrap"
  import { Controller } from 'react-hook-form'
  
  import ReactExport from "react-export-excel"

  const ExcelFile = ReactExport.ExcelFile
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn
  import Avatar from '@components/avatar'
  import Select from 'react-select'
  import { MoreVertical, Edit, User, Check, X, FileText, Archive, Trash, ChevronDown, Delete, TrendingUp, Box, DollarSign } from 'react-feather'
  import axios from 'axios'
  import {useEffect, useState} from 'react'
  import { useHistory} from "react-router-dom"
  import Swal from "sweetalert2"
  import DataTable from 'react-data-table-component'
  import Cleave from 'cleave.js/react'
  import apiConfig from '../../configs/apiConfig'

  const Device = () => {
    const history = useHistory()
    const [groupid, setGroupid] = useState(0)
    console.log(history)
    console.log(groupid)
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
        setGroupid(JSON.parse(authStorage).data.message[0].group_id)
        console.log(JSON.parse(authStorage).data.message[0].group_id)
        // console.log(groupid)
        // history.push('/home')
      }
    }
    useEffect(() => {
        getLocal()
    }, [])
    // const groupid = 0
    // const params = new URLSearchParams(history.location.search)
    // if (!params.get('groupid')) {
    //     history.push('/')
    // }
    // const groupid = params.get('groupid')
    // console.log(searchParams)
    // console.log(history.location.search)        
    // console.log(params.get('groupid'))
    // console.log(history.location.search)
    // console.log(history.location.search.get("groupid"))
    const url = apiConfig.mainurl.url
    const [group, setGroup] = useState([])
    const [data, setData] = useState([])
    const [modaldata, setModaldata] = useState([])
    const [show, setShow] = useState(false)
    const [edit, setEdit] = useState(false)
    const [showdetail, setShowdetail] = useState(false)
    const [countBlank, setCountBlank] = useState(0)
    const [countDeposit, setCountdeposit] = useState(0)
    
    const fetchApi = async () => {
        console.log(group)
        console.log(countBlank)
        console.log(countDeposit)
        const authStorage = localStorage.getItem("auth")
        const savedStorage = localStorage.getItem("saved")
        if (authStorage === null || savedStorage === null) {
            history.push('/login')
            localStorage.clear()
        } else if (savedStorage && (new Date().getTime() - savedStorage > 50 * 60 * 1000)) {
            history.push('/login')
            localStorage.clear()
        } else if (authStorage) {
            setGroupid(JSON.parse(authStorage).data.message[0].group_id)
            console.log(JSON.parse(authStorage).data.message[0].group_id)
            // console.log(groupid)
            // history.push('/home')
        }
        await axios.get(`${url}/api/group/${JSON.parse(authStorage).data.message[0].group_id}`).then((res) => {
            console.log("res.data = ")
            console.log(res.data.data.status)
            if (!res.data.data.status) {
                history.push('/')
                return 0
            }
            setGroup(res.data.data.message[0])
        })
      await axios.get(`${url}/api/datalog/admin/${JSON.parse(authStorage).data.message[0].admin_id}`).then((res) => {        
            setData(res.data.data.message)
            console.log(res.data.data.message)
            const count1 = res.data.data.message.filter(function(item) {
                if (item.device_success === 1) {
                    return true
                } else { 
                    return false
                }
            })
            const count2 = res.data.data.message.filter(function(item) {
                if (item.device_success === 0) {
                    return true
                } else {
                    return false
                }
            })
            setCountBlank(count2.length)
            setCountdeposit(count1.length)
            // console.log(`count = ${count1.length}`)
        // return count.length
        })
    }
    useEffect(async () => {
    //   await getLocal()
      await fetchApi()
    }, [])

    // const detailsFunc = (data) => {
    //   setModaldata(data)
    //   setShow(true)
    //   setEdit(false)
    // }

    // const editFunc = (data) => {
    //   setModaldata(data)
    //   setShow(true)
    //   setEdit(true)
    // }
    
    // const dashboardFunc = (data) => {
    //   console.log(data)
    //   history.push(`/group-dashboard?groupid=${data.group_id}`)
    //   // setModaldata(data)
    //   // setShow(true)
    //   // setEdit(true)
    // }

    
    // const deleteFunc = (id) => {
    //   console.log(id)
    //     Swal.fire({
    //         title: 'Are you sure?',
    //         text: `Confirm Delete '${id.device_name}'`,
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonText: 'Yes, delete it!',
    //         customClass: {
    //           confirmButton: 'btn btn-primary',
    //           cancelButton: 'btn btn-danger ms-1'
    //         },
    //         buttonsStyling: false
    //       }).then(function (result) {
    //         if (result.value) {
    //           axios.delete(`${url}/api/device/device/device_id/${id.device_id}`).then((res) => {
    //             if (res.data.data.err) {
    //               Swal.fire({
    //                 title: 'Error',
    //                 icon: 'error',
    //                 customClass: {
    //                 confirmButton: 'btn btn-danger'
    //               }
    //             })
    //             return 0
    //             } else {
    //               Swal.fire({
    //                 icon: 'success',
    //                 title: 'Delete Information!',
    //                 text: 'Successfully Delete.',
    //                 customClass: {
    //                   confirmButton: 'btn btn-success'
    //                 }
    //               }).then(function (result) {
    //                 if (result.value) {
    //                   // window.location.reload(false)
    //                   fetchApi()
    //                 }
    //               })                                     
    //             }
    //           })              
    //         }
    //       })
    //   }
      
    //   const cleardataFunc = (data) => {
    //     console.log(`cleardataFunc = ${data}`)
    //     console.log(data)
    //     if (data.device_status !== 0) {
    //         Swal.fire({
    //             title: 'Are you sure?',
    //             text: `Confirm Clear '${data.device_name}'`,
    //             icon: 'warning',
    //             showCancelButton: true,
    //             confirmButtonText: 'Yes, Clear it!',
    //             customClass: {
    //               confirmButton: 'btn btn-primary',
    //               cancelButton: 'btn btn-danger ms-1'
    //             },
    //             buttonsStyling: false
    //           }).then(function (result) {
    //             if (result.value) {
    //               axios.put(`${url}/api/device/device/device_id/${data.device_id}`, {
    //                 device_name: data.device_name,
    //                 group_id: data.group_id,
    //                 log_id: 0,
    //                 user_id: 0,
    //                 device_password: data.device_password,
    //                 device_status: 0,
    //                 device_success: 0
    //               }).then((res) => {
    //                 console.log(res.data)
    //                 if (res.data.data.err) {
    //                   Swal.fire({
    //                     title: 'Error',
    //                     icon: 'error',
    //                     customClass: {
    //                     confirmButton: 'btn btn-danger'
    //                   }
    //                 })
    //                 return 0
    //                 } else {
    //                   Swal.fire({
    //                     icon: 'success',
    //                     title: 'Clear Information!',
    //                     text: 'Successfully Clear.',
    //                     customClass: {
    //                       confirmButton: 'btn btn-success'
    //                     }
    //                   }).then(function (result) {
    //                     if (result.value) {
    //                       // window.location.reload(false)
    //                     //   setShow(false)
    //                     //   setEdit(false)
    //                       fetchApi()
    //                     }
    //                   })                                     
    //                 }
    //               })              
    //             }
    //           })
    //     }        
    //   }

      const updateFunc = () => {
        // console.log(modaldata)
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
                axios.put(`${url}/api/device/device/device_id/${modaldata.device_id}`, {
                    device_name: modaldata.device_name,
                    group_id: modaldata.group_id,
                    log_id: modaldata.log_id,
                    user_id: modaldata.user_id,
                    device_password: modaldata.device_password,
                    device_status: modaldata.device_status,
                    device_success: modaldata.device_success
                  }).then((res) => {
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
                        // window.location.reload(false)
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

    // const showdetailFunc = (datas) => {
    //     if (modaldata.log_id !== 0) {
    //         console.log(datas)
    //         setShowdetail(true)
    //     }
    // }

    // const statusFunc = (datas) => {
    //     setModaldata(datas)
    //     setShowdetail(true)
    //     console.log(datas)
    //     console.log(modaldata)
    // }

    const basicColumns = [
    //   {
    //     name: 'Actions',
    //     allowOverflow: true,
    //     cell: (data) => {
    //       return (
    //         <div className='d-flex'>
    //           {/* <Box size={15} onClick={() => dashboardFunc(data)}/>
    //           <span className='align-middle ms-1'/> */}
    //           <FileText size={15} onClick={() => detailsFunc(data)} style={{cursor:'pointer'}}/>
    //           <span className='align-middle ms-1'/>
    //           <Edit size={15} onClick={() => editFunc(data)} style={{cursor:'pointer'}}/>
    //           <span className='align-middle ms-1'/>
    //           <Trash size={15} onClick={() => deleteFunc(data)} style={{cursor:'pointer'}}/>
    //           <span className='align-middle ms-1'/>
              
    //         </div>
    //       )
    //     }
    //   },
      {
        name: 'Admin',
        sortable: true,
        // minWidth:'50px',
        selector: row => row.admin_name
      },
      {
        name: 'Details',
        sortable: true,
        // minWidth:'50px',
        selector: row => row.adminlog_detail
      },
      {
        name: 'Create Time',
        sortable: true,
        // minWidth: '50px',
        selector: row => {
            const datetimes = new Date(row.adminlog_time)
            return datetimes.toLocaleString()
            // return datetimes.toLocaleDateString()
            // return datetimes.toISOString().slice(0, 19).replace('T', ' ')
        }
      }
    ]
    
    return (
      <div>
      {/* <Card>
        <CardHeader>
          <CardTitle>{group.group_name}</CardTitle>
        </CardHeader>
        <CardBody>
            <Row>
                <Col>
                    <CardText>Location : {group.group_location}</CardText>
                </Col>
                <Col>
                    <CardText>Detail : {group.group_detail}</CardText>
                </Col>
            </Row>
            <Row>
                <Col>
                    <CardText>Token : {group.group_token}</CardText>
                </Col>
                <Col>
                    <CardText>Password : {group.group_password}</CardText>
                </Col>
            </Row>
        </CardBody>
      </Card> */}
        <Card className='card-statistics'>
          <CardHeader>
            <CardTitle tag='h4'>Datalog Statistics</CardTitle>
          </CardHeader>
          <CardBody className='statistics-body'>
            <Row>
              <Col>
                <div className='d-flex align-items-center'>
                  <Avatar color='light-primary' icon={<TrendingUp size={24} />} className='me-2' />
                  <div className='my-auto'>
                    <h4 className='fw-bolder mb-0'>{data.length}</h4>
                    <CardText className='font-small-3 mb-0'>Datalog</CardText>
                  </div>
                </div>
              </Col>
              {/* <Col>
                <div className='d-flex align-items-center'>
                  <Avatar color='light-success' icon={<Box size={24} />} className='me-2' />
                  <div className='my-auto'>
                    <h4 className='fw-bolder mb-0'>{countBlank}</h4>
                    <CardText className='font-small-3 mb-0'>Blank</CardText>
                  </div>
                </div>
              </Col>
              <Col>
                <div className='d-flex align-items-center'>
                  <Avatar color='light-warning' icon={<Box size={24} />} className='me-2' />
                  <div className='my-auto'>
                    <h4 className='fw-bolder mb-0'>{countDeposit}</h4>
                    <CardText className='font-small-3 mb-0'>Deposit</CardText>
                  </div>
                </div>
              </Col> */}
            </Row>
          </CardBody>
        </Card>
        {/* <Button color="danger" onClick={() => history.push(`/group-detail`)}>Back</Button>
        <span className='align-middle ms-1'/>
        <Button color="primary" onClick={() => history.push(`/device-add?groupid=${groupid}`)}>+ Add Device</Button>
        <span className='align-middle ms-1'/> */}
        <Button color="warning" onClick={() => fetchApi()}>Refresh</Button>
        <span className='align-middle ms-1'/>
        <ExcelFile element={<Button color="primary">Export To Excel</Button>}>
                <ExcelSheet data={data} name="Employees">
                    <ExcelColumn label="admin_id" value="admin_id"/>
                    <ExcelColumn label="adminlog_detail" value="adminlog_detail"/>
                    <ExcelColumn label="adminlog_time" value="adminlog_time"/>
                </ExcelSheet>
            </ExcelFile>
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
        />
        <Modal isOpen={show} className='modal-dialog-centered modal-lg'>
          <ModalHeader className='bg-transparent'></ModalHeader>
          <ModalBody className='px-sm-5 mx-50 pb-5'>
            <div className='text-center mb-2'>
              <h1 className='mb-1'>Device Information</h1>
              {/* <p>Updating user details will receive a privacy audit.</p> */}
            </div>
            <Row tag='form' className='gy-1 pt-75'>
              <Col md={12} xs={12}>
                <Label className='form-label' for='Name'>
                  Name
                </Label>
                <Input type='text' placeholder='Name' defaultValue={modaldata.device_name} value={modaldata.device_name} onChange={(e) => setModaldata({...modaldata, device_name:e.target.value})} disabled={!edit}/>
              </Col>
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

        <Modal isOpen={showdetail} className='modal-dialog-centered modal-lg'>
          <ModalHeader className='bg-transparent'></ModalHeader>
          <ModalBody className='px-sm-5 mx-50 pb-5'>
            <div className='text-center mb-2'>
              <h1 className='mb-1'>Detail Information</h1>
              {/* <p>Updating user details will receive a privacy audit.</p> */}
            </div>
            <Row tag='form' className='gy-1 pt-75'>
              <Col md={12} xs={12}>
                <Label className='form-label' for='Name'>
                  Name
                </Label>
                <Input type='text' placeholder='Name' defaultValue={modaldata.device_name} value={modaldata.device_name} onChange={(e) => setModaldata({...modaldata, device_name:e.target.value})} disabled={!edit}/>
              </Col>          
                <Col md={12} xs={12}>
                    <Label className='form-label' for='Name'>
                    Send People
                    </Label>
                    <img src={`${url}/images/${modaldata.log_imgsendpeople}`} width='100%' height='100%'/>
                </Col>
                <Col md={12} xs={12}>
                    <br/>
                    <br/>
                    <Label className='form-label' for='Name'>
                    Image Object
                    </Label>
                    <img src={`${url}/images/${modaldata.log_imgobject}`} width='100%' height='100%'/>
                </Col>
                <br/>
                <Col md={12} xs={12}>
                    <br/>
                    <br/>
                    <br/>
                    <Label className='form-label' for='Name'>
                    Receive
                    </Label>
                    <img src={`${url}/images/${modaldata.log_imgreceive}`} width='100%' height='100%'/>
                </Col>

              
              <Col xs={12} className='text-center mt-2 pt-50'>       
                    <br/>
                    <br/>
                    <br/>       
                    <br/>
                    <br/>     
                <Button type='reset' color='danger' outline onClick={() => setShowdetail(false)}>
                  Close People
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        
      </div>
    )
  }
  
  export default Device
  