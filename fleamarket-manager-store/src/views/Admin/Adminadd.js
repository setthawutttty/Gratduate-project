// import { Card, CardHeader, CardBody, CardTitle, CardText, CardLink } from 'reactstrap'
import {
    Card,
    CardHeader,
    CardTitle,
    CardText,
    CardLink,
    CardBody,
    Form,
    Label,
    Input,
    Button,
    Row,
    Col
  } from "reactstrap"
  
  import Select from 'react-select'
  import Swal from "sweetalert2"
  import Cleave from "cleave.js/react"
  import { useState, useEffect } from "react"
  import axios from 'axios'
  import { useHistory } from "react-router-dom"
  import apiConfig from '../../configs/apiConfig'
  
//   import apiConfig from '../../configs/apiConfig'
  const Adminadd = () => {
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
    
    const [usernametext, setUsernametext] = useState("")
    const [passwordtext, setPasswordtext] = useState("")
    const [nametext, setNametext] = useState("")
    const [emailtext, setEmailtext] = useState("")
    const [teltext, setTeltext] = useState("")
    const [groupid, setGroupid] = useState("")
    
    const [group, setGroup] = useState([])

    const url = apiConfig.mainurl.url
    const fetchApi = async () => {
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
    const onclickSubmit = () => {
        if (!usernametext || !passwordtext || !nametext || !emailtext || !teltext) {
          Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Your work has been saved',
              showConfirmButton: false,
              timer: 1500
            })
        } else {
          Swal.fire({
              title: 'Are you sure?',
              text: "Confirm Adding",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, add it!',
              customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ms-1'
              },
              buttonsStyling: false
            }).then(function (result) {
              if (result.value) {
                  axios.post(`${url}/api/admin`, {
                    admin_username : usernametext,
                    admin_email : emailtext,
                    admin_password : passwordtext,
                    admin_name : nametext,
                    admin_tel : teltext,
                    group_id : groupid,
                    admin_permission : 1
                  }).then(res => {
                      console.log(res.data.data)
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
                        
                          axios.post(`${url}/api/datalog/admin`, {
                            admin_id : admindata.admin_id,
                            adminlog_detail : `[Add User] ${nametext}`
                          })
                          Swal.fire({
                              icon: 'success',
                              title: 'Add Information!',
                              text: 'Successfully Added.',
                              customClass: {
                                  confirmButton: 'btn btn-success'
                                  }
                          }).then(function (result) {
                              if (result.value) {
                                //   window.location.reload(false)
                                history.push('/admin')
                              }
                          })                                     
                      }
                  })                
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                  Swal.fire({
                  title: 'Cancelled',
                  icon: 'error',
                  customClass: {
                      confirmButton: 'btn btn-success'
                      }
                  })
              }
            })
        }
      
      // console.log(`nametext = ${nametext.current.state.value}`)
      // console.log(`locationtext = ${locationtext.current.state.value}`)
      // console.log(`detailstext = ${detailstext.current.state.value}`)
    }
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle tag="h4">Add Administrator</CardTitle>
            {/* <CardTitle className="text-primary" tag="h4">
                $455.60
            </CardTitle> */}
          </CardHeader>
          <CardBody>
            <Form className="form">
              <Row>
              {/* 
                const [usernametext, setUsernametext] = useState("")
                const [passwordtext, setPasswordtext] = useState("")
                const [nametext, setNametext] = useState("")
                const [emailtext, setEmailtext] = useState("")
                const [teltext, setTeltext] = useState("")
                const [groupid, setGroupid] = useState("")
               */}
                <Col sm="6" className="mb-2">
                  <Label className="form-label" for="group-location">
                    Username
                  </Label>
                  <Input type='text' placeholder='Please enter your location' value={usernametext} onChange={(e) => { setUsernametext(e.target.value) }}/>
                </Col>
                <Col sm="6" className="mb-2">
                  <Label className="form-label" for="group-details">
                    Password
                  </Label>
                  <Input type='password' placeholder='Please enter your details' value={passwordtext} onChange={(e) => { setPasswordtext(e.target.value) }}/>
                </Col>
                <Col sm="6" className="mb-2">
                  <Label className="form-label" for="group-name">
                    Name
                  </Label>
                  <Input type='text' placeholder='Please enter your name' value={nametext} onChange={(e) => { setNametext(e.target.value) }}/>
                </Col>
                <Col sm="6" className="mb-2">
                  <Label className="form-label" for="group-details">
                    E-Mail
                  </Label>
                  <Input type='text' placeholder='Please enter your details' value={emailtext} onChange={(e) => { setEmailtext(e.target.value) }}/>
                </Col>
                <Col sm="6" className="mb-2">
                  <Label className="form-label" for="group-details">
                    Tel
                  </Label>
                  <Input type='text' placeholder='Please enter your details' value={teltext} onChange={(e) => { setTeltext(e.target.value) }}/>
                </Col>
                <Col md='6' className='mb-1'>
                    <Label className='form-label'>
                    Group
                    </Label>
                    <Select
                        isClearable={false}
                        className='react-select'
                        classNamePrefix='select'
                        options={group}
                        defaultValue={group[0]}
                        // isDisabled={!edit}
                        onChange={(value) => setGroupid(value.value)} 
                    />
                </Col>
                <Col className="d-grid" sm="12">
                  <Button color="primary" onClick={onclickSubmit}>
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    )
  }
  
  export default Adminadd
  