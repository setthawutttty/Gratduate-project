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
const AccountTabContent = () => {
  const history = useHistory()
  console.log(history)
  const [admindata, setAdmindata] = useState([])
  
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
      setAdmindata(JSON.parse(authStorage))
      // history.push('/home')
    }
  }

  useEffect(() => {
    getLocal()
  }, [])

  // const [oldpasswordtext, setoldpasswordtext] = useState("")
  const [newpasswordtext1, setnewpasswordtext1] = useState("")
  const [newpasswordtext2, setnewpasswordtext2] = useState("")
  const url = apiConfig.mainurl.url
  console.log(url)
  
  const onclickSubmitPassword = () => {
    console.log(admindata.user.email)
    // console.log(`onclickSubmitPassword`)
    // // console.log(`oldpasswordtext = ${oldpasswordtext}`)
    // console.log(`newpasswordtext1 = ${newpasswordtext1}`)
    // console.log(`newpasswordtext2 = ${newpasswordtext2}`)
    if (newpasswordtext1.length >= 8 && newpasswordtext2.length >= 8) {
      if (newpasswordtext1 === newpasswordtext2) {
        axios.post(`${url}/api/auth/changepassword`, {
          email : `${admindata.user.email}`,
          newpassword : newpasswordtext1
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
              setnewpasswordtext1("")
              setnewpasswordtext2("")
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Password change successfully',
                showConfirmButton: false,
                timer: 1500
              }).then(function (result) {
                  if (result.value) {
                  // window.location.reload(false)
                  fetchApi()
                  }
              })                                     
          }
        }) // end axios

        // Swal.fire({
        //   position: 'center',
        //   icon: 'success',
        //   title: 'Password change successfully',
        //   showConfirmButton: false,
        //   timer: 1500
        // })
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Passwords do not match',
          showConfirmButton: false,
          timer: 1500
        })
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Password must be longer than 8 characters.',
        showConfirmButton: false,
        timer: 1500
      })
    }
    

    // axios.patch(`${url}/api/admin/${data.admin_id}`, {
    //   newpassword : "P@ssw0rd"
    // }).then((res) => {
    //   if (res.data.data.err) {
    //     Swal.fire({
    //       title: 'Error',
    //       icon: 'error',
    //       customClass: {
    //       confirmButton: 'btn btn-danger'
    //     }
    //   })
    //   return 0
    //   } else {
    //       console.log(res)
    //       Swal.fire({
    //           icon: 'success',
    //           title: 'Reset Information!',
    //           text: `New Password 'P@ssw0rd'`,
    //           customClass: {
    //           confirmButton: 'btn btn-success'
    //           }
    //       }).then(function (result) {
    //           if (result.value) {
    //           // window.location.reload(false)
    //           fetchApi()
    //           }
    //       })                                     
    //   }
    // })
  }
  
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Change Password</CardTitle>
        </CardHeader>
        <CardBody>
          <Form className="form">
            <Row>
              {/* <Col sm="6" className="mb-2">
                <Label className="form-label" for="group-location">
                Old Password
                </Label>
                <Input type='password' placeholder='Please enter your Old Password' value={oldpasswordtext} onChange={(e) => { setoldpasswordtext(e.target.value) }}/>
              </Col> */}
              <Col sm="6" className="mb-2">
                <Label className="form-label" for="group-details">
                  New Password
                </Label>
                <Input type='password' placeholder='Please enter your New Password' value={newpasswordtext1} onChange={(e) => { setnewpasswordtext1(e.target.value) }}/>
              </Col>
              <Col sm="6" className="mb-2">
                <Label className="form-label" for="group-details">
                  Repeat New Password
                </Label>
                <Input type='password' placeholder='Please enter your Repeat New Password' value={newpasswordtext2} onChange={(e) => { setnewpasswordtext2(e.target.value) }}/>
              </Col>
              <Col className="d-grid" sm="12">
                <Button color="primary" onClick={onclickSubmitPassword}>
                  Save Change
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </div>
  )
}

export default AccountTabContent
