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
    Badge,
    ListGroup,
    ListGroupItem
  } from "reactstrap"
  import { Controller } from 'react-hook-form'
  
  import Avatar from '@components/avatar'
  import Select from 'react-select'
  import { MoreVertical, Edit, User, Check, X, FileText, Archive, Trash, ChevronDown, Delete, DownloadCloud, TrendingUp, Box, DollarSign } from 'react-feather'
  import axios from 'axios'
  import {useEffect, useState, Fragment } from 'react'
  import { useHistory} from "react-router-dom"
  import Swal from "sweetalert2"
  import DataTable from 'react-data-table-component'
  import Cleave from 'cleave.js/react'
  import apiConfig from '../../configs/apiConfig'

  import { useDropzone } from 'react-dropzone'
  const Device = () => {
    const history = useHistory()
    const [groupid, setGroupid] = useState(0)
    const [admindata, setAdmindata] = useState([])
    console.log(admindata)
    console.log(history)
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
        // console.log(JSON.parse(authStorage).data.message[0].admin_name)
        setAdmindata(JSON.parse(authStorage).data.message[0])
        
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
    const [showeditgroup, setShoweditgroup] = useState(false)
    
    const fetchApi = async () => {
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
      await axios.get(`${url}/api/device/group/group_web/${JSON.parse(authStorage).data.message[0].group_id}`).then((res) => {        
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

    const detailsFunc = (data) => {
      setModaldata(data)
      setShow(true)
      setEdit(false)
    }

    const editFunc = (data) => {
      setModaldata(data)
      setShow(true)
      setEdit(true)
    }
    
    // const dashboardFunc = (data) => {
    //   console.log(data)
    //   history.push(`/group-dashboard?groupid=${data.group_id}`)
    //   // setModaldata(data)
    //   // setShow(true)
    //   // setEdit(true)
    // }

    
    const deleteFunc = (id) => {
      console.log(id)
        Swal.fire({
            title: 'Are you sure?',
            text: `Confirm Delete '${id.device_name}'`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            customClass: {
              confirmButton: 'btn btn-primary',
              cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
          }).then(function (result) {
            if (result.value) {
              axios.post(`${url}/api/datalog/admin`, {
                admin_id : admindata.admin_id,
                adminlog_detail : `[DELETE] ${id.device_name}`
              })
              axios.delete(`${url}/api/device/device/device_id/${id.device_id}`).then((res) => {
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
                    title: 'Delete Information!',
                    text: 'Successfully Delete.',
                    customClass: {
                      confirmButton: 'btn btn-success'
                    }
                  }).then(function (result) {
                    if (result.value) {
                      // window.location.reload(false)
                      fetchApi()
                    }
                  })                                     
                }
              })              
            }
          })
      }
      
      const cleardataFunc = (data) => {
        console.log(`cleardataFunc = ${data}`)
        console.log(data)
        if (data.device_status !== 0) {
            Swal.fire({
                title: 'Are you sure?',
                text: `Confirm Clear '${data.device_name}'`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Clear it!',
                customClass: {
                  confirmButton: 'btn btn-primary',
                  cancelButton: 'btn btn-danger ms-1'
                },
                buttonsStyling: false
              }).then(function (result) {
                if (result.value) {
                  
                  axios.post(`${url}/api/datalog/admin`, {
                    admin_id : admindata.admin_id,
                    adminlog_detail : `[OPEN] ${data.device_name}`
                  })
                  axios.put(`${url}/api/device/device/device_id/${data.device_id}`, {
                    device_name: data.device_name,
                    group_id: data.group_id,
                    log_id: 0,
                    user_id: 0,
                    device_password: data.device_password,
                    device_status: 0,
                    device_success: 0
                  }).then((res) => {
                    console.log(res.data)
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
                        title: 'Clear Information!',
                        text: 'Successfully Clear.',
                        customClass: {
                          confirmButton: 'btn btn-success'
                        }
                      }).then(function (result) {
                        if (result.value) {
                          // window.location.reload(false)
                        //   setShow(false)
                        //   setEdit(false)
                          fetchApi()
                        }
                      })                                     
                    }
                  })              
                }
              })
        }
        
      }
      const updateFunc = () => {
        console.log("updateFunc ====")
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
                console.log("axios.post(`${url}/api/datalog/admin` ====")
                axios.post(`${url}/api/datalog/admin`, {
                  admin_id : admindata.admin_id,
                  adminlog_detail : `[EDIT] ${modaldata.device_name}`
                })
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

    const statusFunc = (datas) => {
        setModaldata(datas)
        setShowdetail(true)
        console.log(datas)
        console.log(modaldata)
    }

    const basicColumns = [
      {
        name: 'Actions',
        allowOverflow: true,
        cell: (data) => {
          return (
            <div className='d-flex'>
              {/* <Box size={15} onClick={() => dashboardFunc(data)}/>
              <span className='align-middle ms-1'/> */}
              <FileText size={15} onClick={() => detailsFunc(data)} style={{cursor:'pointer'}}/>
              <span className='align-middle ms-1'/>
              <Edit size={15} onClick={() => editFunc(data)} style={{cursor:'pointer'}}/>
              <span className='align-middle ms-1'/>
              <Trash size={15} onClick={() => deleteFunc(data)} style={{cursor:'pointer'}}/>
              <span className='align-middle ms-1'/>
              
            </div>
          )
        }
      },
      {
        name: 'Device ID',
        sortable: true,
        // minWidth:'50px',
        selector: row => row.device_id
      },
      {
        name: 'Name',
        sortable: true,
        // minWidth:'50px',
        selector: row => row.device_name
      },
      {
        name: 'Door',
        sortable: true,
        // minWidth: '50px',
        selector: row => row.device_status,
        cell: (row) => {
            return (<Badge color={row.device_status !== 0 ? 'light-danger' : 'light-success'} pill onClick={() => cleardataFunc(row)} style={{cursor:'pointer'}}>
              {row.device_status !== 0 ? 'Close' : 'Open'}
            </Badge>)        
        }  
      },
      {
        name: 'Status',
        sortable: true,
        selector: row => row.device_success,
        cell: (row) => {
            return (<Badge color={row.device_success === 1 ? 'light-warning' : 'light-success'} pill style={{cursor:'pointer'}} onClick={() => statusFunc(row)}>
              {row.device_success === 1 ? 'Deposit' : 'Blank'}
            </Badge>)        
        }        
      },
      {
        name: 'Password',
        sortable: true,
        selector: row => row.device_password
        // cell: (row) => {
        //     return (<Badge color={row.device_success === 1 ? 'light-warning' : 'light-success'} pill >
        //       {row.device_success === 1 ? 'Deposit' : 'Blank'}
        //     </Badge>)        
        // }        
      },
      {
        name: 'Create Time',
        sortable: true,
        // minWidth: '50px',
        selector: row => {
            const datetimes = new Date(row.device_createtime)
            return datetimes.toString()
            // return datetimes.toISOString().slice(0, 19).replace('T', ' ')
        }
      },
      {
        name: 'Update Time',
        sortable: true,
        // minWidth: '50px',
        // selector: row => row.device_updatetime
        selector: row => {
            const datetimes = new Date(row.device_updatetime)
            return datetimes.toString("th-TH", { timeZone: "UTC" })
            // return datetimes.toISOString().slice(0, 19).replace('T', ' ')
        }
      }
    ]
    
    
    const [files, setFiles] = useState([])
    const [isUploading, setisUploading] = useState(false)

    const { getRootProps, getInputProps } = useDropzone({
      multiple: false,
      onDrop: acceptedFiles => {
        setFiles(acceptedFiles)
        // setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
      }
    })

    const renderFilePreview = file => {
      if (file.type.startsWith('image')) {
        return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='28' width='28' />
      } else {
        return <FileText size='28' />
      }
    }

    const handleRemoveFile = file => {
      const uploadedFiles = files
      const filtered = uploadedFiles.filter(i => i.name !== file.name)
      setFiles([filtered])
      // setFiles([...filtered])
    }

    const renderFileSize = size => {
      if (Math.round(size / 100) / 10 > 1000) {
        return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
      } else {
        return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
      }
    }
    
    const fileList = files.map((file, index) => (
      <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
        <div className='file-details d-flex align-items-center'>
          <div className='file-preview me-1'>{renderFilePreview(file)}</div>
          <div>
            <p className='file-name mb-0'>{file.name}</p>
            <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
          </div>
        </div>
        <Button color='danger' outline size='sm' className='btn-icon' onClick={() => handleRemoveFile(file)}>
          <X size={14} />
        </Button>
      </ListGroupItem>
    ))

    const handleRemoveAllFiles = () => {
      setFiles([])
    }

    const uploadVideo = async () =>  {
      setisUploading(true)
      console.log(`uploadVideo `)
      console.log(modaldata)
      console.log(files)
      const bodyFormData = new FormData()
      bodyFormData.append('file', files[0])
      console.log(bodyFormData)
      console.log(`${url}/upload-video/upload-video/${group.group_id}`)
      // axios.post(`${url}/upload-video/upload-video/3/${modaldata.group_id}`)
      await axios({
        method: "post",
        url: `${url}/upload-video/upload-video/${group.group_id}`,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(function (response) {
          
          Swal.fire({
            icon: 'success',
            title: 'Upload Video Status!',
            text: 'Successfully Upload Video.',
            timer:1000,
            showConfirmButton : false
          })
          // console.log("upload video ......")
          setisUploading(false)
          setFiles([])
          //handle success
          setGroup({...group, group_ads:response.data.data.url})
          // console.log(response.data.data.url)
          // fetchApi()
        })
        .catch(function (response) {
          //handle error
          console.log("err upload video ......")
          console.log(response)
        })
    }

    const updateGroupFunc = () => {
      console.log("admindata = ")
      console.log(admindata)
        Swal.fire({
            title: 'Are you sure?',
            text: `Confirm Update '${group.group_name}'`,
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
                adminlog_detail : `[EDIT] ${group.group_name}`
              })
              axios.put(`${url}/api/group/${group.group_id}`, {
                group_name: group.group_name,
                group_location: group.group_location,
                group_detail: group.group_detail,
                group_token: group.group_token,
                group_password: group.group_password,
                group_ads: group.group_ads
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
                      // window.location.reload(false)
                      // setShow(false)
                      // setEdit(false)
                      setShoweditgroup(false)
                      fetchApi()
                    }
                  })                                     
                }
              })              
            }
          })
      }
    return (
      <div>
      <Button color="warning" onClick={() => setShoweditgroup(true)}>Edit</Button>
      <br/>
      <br/>
      <Card>
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
            <Row>
                <Col>
                    <CardText>Ads : {group.group_ads}</CardText>
                </Col>
            </Row>
        </CardBody>
      </Card>
        <Card className='card-statistics'>
          <CardHeader>
            <CardTitle tag='h4'>Group Statistics</CardTitle>
            {/* <CardText className='card-text font-small-2 me-25 mb-0'>Updated 1 month ago</CardText> */}
          </CardHeader>
          <CardBody className='statistics-body'>
            <Row>
              <Col>
                <div className='d-flex align-items-center'>
                  <Avatar color='light-primary' icon={<TrendingUp size={24} />} className='me-2' />
                  <div className='my-auto'>
                    <h4 className='fw-bolder mb-0'>{data.length}</h4>
                    <CardText className='font-small-3 mb-0'>Device</CardText>
                  </div>
                </div>
              </Col>
              <Col>
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
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Button color="danger" onClick={() => history.push(`/group-detail`)}>Back</Button>
        <span className='align-middle ms-1'/>
        <Button color="primary" onClick={() => history.push(`/device-add?groupid=${groupid}`)}>+ Add Device</Button>
        <span className='align-middle ms-1'/>
        <Button color="warning" onClick={() => fetchApi()}>Refresh</Button>
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
        
        <Modal isOpen={showeditgroup} className='modal-dialog-centered modal-lg'>
          <ModalHeader className='bg-transparent'></ModalHeader>
          <ModalBody className='px-sm-5 mx-50 pb-5'>
            <div className='text-center mb-2'>
              <h1 className='mb-1'>Group Information</h1>
              {/* <p>Updating user details will receive a privacy audit.</p> */}
            </div>
            <Row tag='form' className='gy-1 pt-75'>
              <Col md={12} xs={12}>
                <Label className='form-label' for='Name'>
                  Name
                </Label>
                <Input type='text' placeholder='Name' defaultValue={group.group_name} value={group.group_name} onChange={(e) => setGroup({...group, group_name:e.target.value})} disabled={!showeditgroup}/>
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='Location'>
                  Location
                </Label>
                <Input type='text' placeholder='Location' defaultValue={group.group_location} value={group.group_location} onChange={(e) => setGroup({...group, group_location:e.target.value})} disabled={!showeditgroup}/>
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='Detail'>
                  Detail
                </Label>
                <Input type='text' placeholder='Detail' defaultValue={group.group_detail} value={group.group_detail} onChange={(e) => setGroup({...group, group_detail:e.target.value})} disabled={!showeditgroup}/>
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='Token'>
                  Token
                </Label>
                <Input type='text' placeholder='Token' defaultValue={group.group_token} value={group.group_token} onChange={(e) => setGroup({...group, group_token:e.target.value})} disabled/>
                {/* <Input type='text' placeholder='Token' defaultValue={modaldata.group_token} value={modaldata.group_token} onChange={(e) => setModaldata({...modaldata, group_token:e.target.value})} disabled={!edit}/> */}
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='Password'>
                  Password
                </Label>
                <Input type='text' placeholder='Password' defaultValue={group.group_password} value={group.group_password} onChange={(e) => setGroup({...group, group_password:e.target.value})} disabled/>
                {/* <Input type='text' placeholder='Password' defaultValue={modaldata.group_password} value={modaldata.group_password} onChange={(e) => setModaldata({...modaldata, group_password:e.target.value})} disabled={!edit}/> */}
              </Col>
              <Col md={12} xs={12}>
                <Label className='form-label' for='Ads'>
                  Ads
                </Label>
                <Input type='text' placeholder='Ads' defaultValue={group.group_ads} value={group.group_ads} onChange={(e) => setGroup({...group, group_ads:e.target.value})} disabled={!showeditgroup}/>
              </Col>
              <Col md={12} xs={12}>
                <Label className='form-label' for='Ads'>
                  Ads Video
                </Label>
                {/* <FileUploaderSingle /> */}
                {/* <Input type='text' placeholder='Ads' defaultValue={modaldata.group_ads} value={modaldata.group_ads} onChange={(e) => setModaldata({...modaldata, group_ads:e.target.value})} disabled={!edit}/> */}
                <Card>
                {/* <CardHeader>
                  <CardTitle tag='h4'>Single</CardTitle>
                </CardHeader> */}
                <CardBody>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <div className='d-flex align-items-center justify-content-center flex-column'>
                      <DownloadCloud size={64} />
                      <h5>Drop Files here or click to upload</h5>
                      <p className='text-secondary'>
                        Drop files here or click{' '}
                        <a href='/' onClick={e => e.preventDefault()}>
                          browse
                        </a>{' '}
                        thorough your machine
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
                        {/* <Button color='primary' onClick={testalert}>test</Button> */}
                      </div>
                    </Fragment>
                  ) : null}
                  
                  {isUploading ? (
                    <div>
                      <div class="spinner-border text-success" role="status"></div>
                      <span class="sr-only"> Video Uploading...</span>
                    </div>) : null}
                  
                  {/* <LoadingOverlay
                    active={isUploading}
                    spinner
                    text='Uploading your video...'
                    >
                    <p>Uploading your video...</p>
                  </LoadingOverlay> */}
                </CardBody>
              </Card>
              </Col>
              
              <Col xs={12} className='text-center mt-2 pt-50'>
              {showeditgroup ? <Button className='me-1' color='primary' onClick={updateGroupFunc}>
                  Submit
                </Button> : null}
                
                <Button type='reset' color='danger' outline onClick={() => setShoweditgroup(false)}>
                  Close
                </Button>
              </Col>
              
            </Row>
          </ModalBody>
        </Modal>
      </div>
    )
  }
  
  export default Device
  