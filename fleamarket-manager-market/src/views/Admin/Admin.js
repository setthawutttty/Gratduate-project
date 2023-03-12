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
  
  import Avatar from '@components/avatar'
  import Select from 'react-select'
  import { MoreVertical, Edit, User, Check, X, FileText, Archive, Trash, ChevronDown, Delete, TrendingUp, Box, DollarSign } from 'react-feather'
  import axios from 'axios'
  import {useEffect, useState} from 'react'
  import { useHistory } from "react-router-dom"
  import Swal from "sweetalert2"
  import DataTable from 'react-data-table-component'
  import Cleave from 'cleave.js/react'
  import apiConfig from '../../configs/apiConfig'

  const Admin = () => {
    const history = useHistory()
    console.log(history)
    const [admindata, setAdmindata] = useState([])
    // console.log(admindata)
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
        setAdmindata(JSON.parse(authStorage).data.message[0])
        // history.push('/home')
      }
    }
    useEffect(() => {
      getLocal()
    }, [])
    
    const url = apiConfig.mainurl.url
    const [group, setGroup] = useState([])
    const [index, setIndex] = useState(0)
    const [data, setData] = useState([])
    const [modaldata, setModaldata] = useState([])
    const [show, setShow] = useState(false)
    const [edit, setEdit] = useState(false)
  
    const [countSuperadmin, setCountSuperadmin] = useState(0)
    const [countAdmin, setCountAdmin] = useState(0)
    
    const fetchApi = async () => {
      await axios.get(`${url}/api/admin`).then((res) => {
          setData(res.data.data.message)
          const count1 = res.data.data.message.filter(function(item) {
            if (item.admin_permission === 1) {
                return true
            } else { 
                return false
            }
        })
        const count2 = res.data.data.message.filter(function(item) {
            if (item.admin_permission === 0) {
                return true
            } else {
                return false
            }
        })
        setCountSuperadmin(count2.length)
        setCountAdmin(count1.length)
        })
        const obj = [{ value :0, label: '---- Please Choose ----' }]
        await axios.get(`${url}/api/group`).then((res) => {
            (res.data.data.message).map(res2 => {
                console.log(res2)
                obj.push({ value :res2.group_id, label: res2.group_name })
                // setGroup(...group, { value: res2.group_id, label: res2.group_name })
            })
            
            // setData(res.data.data.message)
            setGroup(obj)
          })
    }
    useEffect(() => {
      fetchApi()
    }, [])

    const detailsFunc = async (data) => {

        // const obj = [{ value :0, label: '---- Please Choose ----' }]
        // await axios.get(`${url}/api/group`).then((res) => {
        //     (res.data.data.message).map(res2 => {
        //         console.log(res2)
        //         obj.push({ value :res2.group_id, label: res2.group_name })
        //         // setGroup(...group, { value: res2.group_id, label: res2.group_name })
        //     })
            
        //     // setData(res.data.data.message)
        //     setGroup(obj)
        //   })

        setIndex(0)
        await group.map((datas, key) => {
            if (datas.value === data.group_id) {
                setIndex(key)
                return 0
            }
        })
        // console.log(data)
        // console.log(`found = `)
        setModaldata(data)
        setShow(true)
        setEdit(false)
    }

    const editFunc = async (data) => {
        setIndex(0)
        await group.map((datas, key) => {
            if (datas.value === data.group_id) {
                setIndex(key)
                return 0
            }
        })
        setModaldata(data)
        setShow(true)
        setEdit(true)
    }
    
    // const dashboardFunc = (data) => {
    //   console.log(data)
    //   history.push(`/device?groupid=${data.group_id}`)
    //   // setModaldata(data)
    //   // setShow(true)
    //   // setEdit(true)
    // }

    
    const deleteFunc = (id) => {
        
      console.log(id)
      if (id.admin_permission === 1) {
          Swal.fire({
            title: 'Are you sure?',
            text: `Confirm Delete '${id.admin_name}'`,
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
              
              console.log("if (result.value) {")
              axios.post(`${url}/api/datalog/admin`, {
                admin_id : admindata.admin_id,
                adminlog_detail : `[DELETE] ${id.admin_username}`
              })
              axios.delete(`${url}/api/admin/${id.admin_id}`).then((res) => {
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
        
      }

      const updateFunc = () => {
        console.log(modaldata)
          Swal.fire({
              title: 'Are you sure?',
              text: `Confirm Update '${modaldata.admin_name}'`,
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
                  adminlog_detail : `[EDIT] ${modaldata.admin_name}`
                })
                axios.put(`${url}/api/admins/${modaldata.admin_id}`, {
                    admin_username: modaldata.admin_username,
                    admin_email: modaldata.admin_email,
                    admin_name: modaldata.admin_name,
                    admin_tel: modaldata.admin_tel,
                    group_id: modaldata.admin_permission === 0 ? 0 : modaldata.group_id,
                    admin_permission: modaldata.admin_permission
                }).then((res) => {
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
                        showConfirmButton: false,
                        timer: 500
                    }).then(() => {
                        setShow(false)
                        setEdit(false)
                        fetchApi()
                      
                    })                                     
                  }
                })              
              }
            })
        }
    
    const resetpasswordFunc = (data) => {
        console.log(data)
        
        Swal.fire({
            title: 'Are you sure?',
            text: `Confirm Reset Password '${data.admin_name}'`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Reset it!',
            customClass: {
              confirmButton: 'btn btn-primary',
              cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
          }).then(function (result) {
            if (result.value) {
              axios.post(`${url}/api/datalog/admin`, {
                admin_id : admindata.admin_id,
                adminlog_detail : `[Reset Password] ${data.admin_name}`
              })
              axios.patch(`${url}/api/admin/${data.admin_id}`, {
                newpassword : "P@ssw0rd"
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
                    console.log(res)
                    Swal.fire({
                        icon: 'success',
                        title: 'Reset Information!',
                        text: `New Password 'P@ssw0rd'`,
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

    const basicColumns = [
      {
        name: 'Actions',
        allowOverflow: true,
        cell: (data) => {
          return (
            <div className='d-flex'>
              <FileText size={15} onClick={() => detailsFunc(data)} style={{cursor:'pointer'}}/>
              <span className='align-middle ms-1'/>
              <Edit size={15} onClick={() => editFunc(data)} style={{cursor:'pointer'}}/>
              <span className='align-middle ms-1'/>
              {data.admin_permission !== 0 ? <Trash size={15} onClick={() => deleteFunc(data)} style={{cursor:'pointer'}}/> : null}
              
            </div>
          )
        }
      },
      {
        name: 'E-Mail',
        sortable: true,
        // minWidth: '50px',
        selector: row => row.admin_email
      },
      {
        name: 'Username',
        sortable: true,
        // minWidth:'50px',
        selector: row => row.admin_username
      },
      {
        name: 'Name',
        sortable: true,
        // minWidth: '50px',
        selector: row => row.admin_name
      },
      {
        name: 'Tel',
        sortable: true,
        // minWidth: '50px',
        selector: row => row.admin_tel
      },
      {
        name: 'Group',
        sortable: true,
        // minWidth: '50px',
        selector: row => row.group_name,
        cell: (row) => {
            return (<Badge color={row.group_name ? 'light-success' : 'light-danger'} pill style={{cursor:'pointer'}}>
              {row.group_name ? row.group_name : row.admin_permission === 0 ? null : 'Null'}
            </Badge>)        
        }  
      },
      {
        name: 'Password',
        sortable: true,
        // minWidth: '50px',
        selector: row => row.admin_permission,
        cell: (row) => {
            return (<Badge color='light-warning' pill style={{cursor:'pointer'}} onClick={() => resetpasswordFunc(row)}>
              Reset Password
            </Badge>)        
        }  
      },
      {
        name: 'Permission',
        sortable: true,
        // minWidth: '50px',
        selector: row => row.admin_permission,
        cell: (row) => {
            return (<Badge color={row.admin_permission === 0 ? 'light-warning' : 'light-success'} pill style={{cursor:'pointer'}}>
              {row.admin_permission === 0 ? 'Super Administrator' : 'Administrator'}
            </Badge>)        
        }  
      }
    ]
    // const countryOptions = [
    //     { value: 'UK', label: 'UK' },
    //     { value: 'USA', label: 'USA' },
    //     { value: 'Spain', label: 'Spain' },
    //     { value: 'France', label: 'France' },
    //     { value: 'Italy', label: 'Italy' },
    //     { value: 'Australia', label: 'Australia' }
    //   ]
    return (
      <div>        
        <Card className='card-statistics'>
          <CardHeader>
            <CardTitle tag='h4'>Device Statistics</CardTitle>
            {/* <CardText className='card-text font-small-2 me-25 mb-0'>Updated 1 month ago</CardText> */}
          </CardHeader>
          <CardBody className='statistics-body'>
            <Row>
              <Col>
                <div className='d-flex align-items-center'>
                  <Avatar color='light-primary' icon={<TrendingUp size={24} />} className='me-2' />
                  <div className='my-auto'>
                    <h4 className='fw-bolder mb-0'>{countSuperadmin}</h4>
                    <CardText className='font-small-3 mb-0'>Super Administrator</CardText>
                  </div>
                </div>
              </Col>
              <Col>
                <div className='d-flex align-items-center'>
                  <Avatar color='light-primary' icon={<TrendingUp size={24} />} className='me-2' />
                  <div className='my-auto'>
                    <h4 className='fw-bolder mb-0'>{countAdmin}</h4>
                    <CardText className='font-small-3 mb-0'>Administrator</CardText>
                  </div>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Button color="primary" onClick={() => history.push('/admin-add')}>+ Add Administrator</Button>
        <span className='align-middle ms-1'/>
        <Button color="warning" onClick={() => fetchApi()}>Refresh</Button>
        <span className='align-middle ms-1'/>
        <Button color="danger" onClick={() => console.log(group)}>Group</Button>
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
              <h1 className='mb-1'>Administrator Information</h1>
              {/* <p>Updating user details will receive a privacy audit.</p> */}
            </div>
            <Row tag='form' className='gy-1 pt-75'>
              <Col md={12} xs={12}>
                <Label className='form-label' for='Name'>
                  Username
                </Label>
                <Input type='text' placeholder='Name' defaultValue={modaldata.admin_username} value={modaldata.admin_username} onChange={(e) => setModaldata({...modaldata, admin_username:e.target.value})} disabled/>
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='Detail'>
                  Name
                </Label>
                <Input type='text' placeholder='Detail' defaultValue={modaldata.admin_name} value={modaldata.admin_name} onChange={(e) => setModaldata({...modaldata, admin_name:e.target.value})} disabled={!edit}/>
              </Col>
              
              <Col md={6} xs={12}>
                <Label className='form-label' for='Location'>
                  E-Mail
                </Label>
                <Input type='text' placeholder='Location' defaultValue={modaldata.admin_email} value={modaldata.admin_email} onChange={(e) => setModaldata({...modaldata, admin_email:e.target.value})} disabled={!edit}/>
              </Col><Col md={6} xs={12}>
                <Label className='form-label' for='Token'>
                  Tel
                </Label>
                <Input type='text' placeholder='Token' defaultValue={modaldata.admin_tel} value={modaldata.admin_tel} onChange={(e) => setModaldata({...modaldata, admin_tel:e.target.value})} disabled={!edit}/>
                {/* <Input type='text' placeholder='Token' defaultValue={modaldata.group_token} value={modaldata.group_token} onChange={(e) => setModaldata({...modaldata, group_token:e.target.value})} disabled={!edit}/> */}
              </Col>
              {modaldata.admin_permission === 0 ? <Col md={6} xs={12}>
                <Label className='form-label' for='Password'>
                Permission
                </Label>
                <Input type='text' placeholder='Password' defaultValue='Super Adminstrator' disabled/>
                {/* <Input type='text' placeholder='Password' defaultValue={modaldata.admin_permission} value={modaldata.admin_permission} onChange={(e) => setModaldata({...modaldata, admin_permission:e.target.value})} disabled/> */}
                </Col> : <Col md={6} xs={12}>
                <Label className='form-label' for='Password'>
                Permission
                </Label>
                <Input type='text' placeholder='Password' defaultValue='Adminstrator' disabled/>
                {/* <Input type='text' placeholder='Password' defaultValue={modaldata.admin_permission} value={modaldata.admin_permission} onChange={(e) => setModaldata({...modaldata, admin_permission:e.target.value})} disabled/> */}
            </Col>}
            {/* {modaldata.admin_permission === 1 ? <Col md={12} xs={12}>
                <Label className='form-label' for='Ads'>
                  Group
                </Label>
                <Input type='text' placeholder='Ads' defaultValue={modaldata.group_name} value={modaldata.group_name} onChange={(e) => setModaldata({...modaldata, group_name:e.target.value})} disabled={!edit}/>
              </Col> : null} */}
            {modaldata.admin_permission !== 0 ? <Col md='6' className='mb-1'>
                <Label className='form-label'>
                Group
                </Label>
                <Select
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    options={group}
                    defaultValue={group[index]}
                    isDisabled={!edit}
                    onChange={(value) => setModaldata({...modaldata, group_id: value.value})} 
                />
            </Col> : null}
            
              
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
  
  export default Admin
  