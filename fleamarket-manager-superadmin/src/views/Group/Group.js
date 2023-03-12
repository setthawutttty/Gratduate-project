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
  import FileUploaderSingle from './FileUploaderSingle'
  import { Controller } from 'react-hook-form'
  import { useDropzone } from 'react-dropzone'
  import Avatar from '@components/avatar'
  import Select from 'react-select'
  import { MoreVertical, Edit, User, Check, X, DownloadCloud, FileText, Archive, Trash, ChevronDown, Delete, TrendingUp, Box, DollarSign } from 'react-feather'
  import axios from 'axios'
  import {useEffect, useState, Fragment} from 'react'
  import { useHistory } from "react-router-dom"
  import Swal from "sweetalert2"
  import DataTable from 'react-data-table-component'
  import Cleave from 'cleave.js/react'
  import apiConfig from '../../configs/apiConfig'

  const Group = () => {
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
    const [data, setData] = useState([])
    const [modaldata, setModaldata] = useState([])
    const [show, setShow] = useState(false)
    const [edit, setEdit] = useState(false)
  
    const fetchApi = () => {
      axios.get(`${url}/api/group`).then((res) => setData(res.data.data.message))
    }
    useEffect(() => {
      fetchApi()
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
    
    const dashboardFunc = (data) => {
      console.log(data)
      history.push(`/device?groupid=${data.group_id}`)
      // setModaldata(data)
      // setShow(true)
      // setEdit(true)
    }

    
    const deleteFunc = (id) => {
      console.log(id)
        Swal.fire({
            title: 'Are you sure?',
            text: `Confirm Delete '${id.group_name}'`,
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
                adminlog_detail : `[DELETE] ${id.group_name}`
              })
              axios.delete(`${url}/api/group/${id.group_id}`).then((res) => {
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
    const basicColumns = [
      {
        name: 'Actions',
        allowOverflow: true,
        cell: (data) => {
          return (
            <div className='d-flex'>
              <Box size={15} onClick={() => dashboardFunc(data)} style={{cursor:'pointer'}}/>
              <span className='align-middle ms-1'/>
              <FileText size={15} onClick={() => detailsFunc(data)} style={{cursor:'pointer'}}/>
              <span className='align-middle ms-1'/>
              <Edit size={15} onClick={() => editFunc(data)} style={{cursor:'pointer'}}/>
              <span className='align-middle ms-1'/>
              <Trash size={15} onClick={() => deleteFunc(data)} style={{cursor:'pointer'}}/>
            </div>
          )
        }
      },
      {
        name: 'Name',
        sortable: true,
        // minWidth:'50px',
        selector: row => row.group_name
      },
      {
        name: 'Location',
        sortable: true,
        // minWidth: '50px',
        selector: row => row.group_location
      },
      {
        name: 'Detail',
        sortable: true,
        // minWidth: '50px',
        selector: row => row.group_detail
      },
      {
        name: 'Token',
        sortable: true,
        // minWidth: '50px',
        selector: row => row.group_token
      },
      {
        name: 'Password',
        sortable: true,
        // minWidth: '50px',
        selector: row => row.group_password
      },
      {
        name: 'Ads',
        sortable: true,
        // minWidth: '50px',
        selector: row => row.group_ads
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
      console.log(`${url}/upload-video/upload-video/${modaldata.group_id}`)
      // axios.post(`${url}/upload-video/upload-video/3/${modaldata.group_id}`)
      await axios({
        method: "post",
        url: `${url}/upload-video/upload-video/${modaldata.group_id}`,
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
          setModaldata({...modaldata, group_ads:response.data.data.url})
          // console.log(response.data.data.url)
          fetchApi()
        })
        .catch(function (response) {
          //handle error
          console.log("err upload video ......")
          console.log(response)
        })
    }

    // const testalert = async () =>  {
    //   let timerInterval
    //   Swal.fire({
    //     title: 'Auto close alert!',
    //     // html: 'I will close in <b></b> seconds.',
    //     // html: 'I will close in <b></b> seconds.',
    //     timer: 10000,
    //     timerProgressBar: false,
    //     didOpen: () => {
    //       Swal.showLoading()
    //       // const b = Swal.getHtmlContainer().querySelector('b')
    //       timerInterval = setInterval(() => {
    //         // b.textContent = Swal.getTimerLeft()
    //       }, 1000)
    //     },
    //     willClose: () => {
    //       clearInterval(timerInterval)
    //     }
    //   }).then((result) => {
    //     /* Read more about handling dismissals below */
    //     if (result.dismiss === Swal.DismissReason.timer) {
    //       console.log('I was closed by the timer')
    //     }
    //   })
    // }

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
                    <h4 className='fw-bolder mb-0'>{data.length}</h4>
                    <CardText className='font-small-3 mb-0'>Group</CardText>
                  </div>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Button color="primary" onClick={() => history.push('/group-add')}>+ Add Group</Button>
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
              <h1 className='mb-1'>Group Information</h1>
              {/* <p>Updating user details will receive a privacy audit.</p> */}
            </div>
            <Row tag='form' className='gy-1 pt-75'>
              <Col md={12} xs={12}>
                <Label className='form-label' for='Name'>
                  Name
                </Label>
                <Input type='text' placeholder='Name' defaultValue={modaldata.group_name} value={modaldata.group_name} onChange={(e) => setModaldata({...modaldata, group_name:e.target.value})} disabled={!edit}/>
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='Location'>
                  Location
                </Label>
                <Input type='text' placeholder='Location' defaultValue={modaldata.group_location} value={modaldata.group_location} onChange={(e) => setModaldata({...modaldata, group_location:e.target.value})} disabled={!edit}/>
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='Detail'>
                  Detail
                </Label>
                <Input type='text' placeholder='Detail' defaultValue={modaldata.group_detail} value={modaldata.group_detail} onChange={(e) => setModaldata({...modaldata, group_detail:e.target.value})} disabled={!edit}/>
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='Token'>
                  Token
                </Label>
                <Input type='text' placeholder='Token' defaultValue={modaldata.group_token} value={modaldata.group_token} onChange={(e) => setModaldata({...modaldata, group_token:e.target.value})} disabled/>
                {/* <Input type='text' placeholder='Token' defaultValue={modaldata.group_token} value={modaldata.group_token} onChange={(e) => setModaldata({...modaldata, group_token:e.target.value})} disabled={!edit}/> */}
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='Password'>
                  Password
                </Label>
                <Input type='text' placeholder='Password' defaultValue={modaldata.group_password} value={modaldata.group_password} onChange={(e) => setModaldata({...modaldata, group_password:e.target.value})} disabled/>
                {/* <Input type='text' placeholder='Password' defaultValue={modaldata.group_password} value={modaldata.group_password} onChange={(e) => setModaldata({...modaldata, group_password:e.target.value})} disabled={!edit}/> */}
              </Col>
              <Col md={12} xs={12}>
                <Label className='form-label' for='Ads'>
                  Ads
                </Label>
                <Input type='text' placeholder='Ads' defaultValue={modaldata.group_ads} value={modaldata.group_ads} onChange={(e) => setModaldata({...modaldata, group_ads:e.target.value})} disabled={!edit}/>
              </Col>
              <Col md={12} xs={12}>
              {edit ? ( 
                <Label className='form-label' for='Ads'>
                  Ads Video
                </Label>
              ) : null }
              {edit ? ( 
                <Card>
                  <CardBody >
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
      </div>
    )
  }
  
  export default Group
  