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

import Swal from "sweetalert2"
import Cleave from "cleave.js/react"
import { useState, useEffect } from "react"
import axios from 'axios'
import { useHistory } from "react-router-dom"
import apiConfig from '../../configs/apiConfig'
// import apiConfig from '../../configs/apiConfig'
const Groupadd = () => {
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
  // const nametext = useRef("")
  // const locationtext = useRef("")
  // const detailstext = useRef("")
  const [nametext, setnametext] = useState("")
  const [locationtext, setlocationtext] = useState("")
  const [detailstext, setdetailstext] = useState("")

  const url = apiConfig.mainurl.url
  const onclickSubmit = () => {
      if (!nametext || !locationtext || !detailstext) {
        // if (!nametext.current.state.value || !locationtext.current.state.value || !detailstext.current.state.value) {
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
                axios.post(`${url}/api/datalog/admin`, {
                  admin_id : admindata.admin_id,
                  adminlog_detail : `[Add Grooup] ${nametext}`
                })
                axios.post(`${url}/api/user/group`, {
                    // group_name : nametext.current.state.value,
                    // group_location : locationtext.current.state.value,
                    // group_detail : detailstext.current.state.value
                    group_name : nametext,
                    group_location : locationtext,
                    group_detail : detailstext
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
                        Swal.fire({
                            icon: 'success',
                            title: 'Add Information!',
                            text: 'Successfully Added.',
                            customClass: {
                                confirmButton: 'btn btn-success'
                                }
                        }).then(function (result) {
                            if (result.value) {
                                window.location.reload(false)
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
          <CardTitle tag="h4">Add Group</CardTitle>
          {/* <CardTitle className="text-primary" tag="h4">
              $455.60
          </CardTitle> */}
        </CardHeader>
        <CardBody>
          <Form className="form">
            <Row>
              <Col sm="12" className="mb-2">
                <Label className="form-label" for="group-name">
                  Name
                </Label>
                {/* <Cleave
                  className="form-control"
                  placeholder="Please enter your name"
                  id="group-name"
                  options={{creditCard: false}}
                  ref={nametext}
                /> */}
                <Input type='text' placeholder='Please enter your name' value={nametext} onChange={(e) => { setnametext(e.target.value) }}/>
              </Col>
              <Col sm="6" className="mb-2">
                <Label className="form-label" for="group-location">
                  Location
                </Label>
                {/* <Cleave
                  className="form-control"
                  placeholder="Please enter your location"
                  id="group-location"
                  ref={locationtext}
                /> */}
                <Input type='text' placeholder='Please enter your location' value={locationtext} onChange={(e) => { setlocationtext(e.target.value) }}/>
              </Col>
              <Col sm="6" className="mb-2">
                <Label className="form-label" for="group-details">
                  Details
                </Label>
                {/* <Cleave
                  className="form-control"
                  placeholder="Please enter your details"
                  id="group-details"
                  ref={detailstext}
                /> */}
                <Input type='text' placeholder='Please enter your details' value={detailstext} onChange={(e) => { setdetailstext(e.target.value) }}/>
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

export default Groupadd
