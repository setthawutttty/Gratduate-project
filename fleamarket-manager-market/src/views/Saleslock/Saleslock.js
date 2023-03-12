
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
    ListGroupItem,
    CardImg
} from "reactstrap"
import Avatar from '@components/avatar'
import Select from 'react-select'
import { MoreVertical, Edit, User, Check, X, DownloadCloud, FileText, Archive, Trash, ChevronDown, Delete, TrendingUp, Box, DollarSign } from 'react-feather'
import axios from 'axios'
import { useEffect, useState, Fragment } from 'react'
import { useHistory, Link } from "react-router-dom"
import Swal from "sweetalert2"
import DataTable from 'react-data-table-component'
import Cleave from 'cleave.js/react'
import apiConfig from '../../configs/apiConfig'

const Saleslock = () => {
    const history = useHistory()
    const [isLoading, setisLoading] = useState(true)
    // console.log(history)

    const [userdata, setUserdata] = useState([])
    // console.log(admindata)

    const url = apiConfig.mainurl.url
    const [data, setData] = useState([])
    const [modaldata, setModaldata] = useState([])
    const [show, setShow] = useState(false)
    const [edit, setEdit] = useState(false)

    const fetchApi = (datauser) => {
        axios.get(`${url}/api/saleslock?market_id=${datauser.user.market_id}`).then((res) => {
            setData(res.data.data)
            setisLoading(false)
        })
    }

    const fetchApiRefresh = () => {
        console.log(userdata)
        setisLoading(true)
        axios.get(`${url}/api/saleslock?market_id=${userdata.user.market_id}`).then((res) => {
            setisLoading(false)
            setData(res.data.data)
        })
    }

    const getLocal = () => {
        const authStorage = localStorage.getItem("auth")
        const savedStorage = localStorage.getItem("saved")
        if (authStorage === null || savedStorage === null) {
            history.push('/login')
            // return <Link to="/login"/>
            localStorage.clear()
        } else if (savedStorage && (new Date().getTime() - savedStorage > 50 * 60 * 1000)) {
            history.push('/login')
            // return <Link to="/login"/>
            localStorage.clear()
        } else if (authStorage) {
            //   console.log('=========== JSON.parse(authStorage) ===========')
            //   console.log(JSON.parse(authStorage))
            setUserdata(JSON.parse(authStorage))
            fetchApi(JSON.parse(authStorage))
            // return <Link to="/home"/>
            // history.push('/home')
        }
    }

    // ########################################################################## ตรวจสอบสถานะการจอง
    const [examineShow, setexamineShow] = useState(false)
    const [storedata, setStoredata] = useState({ name: 'xx' })
    const [modaldatareexamine, setModaldatareexamine] = useState([])
    const detailEXAMINEFunc = async (data) => {
        // console.log(modaldatareexamine)
        // console.log(storedata)

        await axios.get(`${url}/api/store?id=${modaldatareexamine.store_id}`).then((res) => {
            setStoredata(res.data.data[0])
            // console.log(res.data.data[0])
        })
        setModaldatareexamine(data)
        setexamineShow(true)
    }

    const approveFunc = (state, detail) => {
        if (state) { //ถ้าอนุมัติ
            Swal.fire({
                title: 'ยืนยันการอนุมัติ',
                text: `ยืนยันการอนุมัติ`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger ms-1'
                },
                buttonsStyling: false
            }).then(function (result) {
                if (result.value) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
                    axios.put(`${url}/api/saleslock?id=${detail.id}`, {
                        lockName: detail.lockName,
                        market_id: detail.market_id,
                        status: "RESERVE",
                        month: detail.month,
                        store_id: detail.store_id,
                        slipImg: detail.slipImg,
                        price: detail.price
                    }).then((res) => {
                        console.log(res.data)
                        if (res.data.code === 200) {
                            Swal.fire({
                                icon: 'success',
                                title: 'สำเร็จ',
                                text: 'สำเร็จ',
                                showConfirmButton: false,
                                timer: 500
                            })
                            fetchApiRefresh()
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
            })
        } else { //ถ้าไม่อนุมัติ
            Swal.fire({
                title: 'ยืนยันไม่อนุมัติ',
                text: `ยืนยันไม่อนุมัติ`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger ms-1'
                },
                buttonsStyling: false
            }).then(function (result) {
                if (result.value) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
                    axios.put(`${url}/api/saleslock?id=${detail.id}`, {
                        lockName: detail.lockName,
                        market_id: detail.market_id,
                        status: "BLANK",
                        month: detail.month,
                        store_id: `0`,
                        slipImg: "https://api.fleamarket-rmutl.com/img/slip/null.png",
                        price: detail.price
                    }).then((res) => {
                        console.log(res.data)
                        if (res.data.code === 200) {
                            Swal.fire({
                                icon: 'success',
                                title: 'สำเร็จ',
                                text: 'สำเร็จ',
                                showConfirmButton: false,
                                timer: 500
                            })
                            fetchApiRefresh()
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
            })

        }
        setexamineShow(false)
        // Swal.fire({
        //     icon: 'success',
        //     title: 'รอตรวจ',
        //     text: 'รอตรวจ',
        //     showConfirmButton: false,
        //     timer: 1000
        // })
    }

    // ########################################################################## ดูการจองที่สำเร็จแล้ว
    const [reserveShow, setreserveShow] = useState(false)
    const [modaldatareserve, setModaldatareserve] = useState([])

    const detailRESERVEFunc = (data) => {
        console.log(modaldatareserve)
        axios.get(`${url}/api/store?id=${modaldatareexamine.store_id}`).then((res) => {
            setStoredata(res.data.data[0])
            setModaldatareserve(data)
            setreserveShow(true)
        })
    }

    const reserveFunc = (state, detail) => {
        if (!state) {
            Swal.fire({
                title: 'ยกเลิกการอนุมัติ',
                text: `ยกเลิกการอนุมัติ`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger ms-1'
                },
                buttonsStyling: false
            }).then(function (result) {
                if (result.value) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
                    axios.put(`${url}/api/saleslock?id=${detail.id}`, {
                        lockName: detail.lockName,
                        market_id: detail.market_id,
                        status: "BLANK",
                        month: detail.month,
                        store_id: `0`,
                        slipImg: "https://api.fleamarket-rmutl.com/img/slip/null.png",
                        price: detail.price
                    }).then((res) => {
                        console.log(res.data)
                        if (res.data.code === 200) {
                            Swal.fire({
                                icon: 'success',
                                title: 'ยกเลิกสำเร็จ',
                                text: 'ยกเลิกสำเร็จ',
                                showConfirmButton: false,
                                timer: 1000
                            })
                            fetchApiRefresh()
                        } else {
                            Swal.fire({
                                icon: 'success',
                                title: 'ยกเลิกไม่สำเร็จ',
                                text: 'ยกเลิกไม่สำเร็จ',
                                showConfirmButton: false,
                                timer: 1000
                            })

                        }
                    })
                }
            })

        }
        setreserveShow(false)
    }


    // ########################################################################## รีเซ็ตราคาทั้งหมด
    const [resetpriceshow, setResetpriceshow] = useState(false)
    const [modaldataresetprice, setResetpriceresetpriceshow] = useState("10")
    const resetpriceFunc = () => {
        Swal.fire({
            title: 'ยืนยันการรีเซ็ตราคา',
            text: `ยืนยันการรีเซ็ตราคา`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
                axios.put(`${url}/api/saleslock/updatepriceall?market_id=${userdata.user.market_id}`, {
                    price: modaldataresetprice
                }).then((res) => {
                    console.log(res.data)
                    if (res.data.code === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'สำเร็จ',
                            text: 'สำเร็จ',
                            showConfirmButton: false,
                            timer: 500
                        })
                        fetchApiRefresh()
                        setResetpriceshow(false)
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'ไม่สำเร็จ',
                            text: 'ไม่สำเร็จ',
                            showConfirmButton: false,
                            timer: 500
                        })
                        setResetpriceshow(false)
                    }
                })
            }
        })
    }
    const resetPrice = async () => {
        setResetpriceshow(true)
    }

    // ########################################################################## รีเซ็ตเดือน
    const resetMonth = () => {
        const d = new Date()
        const months = (d.getMonth() + 1).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
        const years = d.getFullYear()
        const monthyear = `${months}-${years}`
        console.log(monthyear)
        console.log(userdata.user.market_id)

        Swal.fire({
            title: 'ยืนยันการรีเซ็ตเป็นเดือนปัจจุบัน',
            text: `ยืนยันการรีเซ็ตเป็นเดือนปัจจุบัน`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                console.log(`${url}/api/saleslock/updatemonth?market_id=${userdata.user.market_id}&month=${monthyear}`)

                axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
                axios.put(`${url}/api/saleslock/updatemonth?market_id=${userdata.user.market_id}&month=${monthyear}`).then((res) => {
                    console.log(res.data)
                    if (res.data.code === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'สำเร็จ',
                            text: 'สำเร็จ',
                            showConfirmButton: false,
                            timer: 500
                        })
                        fetchApiRefresh()
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
        })
    }

    useEffect(() => {
        getLocal()
    }, [])


    const editFunc = (data) => {
        setModaldata(data)
        setShow(true)
        setEdit(true)
    }

    const detailsFunc = (data) => {
        setModaldata(data)
        setShow(true)
        setEdit(false)
    }


    const deleteFunc = (data) => {
        console.log(data)
        Swal.fire({
            title: 'ยืนยันการลบล็อคขายของ',
            text: `ยืนยันการลบล็อคขายของ '${data.lockName}'`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ยืนยันการลบ',
            cancelButtonText: 'ยกเลิก',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                console.log(`${url}/api/saleslock?id=${data.id}`)
                axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
                axios.delete(`${url}/api/saleslock?id=${data.id}`).then((res) => {
                    if (res.data.data.err) {
                        Swal.fire({
                            title: 'Error',
                            icon: 'error',
                            showConfirmButton: false,
                            timer: 500
                        })
                        return 0
                    } else {

                        Swal.fire({
                            icon: 'success',
                            title: 'ลบสำเร็จ',
                            text: 'ลบสำเร็จ',
                            showConfirmButton: false,
                            timer: 500
                        })
                        fetchApiRefresh()
                    }
                })
            }
        })
    }

    const updateFunc = () => {
        console.log(modaldata)
        Swal.fire({
            title: 'ยืนยันการแก้ไขล็อคขายสินค้า',
            text: `ยืนยันการแก้ไขล็อคขายสินค้า '${modaldata.lockName}'`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
                axios.put(`${url}/api/saleslock?id=${modaldata.id}`, {
                    lockName: modaldata.lockName,
                    market_id: modaldata.market_id,
                    status: modaldata.status,
                    month: modaldata.month,
                    store_id: modaldata.store_id === null ? '0' : `${modaldata.store_id}`,
                    slipImg: modaldata.slipImg,
                    price: `${modaldata.price}`
                }).then((res) => {
                    console.log("res = ")
                    console.log(res.data)
                    if (res.data.code === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'สำเร็จ',
                            text: 'แก้ไขล็อคขายสินค้าสำเร็จ',
                            showConfirmButton: false,
                            // customClass: {
                            //     confirmButton: 'btn btn-success'
                            // },
                            timer: 1000
                        })
                        setShow(false)
                        setEdit(false)
                        fetchApiRefresh()
                        // return 0
                    } else {
                        Swal.fire({
                            title: 'ไม่สำเร็จ',
                            text: 'แก้ไขล็อคขายสินค้าไม่สำเร็จ',
                            icon: 'error',
                            customClass: {
                                confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                })
            }
        })
    }

    const statusObj = {
        pending: 'light-warning',
        active: 'light-success',
        inactive: 'light-danger'
    }

    const basicColumns = [
        {
            name: 'ลำดับ',
            sortable: true,
            selector: (row, key) => key + 1
        },
        {
            name: 'ชื่อล็อคขายของ',
            sortable: true,
            selector: row => row.lockName
        },
        {
            name: 'ราคาต่อเดือน',
            sortable: true,
            selector: row => `${row.price} บาท`
        },
        {
            name: 'รายเดือน',
            sortable: true,
            selector: row => row.month
        },
        {
            name: 'สถานะ',
            sortable: true,
            selector: row => (
                <div>
                    <Badge className='text-capitalize' color={row.status === "BLANK" ? statusObj.active : row.status === "EXAMINE" ? statusObj.pending : statusObj.inactive}
                        pill>
                        {row.status === "BLANK" ? "ว่าง" : row.status === "EXAMINE" ? <div style={{ cursor: 'pointer' }} onClick={() => detailEXAMINEFunc(row)}>
                            รออนุมัติ&nbsp;
                            <Box size={15} />
                        </div> : <div style={{ cursor: 'pointer' }} onClick={() => detailRESERVEFunc(row)}>
                            จองแล้ว&nbsp;
                            <Box size={15} />
                        </div>}
                    </Badge>
                    {/* {row.status === "EXAMINE" ? <div>
                        <span className='mx-0' />
                        <a>
                        <Box size={15} onClick={() => detailEXAMINEFunc(row)} style={{ cursor: 'pointer' }} />
                        </a>
                    </div> : null} */}
                </div>

            )
        },
        {
            name: 'จัดการ',
            allowOverflow: true,
            cell: (data) => {
                return (
                    <div className='d-flex'>
                        {/* <Box size={15} onClick={() => dashboardFunc(data)} style={{ cursor: 'pointer' }} />
                        <span className='align-middle ms-1' /> */}
                        <FileText size={15} onClick={() => detailsFunc(data)} style={{ cursor: 'pointer' }} />
                        <span className='align-middle ms-1' />
                        <Edit size={15} onClick={() => editFunc(data)} style={{ cursor: 'pointer' }} />
                        <span className='align-middle ms-1' />
                        {/* <Edit size={15} onClick={() => editFunc(data)} style={{cursor:'pointer'}}/>
                <span className='align-middle ms-1'/> */}
                        <Trash size={15} onClick={() => deleteFunc(data)} style={{ cursor: 'pointer' }} />
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
        <div>
            <Card className='card-statistics'>
                <CardHeader>
                    <CardTitle tag='h4'>สรุป</CardTitle>
                    {/* <CardText className='card-text font-small-2 me-25 mb-0'>Updated 1 month ago</CardText> */}
                </CardHeader>
                <CardBody className='statistics-body'>
                    <Row>
                        <Col>
                            <div className='d-flex align-items-center'>
                                <Avatar color='light-primary' icon={<TrendingUp size={24} />} className='me-2' />
                                <div className='my-auto'>
                                    <h4 className='fw-bolder mb-0'>{data.length}</h4>
                                    <CardText className='font-small-3 mb-0'>จำนวนล็อคขายของ</CardText>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            {/* <Row>
                <Col md={3} xs={4}>
                    <Button color="primary" onClick={() => history.push('/saleslock-add')}>+ เพิ่มล็อคขายของ</Button>
                </Col>
                <Col md={3} xs={4}>
                    <Button color="success" onClick={() => resetMonth()}>รีเซ็ตเป็นเดือนปัจจุบัน</Button>
                </Col>
                <Col md={3} xs={4}>
                    <Button color="success" onClick={() => resetMonth()}>รีเซ็ตเป็นเดือนปัจจุบัน</Button>
                </Col>
                <Col md={3} xs={4}>
                    <Button color="success" onClick={() => resetMonth()}>รีเซ็ตเป็นเดือนปัจจุบัน</Button>
                </Col>
            </Row> */}
            <Button color="primary" onClick={() => history.push('/saleslock-add')}>+ เพิ่มล็อคขายของ</Button>
            <span className='align-middle ms-1' />
            <Button color="warning" onClick={() => fetchApiRefresh()}>รีเฟรช</Button>
            <span className='align-middle ms-1' />
            <Button color="success" onClick={() => resetMonth()}>รีเซ็ตเป็นเดือนปัจจุบัน</Button>
            <span className='align-middle ms-1' />
            <Button color="success" onClick={() => resetPrice()}>แก้ไขราคาทั้งหมด</Button>
            <span className='align-middle ms-1' />
            {/* <Button className='align-middle ms-1' color="success" onClick={() => resetMonth()}>รีเซ็ตเป็นเดือนปัจจุบัน</Button>
            <span className='align-end ms-1' /> */}

            <br />
            <br />
            <DataTable
                noHeader
                pagination
                data={data}
                columns={basicColumns}
                className='react-dataTable'
                sortIcon={<ChevronDown size={10} />}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                noDataComponent="ไม่พบข้อมูล"
            />
            <Modal isOpen={show} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent'></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <div className='text-center mb-2'>
                        <h1 className='mb-1'>รายละเอียดล็อคขายของ</h1>
                        <img className='my-0 me-0 mt-2' width={150} src={modaldata.img} />
                    </div>

                    <Row tag='form' className='gy-1 pt-75'>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Name'>
                                ชื่อล็อคขายของ
                            </Label>
                            <Input type='text' placeholder='ชื่อล็อคขายของ' defaultValue={modaldata.lockName} value={modaldata.lockName} onChange={(e) => setModaldata({ ...modaldata, lockName: e.target.value })} disabled={!edit} />
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Location'>
                                ราคาต่อเดือน
                            </Label>
                            <Input type='text' placeholder='ราคาต่อเดือน' defaultValue={modaldata.price} value={modaldata.price} onChange={(e) => setModaldata({ ...modaldata, price: e.target.value })} disabled={!edit} />
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Location'>
                                รายเดือน
                            </Label>
                            <Input type='text' placeholder='รายเดือน' defaultValue={modaldata.month} value={modaldata.month} onChange={(e) => setModaldata({ ...modaldata, month: e.target.value })} disabled={!edit} />
                        </Col>
                        <Col xs={12} className='text-center mt-2 pt-50'>
                            {edit ? <Button className='me-1' color='primary' onClick={updateFunc}>
                                บันทึก
                            </Button> : null}


                            <Button type='reset' color='danger' outline onClick={() => setShow(false)}>
                                ปิด
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>

            <Modal isOpen={resetpriceshow} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent'></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <div className='text-center mb-2'>
                        <h1 className='mb-1'>แก้ไขราคาทั้งหมด</h1>
                        {/* <img className='my-0 me-0 mt-2' width={150} src={modaldata.img} /> modaldataresetprice, setResetpriceresetpriceshow*/}
                    </div>

                    <Row tag='form' className='gy-1 pt-75'>
                        <Col md={12} xs={12}>
                            <Label className='form-label' for='Name'>
                                ราคา
                            </Label>
                            <Input type='text' placeholder='ราคา' defaultValue={modaldataresetprice} value={modaldataresetprice} onChange={(e) => setResetpriceresetpriceshow(e.target.value)} />
                        </Col>

                        <Col xs={12} className='text-center mt-2 pt-50'>
                            <Button className='me-1' color='primary' onClick={resetpriceFunc}>
                                บันทึก
                            </Button>

                            <Button type='reset' color='danger' outline onClick={() => setResetpriceshow(false)}>
                                ปิด
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>

            <Modal isOpen={examineShow} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent'></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <div className='text-center mb-2'>
                        <h1 className='mb-1'>ตรวจการจอง</h1>
                        <img className='my-0 me-0 mt-2' width={350} src={modaldatareexamine.slipImg} />
                    </div>

                    <Row tag='form' className='gy-1 pt-75'>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Name'>
                                ชื่อล็อคขายของ
                            </Label>
                            <Input type='text' placeholder='ชื่อล็อคขายของ' defaultValue={modaldatareexamine.lockName} value={modaldatareexamine.lockName} disabled />
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Name'>
                                ชื่อร้านค้า
                            </Label>
                            <Input type='text' placeholder='ชื่อร้านค้า' defaultValue={storedata ? storedata.name : ""} value={storedata ? storedata.name : ""} disabled />
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Name'>
                                เบอร์โทรร้านค้า
                            </Label>
                            <Input type='text' placeholder='เบอร์โทรร้านค้า' defaultValue={storedata ? storedata.usersTel : ""} value={storedata ? storedata.usersTel : ""} disabled />
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Name'>
                                ประเภทร้านค้า
                            </Label>
                            <Input type='text' placeholder='ประเภทร้านค้า' defaultValue={storedata ? storedata.storetype : ""} value={storedata ? storedata.storetype : ""} disabled />
                        </Col>

                        <Col xs={12} className='text-center mt-2 pt-50'>
                            <Button className='me-1' color='success' onClick={() => approveFunc(true, modaldatareexamine)}>
                                อนุมัติ
                            </Button>
                            {/* <Button className='me-1' color='danger' onClick={examineFunc}> */}
                            <Button className='me-1' color='danger' onClick={() => approveFunc(false, modaldatareexamine)}>
                                ไม่อนุมัติ
                            </Button>

                            <Button type='reset' color='danger' outline onClick={() => setexamineShow(false)}>
                                ปิด
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>

            <Modal isOpen={reserveShow} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent'></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <div className='text-center mb-2'>
                        <h1 className='mb-1'>ข้อมูลการจอง</h1>
                        {/* <img className='my-0 me-0 mt-2' width={150} src={modaldatareexamine.slipImg} /> */}
                        <img className='my-0 me-0 mt-2' width={150} src={modaldatareserve.slipImg} />
                    </div>

                    <Row tag='form' className='gy-1 pt-75'>
                        {/* modaldatareserve storedata */}

                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Name'>
                                ชื่อล็อคขายของ
                            </Label>
                            <Input type='text' placeholder='ชื่อล็อคขายของ' defaultValue={modaldatareserve.lockName} value={modaldatareserve.lockName} disabled />
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Name'>
                                ชื่อร้านค้า
                            </Label>
                            <Input type='text' placeholder='ชื่อร้านค้า' defaultValue={storedata ? storedata.name : ""} value={storedata ? storedata.name : ""} disabled />
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Name'>
                                เบอร์โทรร้านค้า
                            </Label>
                            <Input type='text' placeholder='เบอร์โทรร้านค้า' defaultValue={storedata ? storedata.usersTel : ""} value={storedata ? storedata.usersTel : ""} disabled />
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Name'>
                                ประเภทร้านค้า
                            </Label>
                            <Input type='text' placeholder='ประเภทร้านค้า' defaultValue={storedata ? storedata.storetype : ""} value={storedata ? storedata.storetype : ""} disabled />
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Name'>
                                รายเดือน
                            </Label>
                            <Input type='text' placeholder='ประเภทร้านค้า' defaultValue={modaldatareserve.month} value={modaldatareserve.month} disabled />
                        </Col>
                        <Col xs={12} className='text-center mt-2 pt-50'>
                            {/* <Button className='me-1' color='success' onClick={() => reserveFunc(true, modaldatareserve)}>
                                อนุมัติ
                            </Button> */}
                            {/* <Button className='me-1' color='danger' onClick={examineFunc}> */}
                            <Button className='me-1' color='danger' onClick={() => reserveFunc(false, modaldatareserve)}>
                                ยกเลิกการอนุมัติ
                            </Button>
                            {/* <Button className='me-1' color='primary' onClick={reserveFunc}>
                                บันทึก
                            </Button> */}

                            <Button type='reset' color='danger' outline onClick={() => setreserveShow(false)}>
                                ปิด
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>


        </div>
    )
}

export default Saleslock
