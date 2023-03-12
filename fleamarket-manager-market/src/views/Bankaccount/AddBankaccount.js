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


const AddStore = () => {
  const history = useHistory()

  const url = apiConfig.mainurl.url
  console.log(url)

  const [datainput, setDatainput] = useState({ market_id: "", bankName: "", bankAccountNo: "", bankAccount: "" })
  const fetchApi = async (datauser) => {

    console.log(`${url}/api/users?id=${datauser.user.id}`)
    axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`

    await axios.get(`${url}/api/store/type`).then(async (res) => {
      if (res.data.status) {
        const datas = []
        await (res.data.data).map(data => {
          datas.push({ value: data.id, label: data.name })
        })
      }
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
      fetchApi(JSON.parse(authStorage))
      console.log(JSON.parse(authStorage).user)

      setDatainput({ ...datainput, market_id: JSON.parse(authStorage).user.market_id })

    }
  }

  useEffect(() => {
    getLocal()
  }, [])

  const submitForm = async () => {
    console.log(datainput)
    console.log(`Bearer ${JSON.parse(localStorage.getItem("auth")).token}`)
    if (datainput.bankName.length === 0 ||
      datainput.bankAccountNo.length === 0 ||
      datainput.bankAccount.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        showConfirmButton: false,
        timer: 1000
      })
      return 0
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
    axios.post(`${url}/api/bankaccount`, {
      market_id: datainput.market_id,
      bankName: datainput.bankName,
      bankAccountNo: datainput.bankAccountNo,
      bankAccount: datainput.bankAccount
    }).then(datas => {
      console.log(datas.data)
      if (datas.data.code === 200) {
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: 'สำเร็จ',
          showConfirmButton: false,
          timer: 500
        })
        history.push("/bankaccount")
      } else {
        Swal.fire({
          icon: 'error',
          title: 'ไม่สำเร็จ',
          text: 'ไม่สำเร็จ',
          showConfirmButton: false,
          timer: 500
        })
      }
    })
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>เพิ่มร้านค้า</CardTitle>
        </CardHeader>
        <CardBody className='py-2 my-25'>
          <Form className='mt-2 pt-50'>
            <Row>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='company'>
                  ชื่อธนาคาร
                </Label>
                <Input id='company' name='company' placeholder='ชื่อธนาคาร'
                  onChange={(e) => {
                    setDatainput({ ...datainput, bankName: e.target.value })
                  }}
                  value={datainput.bankName}
                />
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='phNumber'>
                  ชื่อบัญชี
                </Label>
                <Input id='company' name='company' placeholder='ชื่อบัญชี'
                  onChange={(e) => setDatainput({ ...datainput, bankAccount: e.target.value })}
                  value={datainput.bankAccount}
                />
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='phNumber'>
                  หมายเลขบัญชี
                </Label>
                <Input id='company' name='company' placeholder='หมายเลขบัญชี'
                  onChange={(e) => setDatainput({ ...datainput, bankAccountNo: e.target.value })}
                  value={datainput.bankAccountNo}
                />
              </Col>

              <Col className='mt-2' sm='12'>
                <Button className='me-1' color='primary' onClick={submitForm}>
                  บันทึก
                </Button>
                <Button color='warning' onClick={() => history.push("/bankaccount")}>
                  ยกเลิก
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default AddStore
