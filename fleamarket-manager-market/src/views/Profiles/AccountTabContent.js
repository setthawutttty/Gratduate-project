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
import { useState, useEffect } from "react"
import axios from 'axios'
import { useHistory } from "react-router-dom"
import apiConfig from '../../configs/apiConfig'

const AccountTabContent = () => {
  const history = useHistory()
  const [userdata, setUserdata] = useState([])

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
    }
  }
  useEffect(() => {
    getLocal()
  }, [])

  const [newpasswordtext1, setnewpasswordtext1] = useState("")
  const [newpasswordtext2, setnewpasswordtext2] = useState("")
  const url = apiConfig.mainurl.url
  console.log(url)

  const onclickSubmitPassword = () => {
    console.log(`onclickSubmitPassword`)
    console.log(`newpasswordtext1 = ${newpasswordtext1}`)
    console.log(`newpasswordtext2 = ${newpasswordtext2}`)
    if (newpasswordtext1.length >= 8 && newpasswordtext2.length >= 8) {
      if (newpasswordtext1 === newpasswordtext2) {
        axios.post(`${url}/api/auth/changepassword`, {
          email: `${userdata.user.email}`,
          newpassword: `${newpasswordtext1}`
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
              title: 'เปลี่ยนรหัสผ่านสำเร็จ',
              showConfirmButton: false,
              timer: 1500
            }).then(function (result) {
              if (result.value) {
                fetchApi()
              }
            })
          }
        }) // end axios
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'รหัสผ่านไม่ตรงกัน',
          showConfirmButton: false,
          timer: 1500
        })
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'รหัสผ่านต้องมีความยาวมากกว่า 8 ตัวอักษร',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">เปลี่ยนรหัสผ่าน</CardTitle>
        </CardHeader>
        <CardBody>
          <Form className="form">
            <Row>
              <Col sm="6" className="mb-2">
                <Label className="form-label" for="group-details">
                  รหัสผ่านใหม่
                </Label>
                <Input type='password' placeholder='กรุณากรอกรหัสผ่าน' value={newpasswordtext1} onChange={(e) => { setnewpasswordtext1(e.target.value) }} />
              </Col>
              <Col sm="6" className="mb-2">
                <Label className="form-label" for="group-details">
                  ยืนยันรหัสผ่านใหม่
                </Label>
                <Input type='password' placeholder='กรุณากรอกยืนยันรหัสผ่าน' value={newpasswordtext2} onChange={(e) => { setnewpasswordtext2(e.target.value) }} />
              </Col>

              <Col xs={12}>
                <p className='fw-bolder'>ข้อกำหนดรหัสผ่าน</p>
                <ul className='ps-1 ms-25'>
                  <li className='mb-50'>ความยาวขั้นต่ำ 8 ตัวอักษร ยิ่งมากยิ่งดี</li>
                  <li className='mb-50'>อักขระตัวพิมพ์เล็กอย่างน้อยหนึ่งตัว</li>
                  <li>อักขระตัวเลข สัญลักษณ์ หรือช่องว่างอย่างน้อยหนึ่งตัว</li>
                </ul>
              </Col>
              <Col className="d-grid" sm="12">
                <Button color="primary" onClick={onclickSubmitPassword}>
                  บันทึก
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
