import { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import Select from 'react-select'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useHistory } from "react-router-dom"
import apiConfig from '../../configs/apiConfig'
import DataTable from 'react-data-table-component'
import Swal from "sweetalert2"
import Avatar from '@components/avatar'

import { Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback, CardText } from 'reactstrap'
import { MoreVertical, Edit, User, Check, X, DownloadCloud, FileText, Archive, Trash, ChevronDown, Delete, TrendingUp, Box, DollarSign, Grid } from 'react-feather'
import { selectThemeColors } from '@utils'

const Saleslock = () => {
    const history = useHistory()

    const url = apiConfig.mainurl.url
    const [data, setData] = useState([])
    // const [datatable, setDatatable] = useState([])
    // const [storeid, setStoreid] = useState([])
    const [isLoading, setisLoading] = useState(true)
    const [imgold, setimgold] = useState(true)
    // const [userdata, setUserdata] = useState([])
    const [storetype, setStoreType] = useState([])
    const [bankaccount, setBankaccount] = useState([])
    // const [saleslock, setSaleslock] = useState([])

    const fetchApi = async () => {
        const authStorage = localStorage.getItem("auth")
        // // console.log(`${url}/api/store?id=${JSON.parse(authStorage).user.store_id}`)
        // console.log(`Bearer ${userdata.token}`)
        let market_ids = 0
        await axios.get(`${url}/api/store?id=${JSON.parse(authStorage).user.store_id}`).then((res) => {
            setData(res.data.data[0])
            // console.log(`res.data.data[0]`)
            // console.log(res.data.data[0])
            market_ids = res.data.data[0].marketId
            // setDatatable([])
        })

        await axios.get(`${url}/api/bankaccount?market_id=${market_ids}`).then((res) => {
            setBankaccount(res.data.data)
        })
        // await axios.get(`${url}/api/store/listimage?store_id=${JSON.parse(authStorage).user.store_id}`).then((res) => {
        //     // setDatatable(res.data.data)
        //     // console.log(res.data.data)
        // })

        axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
        // // console.log(`Bearer ${JSON.parse(localStorage.getItem("auth"))}`)
        // console.log(`market_ids = ${market_ids}`)
        await axios.get(`${url}/api/saleslock?market_id=${market_ids}`).then(async (res) => {
            // console.log(res.data)
            if (res.data.status) {
                const datas = []
                await (res.data.data).map(data => {
                    if (data.status === 'BLANK') datas.push({ value: data.id, label: `${data.lockName} ราคา ${data.price} บาทต่อเดือน` })
                })
                setStoreType(datas)

                setisLoading(false)
            } else {
                localStorage.clear()
                history.push('/login')
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
            // // console.log(JSON.parse(authStorage))
            // setUserdata(JSON.parse(authStorage))
            // setStoreid(JSON.parse(authStorage).user.store_id)
            fetchApi()
        }
    }


    const [avatar, setAvatar] = useState('')
    const [avatar2, setAvatar2] = useState('')
    const [avatar3, setAvatar3] = useState('')

    useEffect(() => {
        getLocal()
        // setIsUploadding(false)
    }, [])

    useEffect(() => {
        try {
            setAvatar(data.saleslockSlipImg)
        } catch {
            history.push("/")
        }
    }, [data])

    const defaultValuestoreType = () => {
        return ({ value: 0, label: 'กรุณาเลือกล็อคขายของ' })
        // return ({ value: data.storetypeId, label: data.storetype })
    }

    const onChange = e => {
        try {
            setAvatar3(e.target.files)
            const reader = new FileReader(),
                files = e.target.files
            reader.onload = function () {
                setAvatar(reader.result)
                setAvatar2(reader.result)
                // // console.log(avatar)
            }
            reader.readAsDataURL(files[0])
            setimgold(false)
        } catch {

        }
    }

    const onChangestoreType = (e) => {
        setData({ ...data, salelockId2: e.value, salelockname2: e.label })
        // // console.log(e)
    }

    const submitForm = async () => {
        // // console.log(data)
        // // console.log(avatar2)

        if (typeof data.salelockId2 === 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'กรุณาเลือกล็อคขายสินค้า',
                showConfirmButton: false,
                timer: 1000
            })
            return 0
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`

        const formData = new FormData()
        formData.append("file", avatar3[0])
        formData.append("id", data.salelockId2)
        await axios.post(`${url}/api/saleslock/uploadslip`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }).then(res => {
            // console.log(res.data)
            if (res.data.code === 200) {
                // Swal.fire({
                //     icon: 'success',
                //     title: 'สำเร็จ',
                //     showConfirmButton: false,
                //     timer: 1000
                // })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่สำเร็จ',
                    showConfirmButton: false,
                    timer: 1000
                })
                return 0
            }
        })

        await axios.get(`${url}/api/saleslock?id=${data.salelockId2}`).then((res2) => {
            // setSaleslock(res.data.data)
            // console.log(res2.data.data[0])
            axios.put(`${url}/api/saleslock?id=${data.salelockId2}`, {
                lockName: `${res2.data.data[0].lockName}`,
                market_id: `${res2.data.data[0].market_id}`,
                status: 'EXAMINE',
                month: `${res2.data.data[0].month}`,
                store_id: `${JSON.parse(localStorage.getItem("auth")).user.store_id}`,
                slipImg: `https://api.fleamarket-rmutl.com/img/slip/${data.salelockId2}.png`,
                price: `${res2.data.data[0].price}`
            }).then(res3 => {
                // console.log(res3.data)
                if (res3.data.code === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'สำเร็จ',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    fetchApi()
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'ไม่สำเร็จ',
                        showConfirmButton: false,
                        timer: 1000
                    })
                }
            })
        })
    }

    const cancelSalelock = () => {
        Swal.fire({
            title: 'ยกเลิกการจอง',
            text: `ยกเลิกการจอง`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-secondary outline ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                axios.get(`${url}/api/saleslock?id=${data.saleslockID}`).then((res2) => {
                    // setSaleslock(res.data.data)
                    // console.log(res2.data.data[0])
                    axios.put(`${url}/api/saleslock?id=${data.saleslockID}`, {
                        lockName: `${res2.data.data[0].lockName}`,
                        market_id: `${res2.data.data[0].market_id}`,
                        status: 'BLANK',
                        month: `${res2.data.data[0].month}`,
                        store_id: `0`,
                        slipImg: `https://api.fleamarket-rmutl.com/img/slip/null.png`,
                        price: `${res2.data.data[0].price}`
                    }).then(res3 => {
                        // console.log(res3.data)
                        if (res3.data.code === 200) {
                            Swal.fire({
                                icon: 'success',
                                title: 'สำเร็จ',
                                showConfirmButton: false,
                                timer: 1000
                            })
                            fetchApi()
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'ไม่สำเร็จ',
                                showConfirmButton: false,
                                timer: 1000
                            })
                        }
                    })
                })

            }
        })
    }
    if (isLoading) {
        return (
            <div>
                <CardHeader>
                    <CardTitle tag='h4'><div><div class="spinner-border text-primary" role="status"></div>&nbsp;&nbsp;กำลังโหลด</div></CardTitle>
                </CardHeader>
            </div>
        )
    }
    return (

        <Fragment>


            <Card className='card-statistics'>
                <CardHeader>
                    <CardTitle tag='h4'>สรุป</CardTitle>
                    {/* <CardText className='card-text font-small-2 me-25 mb-0'>Updated 1 month ago</CardText> */}
                </CardHeader>
                <CardBody className='statistics-body'>
                    <Row>
                        <Col>
                            <div className='d-flex align-items-center'>
                                <Avatar color='light-success' icon={<Grid size={24} />} className='me-2' />
                                <div className='my-auto'>
                                    {data.saleslockStatus === 'BLANK' ? <h4 className='fw-bolder mb-0' style={{ color: 'red' }}>ยังไม่ได้จอง</h4> : data.saleslockStatus === 'EXAMINE' ? <h5 className='fw-bolder mb-0' style={{ color: 'orange' }}>กำลังตรวจสอบ</h5> : data.saleslockStatus === 'RESERVE' ? <h4 className='fw-bolder mb-0' style={{ color: 'green' }}>จอง {data.area} สำเร็จ </h4> : <h4 className='fw-bolder mb-0' style={{ color: 'red' }}>ยังไม่ได้จอง</h4>}
                                    <CardText className='font-small-4 mb-0'>สถานะการจอง</CardText>
                                </div>
                            </div>
                        </Col>
                        {data.saleslockStatus !== 'BLANK' && data.saleslockStatus !== null ? <Col>
                            <div className='d-flex align-items-center'>
                                <Avatar color='light-success' icon={<Check size={24} />} className='me-2' />
                                <div className='my-auto'>
                                    <h4 className='fw-bolder mb-0' style={{ color: 'black' }}>{data.area}</h4>
                                    <CardText className='font-small-4 mb-0'>ล็อคที่จอง</CardText>
                                </div>
                            </div>
                        </Col> : null}

                    </Row>
                </CardBody>
            </Card>
            <Card className='card-statistics'>
                <CardHeader>
                    <CardTitle tag='h4'>ธนาคาร</CardTitle>
                    {/* <CardText className='card-text font-small-2 me-25 mb-0'>Updated 1 month ago</CardText> */}
                </CardHeader>
                <CardBody className='statistics-body'>
                    <Row>
                        {bankaccount.map(data => {
                            return (<Col sm='4' className='mb-1'>
                                <div className='d-flex align-items-center'>
                                    <Avatar color='light-warning' icon={<DollarSign size={24} />} className='me-2' />
                                    <div className='my-auto'>
                                        <CardText className='font-small-6 mb-0'>เลขบัญชี : {data.bankAccountNo}</CardText>
                                        <CardText className='font-small-3 mb-0'>ชื่อบัญชี : {data.bankAccount}</CardText>
                                        <CardText className='font-small-3 mb-0'>ธนาคาร : {data.bankName}</CardText>
                                    </div>
                                </div>
                            </Col>)
                        })}
                    </Row>
                </CardBody>
            </Card>

            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>การจองล็อคขายของ</CardTitle>
                    <Button tag={Label} color="warning" onClick={() => fetchApi()}>รีเฟรช</Button>
                </CardHeader>
                <CardBody className='py-2 my-25'>


                    <Col sm='12' className='mb-2'>
                        <Label className='form-label' for='currency'>
                            กรุณาเลือกล็อคขายของ
                        </Label>
                        <Select
                            id='salelock'
                            isClearable={false}
                            className='react-select zindex-sticky'
                            classNamePrefix='select'
                            options={storetype}
                            theme={selectThemeColors}
                            defaultValue={defaultValuestoreType}
                            onChange={onChangestoreType}
                            isDisabled={data.saleslockStatus !== 'BLANK' && data.saleslockStatus !== null}
                        />
                    </Col>
                    <div className='d-flex'>
                        <div className='me-25'>
                            {/* <img className='rounded me-50' src={avatar !== null ? avatar : avatar2.length === 0 ? "https://api.fleamarket-rmutl.com/img/slip/null.png" : avatar2} alt='Generic placeholder image' width='280' /> */}
                            {!imgold ? (
                                <img className='rounded me-50' src={avatar2.length !== 0 ? avatar2 : "https://api.fleamarket-rmutl.com/img/slip/null.png"} alt='Generic placeholder image' width='280' />
                            ) : null}
                            {imgold ? (
                                <img className='rounded me-50' src={avatar !== null ? avatar : "https://api.fleamarket-rmutl.com/img/slip/null.png"} alt='Generic placeholder image' width='280' />
                            ) : null}
                            {/* imgold */}
                            {/* <img className='rounded me-50' src={avatar !== null ? avatar : null} alt='Generic placeholder image' width='280' /> */}
                            {/* <img className='rounded me-50' src={avatar} alt='Generic placeholder image' height='480' width='480' /> */}
                        </div>
                        <div className='d-flex align-items-end mt-75 ms-1'>
                            <div>
                                <h5 className='mb-75 me-75' style={{ color: 'green' }}>กรุณาแนบสลิปโอนเงิน</h5>

                                <Button tag={Label} className='mb-75 me-75' size='sm' color='primary' disabled={data.saleslockStatus !== 'BLANK' && data.saleslockStatus !== null}>
                                    เลือกรูปภาพ
                                    <Input type='file' onChange={onChange} hidden accept='image/*' />
                                </Button>
                                {/* <Button className='mb-75 me-75' size='sm' color='danger' onClick={uploadProfile} disabled={data.saleslockStatus !== 'BLANK'}>
                                    อัพโหลด
                                </Button> */}
                                <p className='mb-0'>อนุญาต JPG, GIF หรือ PNG ขนาดสูงสุด 800kB</p>
                            </div>
                        </div>
                    </div>
                    <Form className='mt-2 pt-50'>
                        {/* <Form className='mt-2 pt-50' onSubmit={submitForm}> */}
                        <Row>

                            <Col className='mt-2' sm='12'>
                                {/* <Button className='me-1' color='primary' onClick={submitForm} disabled={data.saleslockStatus !== null}> */}
                                <Button className='me-1' color='primary' onClick={submitForm} disabled={data.saleslockStatus !== 'BLANK' && data.saleslockStatus !== null}>
                                    บันทึก
                                </Button>
                                <Button className='me-1' color='secondary' outline disabled={data.saleslockStatus !== 'BLANK' && data.saleslockStatus !== null}>
                                    ยกเลิก
                                </Button>
                                {data.saleslockStatus === 'EXAMINE' || data.saleslockStatus === 'RESERVE' ? <Button color='danger' onClick={cancelSalelock}>
                                    ยกเลิกการจอง
                                </Button> : null}

                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>

        </Fragment>
    )
}

export default Saleslock
