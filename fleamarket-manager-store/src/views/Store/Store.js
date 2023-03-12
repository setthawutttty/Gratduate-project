import { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import Select from 'react-select'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useHistory } from "react-router-dom"
import apiConfig from '../../configs/apiConfig'
import DataTable from 'react-data-table-component'
import Swal from "sweetalert2"

import { Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback } from 'reactstrap'
import { MoreVertical, Edit, User, Check, X, DownloadCloud, FileText, Archive, Trash, ChevronDown, Delete, TrendingUp, Box, DollarSign } from 'react-feather'
import { selectThemeColors } from '@utils'

const Store = () => {
    const history = useHistory()

    const url = apiConfig.mainurl.url
    const [data, setData] = useState([])
    const [datatable, setDatatable] = useState([])
    const [storeid, setStoreid] = useState([])
    const [isLoading, setisLoading] = useState(true)
    const [userdata, setUserdata] = useState([])
    const [storetype, setStoreType] = useState([])

    const fetchApi = async () => {
        const authStorage = localStorage.getItem("auth")
        // console.log(`${url}/api/store?id=${JSON.parse(authStorage).user.store_id}`)
        console.log(`Bearer ${userdata.token}`)

        await axios.get(`${url}/api/store?id=${JSON.parse(authStorage).user.store_id}`).then((res) => {
            setData(res.data.data[0])
            setDatatable([])
        })

        await axios.get(`${url}/api/store/listimage?store_id=${JSON.parse(authStorage).user.store_id}`).then((res) => {
            setDatatable(res.data.data)
            console.log(res.data.data)
        })
        axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
        await axios.get(`${url}/api/store/type`).then(async (res) => {
            console.log(res.data)
            if (res.data.status) {
                const datas = []
                await (res.data.data).map(data => {
                    datas.push({ value: data.id, label: data.name })
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
            console.log(JSON.parse(authStorage))
            setUserdata(JSON.parse(authStorage))
            setStoreid(JSON.parse(authStorage).user.store_id)
            fetchApi()
        }
    }


    const [avatar, setAvatar] = useState('')
    const [avatar2, setAvatar2] = useState('')
    const [imagedetail, setImagedetail] = useState([])
    const [isUploadding, setIsUploadding] = useState(false)

    useEffect(() => {
        getLocal()
        setIsUploadding(false)
    }, [])

    useEffect(() => {
        try {
            setAvatar(data.img)
        } catch {
            history.push("/store")
        }
    }, [data])

    const defaultValuestoreType = () => {
        return ({ value: data.storetypeId, label: data.storetype })
    }

    const onChange = e => {
        setAvatar2(e.target.files)
        const reader = new FileReader(),
            files = e.target.files
        reader.onload = function () {
            setAvatar(reader.result)
            console.log(avatar)
        }
        reader.readAsDataURL(files[0])
    }

    const onChangestoreType = (e) => {
        setData({ ...data, storetypeId: e.value, storetype: e.label })
    }

    const submitForm = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
        await axios.put(`${url}/api/store?id=${storeid}`, {
            name: data.name,
            details: data.details,
            storetype_id: data.storetypeId,
            market_id: data.market_id,
            users_id: data.users_id
        }).then(data => {
            console.log(`update ร้านค้า : ${data.data}`)
        })
        await axios.put(`${url}/api/users?id=${data.users_id}`, {
            name: data.usersName,
            email: data.usersEmail,
            permission: "STORE",
            tel: data.usersTel
        }).then(data => {
            console.log(`update USER : ${data.data}`)
            if (data.data.code === 200) {

                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    showConfirmButton: false,
                    timer: 1000
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่สำเร็จ',
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        })
    }

    const onChangeDetailImage = e => {
        setImagedetail(e.target.files)
    }

    const uploadImageDetail = async () => {
        console.log(imagedetail)
        setIsUploadding(true)
        const formData = new FormData()
        Array.from(imagedetail).forEach(file => formData.append("file", file))
        // formData.append("file", imagedetail[0])
        formData.append("id", data.id)
        await axios.post(`${url}/api/store/uploadillustration`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }).then(res => {
            console.log(res.data)
            if (res.data.code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    showConfirmButton: false,
                    timer: 1000
                })
                setImagedetail([])
                setIsUploadding(false)
                fetchApi()
            } else {
                setImagedetail([])
                setIsUploadding(false)
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่สำเร็จ',
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        })
    }

    const uploadProfile = async () => {
        const formData = new FormData()
        formData.append("file", avatar2[0])
        formData.append("id", data.id)
        await axios.post(`${url}/api/store/uploadprofile`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }).then(res => {
            // console.log(res.data)
            if (res.data.code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    showConfirmButton: false,
                    timer: 1000
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่สำเร็จ',
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        })
    }
    const deleteImg = (data) => {
        console.log(data)
        Swal.fire({
            title: 'ยืนยันการลบรูปภาพ',
            text: `ยืนยันการลบรูปภาพ '${data.id}'`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ยืนยันการลบ',
            cancelButtonText: 'ยกเลิก',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        })
            .then(function (result) {
                if (result.value) {
                    axios.delete(`${url}/api/store/deleteimage?id=${data.id}`).then((res) => {
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
                            fetchApi()
                            Swal.fire({
                                icon: 'success',
                                title: 'ลบข้อมูลสำเร็จ',
                                text: 'ลบข้อมูลสำเร็จ',
                                showConfirmButton: false,
                                timer: 500
                            })
                        }
                    })
                }
            })
    }
    const basicColumns = [
        {
            name: 'ลำดับ',
            sortable: true,
            selector: (row, key) => key + 1
        },
        {
            name: 'รูปภาพ',
            sortable: true,
            selector: (row) => {
                return (
                    <img src={row.path} width="150" />
                )
            }
        },
        {
            name: 'วันที่เพิ่ม',
            sortable: true,
            selector: row => new Date(row.updateAt).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                weekday: 'long'
            })
        },
        {
            name: 'จัดการ',
            allowOverflow: true,
            cell: (data) => {
                return (
                    <div className='d-flex'>
                        <Trash size={15} onClick={() => deleteImg(data)} style={{ cursor: 'pointer' }} />
                    </div>
                )
            }
        }
    ]
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
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>รายละเอียดร้านค้า</CardTitle>
                    <Button tag={Label} color="warning" onClick={() => fetchApi()}>รีเฟรช</Button>
                </CardHeader>
                <CardBody className='py-2 my-25'>
                    <div className='d-flex'>
                        <div className='me-25'>
                            <img className='rounded me-50' src={avatar} alt='Generic placeholder image' height='100' width='100' />
                        </div>
                        <div className='d-flex align-items-end mt-75 ms-1'>
                            <div>
                                <Button tag={Label} className='mb-75 me-75' size='sm' color='primary'>
                                    เลือกรูปภาพ
                                    <Input type='file' onChange={onChange} hidden accept='image/*' />
                                </Button>
                                <Button className='mb-75 me-75' size='sm' color='danger' onClick={uploadProfile}>
                                    อัพโหลด
                                </Button>
                                <p className='mb-0'>อนุญาต JPG, GIF หรือ PNG ขนาดสูงสุด 800kB</p>
                            </div>
                        </div>
                    </div>
                    <Form className='mt-2 pt-50'>
                        {/* <Form className='mt-2 pt-50' onSubmit={submitForm}> */}
                        <Row>
                            <Col sm='6' className='mb-1'>
                                <Label className='form-label' for='firstName'>
                                    ชื่อร้านค้า
                                </Label>
                                <Input id='storename' type='text' name='storename' placeholder='ชื่อร้านค้า'
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                    value={data.name}
                                />
                            </Col>
                            <Col sm='12' className='mb-1'>
                                <Label className='form-label' for='lastName'>
                                    รายละเอียดร้านค้า
                                </Label>
                                <Input
                                    name='text'
                                    type='textarea'
                                    id='exampleText'
                                    placeholder='รายละเอียดร้านค้า'
                                    onChange={(e) => setData({ ...data, details: e.target.value })}
                                    value={data.details}
                                />
                                <Label className='text-red' style={(data.details).length > 255 ? { color: 'red' } : { color: 'black' }}>
                                    {`${data.details.length}`}
                                </Label>
                                <Label className='text-red'>
                                    /255
                                </Label>
                            </Col>
                            <Col sm='6' className='mb-1'>
                                <Label className='form-label' for='emailInput'>
                                    อีเมล
                                </Label>
                                <Input id='emailInput' type='email' name='email' placeholder='อีเมล'
                                    onChange={(e) => setData({ ...data, usersEmail: e.target.value })}
                                    value={data.usersEmail} disabled
                                />
                            </Col>
                            <Col sm='6' className='mb-1'>
                                <Label className='form-label' for='company'>
                                    ชื่อผู้ดูแล
                                </Label>
                                <Input id='company' name='company' placeholder='ชื่อผู้ดูแล'
                                    onChange={(e) => setData({ ...data, usersName: e.target.value })}
                                    value={data.usersName}
                                />
                            </Col>
                            <Col sm='6' className='mb-1'>
                                <Label className='form-label' for='phNumber'>
                                    เบอร์โทรศัพท์
                                </Label>
                                <Input id='company' name='company' placeholder='เบอร์โทรศัพท์'
                                    onChange={(e) => setData({ ...data, usersTel: e.target.value })}
                                    value={data.usersTel}
                                />
                            </Col>

                            <Col sm='6' className='mb-1'>
                                <Label className='form-label' for='currency'>
                                    ประเภทร้านค้า
                                </Label>
                                <Select
                                    id='storeType'
                                    isClearable={false}
                                    className='react-select'
                                    classNamePrefix='select'
                                    options={storetype}
                                    theme={selectThemeColors}
                                    defaultValue={defaultValuestoreType}
                                    onChange={onChangestoreType}
                                />
                            </Col>

                            <Col className='mt-2' sm='12'>
                                <Button className='me-1' color='primary' onClick={submitForm}>
                                    บันทึก
                                </Button>
                                <Button color='secondary' outline>
                                    ยกเลิก
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>

            {/* รายละเอียดรูปภาพ */}
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>ระบบจัดการรูปภาพ</CardTitle>
                </CardHeader>
                <CardBody className='py-2 my-25'>
                    <Button tag={Label} color="primary" >
                        เลือกรูปภาพ
                        <Input type='file' onChange={onChangeDetailImage} hidden accept='image/*' multiple />
                    </Button>
                    <span className='align-middle ms-1' />
                    <Button tag={Label} color="danger" onClick={uploadImageDetail} disabled={imagedetail.length === 0}>อัพโหลด</Button>
                    <span className='align-middle ms-1'><p>เลือก {imagedetail.length} ไฟล์</p></span>
                    {isUploadding ? <div><div class="spinner-border text-primary" role="status"></div>&nbsp;&nbsp;กำลังอัพโหลด</div> : null}

                    <br />
                    <br />
                    <DataTable
                        noHeader
                        pagination
                        data={datatable}
                        columns={basicColumns}
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10} />}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                        noDataComponent="ไม่พบข้อมูล"
                        paginationPerPage={5}
                    />
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default Store
