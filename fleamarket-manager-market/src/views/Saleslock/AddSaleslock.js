// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
// ** Third Party Components
import Select from 'react-select'
import Cleave from 'cleave.js/react'
import { Controller } from 'react-hook-form'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useHistory } from "react-router-dom"
import apiConfig from '../../configs/apiConfig'
import DataTable from 'react-data-table-component'
// import DataTable, { createTheme } from 'react-data-table-component'
import Swal from "sweetalert2"
// import { selectThemeColors } from '@utils'
import { Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback, FormGroup } from 'reactstrap'

import { MoreVertical, Edit, User, Check, X, DownloadCloud, FileText, Archive, Trash, ChevronDown, Delete, TrendingUp, Box, DollarSign } from 'react-feather'


const AddSalelock = () => {
    const history = useHistory()
    // const params = new URLSearchParams(history.location.search)
    // if (!params.get('storeid')) {
    //     history.push('/store')
    // }


    const url = apiConfig.mainurl.url
    console.log(url)
    //   const [data, setData] = useState([])
    //   useEffect(() => {
    //     console.log(data)
    //   }, [data])

    const [datainput, setDatainput] = useState({ lockName: "", market_id: "", status: "BLANK", month: "", price: 0 })


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
            //   setUserdata(JSON.parse(authStorage))

            // setUserdata2(JSON.parse(authStorage).user)  
            // axios.get(`${url}/api/users?id=${JSON.parse(authStorage).user.id}`).then(res => setUserdata2(res.data.data[0]))
            //   fetchApi(JSON.parse(authStorage))
            console.log(JSON.parse(authStorage).user)

            setDatainput({ ...datainput, market_id: JSON.parse(authStorage).user.market_id })

        }
    }

    useEffect(() => {
        getLocal()
        const d = new Date()
        const months = (d.getMonth() + 1).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
        const years = d.getFullYear()
        const monthyear = `${months}-${years}`
        // setDatainput({ ...datainput, month: monthyear })
        setDatainput({ ...datainput, market_id: JSON.parse(localStorage.getItem("auth")).user.market_id, month: monthyear })
    }, [])


    const submitForm = async () => {

        const authStorage = localStorage.getItem("auth")
        console.log(JSON.parse(authStorage))
        console.log(datainput)
        console.log(`Bearer ${JSON.parse(localStorage.getItem("auth")).token}`)
        if (datainput.lockName.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                showConfirmButton: false,
                timer: 1000
            })
            return 0
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
        axios.post(`${url}/api/saleslock`, {
            lockName: datainput.lockName,
            market_id: JSON.parse(authStorage).user.market_id,
            status: "BLANK",
            month: datainput.month,
            price: `${datainput.price}`
        }).then(datas => {
            console.log(datas.data)
            if (datas.data.code === 200) {
                Swal.fire({
                    title: `เพิ่มล็อคขายของสำเร็จ`,
                    icon: 'success',
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                })
                history.push("/saleslock")
            } else {
                Swal.fire({
                    title: `เพิ่มล็อคขายของไม่สำเร็จ`,
                    icon: 'error',
                    customClass: {
                        confirmButton: 'btn btn-danger'
                    }
                })
            }
        })
    }

    return (
        <Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>เพิ่มล็อคขายของ</CardTitle>
                    {/* <Button tag={Label} color="warning" onClick={() => fetchApi(userdata)}>รีเฟรช</Button> */}
                </CardHeader>
                <CardBody className='py-2 my-25'>
                    <Form className='mt-2 pt-50'>
                        {/* <Form className='mt-2 pt-50' onSubmit={submitForm}> */}
                        <Row>
                            <Col sm='6' className='mb-1'>
                                <Label className='form-label' for='company'>
                                    ชื่อล็อคขายของ
                                </Label>
                                <Input id='company' name='company' placeholder='ชื่อล็อคขายของ' type='text'
                                    onChange={(e) => {
                                        setDatainput({ ...datainput, lockName: e.target.value })
                                        // setEmailready(true)
                                    }}
                                    value={datainput.lockName}

                                />
                            </Col>
                            <Col sm='6' className='mb-1'>
                                <Label className='form-label' for='phNumber'>
                                    ราคาต่อเดือน
                                </Label>
                                <Input id='company' name='company' placeholder='ราคาต่อเดือน' type='number'
                                    onChange={(e) => setDatainput({ ...datainput, price: e.target.value })}
                                    value={datainput.price}

                                />
                            </Col>

                            <Col className='mt-2' sm='12'>
                                <Button className='me-1' color='primary' onClick={submitForm}>
                                    บันทึก
                                </Button>
                                <Button color='warning' onClick={() => history.push("/saleslock")}>
                                    {/* <Button color='warning' onClick={() => fetchApi(userdata)}> */}
                                    ยกเลิก
                                </Button>
                                {/* <Button color='warning' onClick={() => {
                                    const authStorage = localStorage.getItem("auth")
                                    console.log(JSON.parse(authStorage))
                                }}>
                                    ดูข้อมูล
                                </Button>
                                <Button color='warning' onClick={() => console.log(datainput)}>
                                    ดูข้อมูล 2
                                </Button> */}
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
        </Fragment >
    )
}

export default AddSalelock
