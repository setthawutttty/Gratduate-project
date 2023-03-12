
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
//   import FileUploaderSingle from './FileUploaderSingle'
//   import { Controller } from 'react-hook-form'
//   import { useDropzone } from 'react-dropzone'
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

const Store = () => {
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
        axios.get(`${url}/api/bankaccount?market_id=${datauser.user.market_id}`).then((res) => {
            setData(res.data.data)
            setisLoading(false)
        })
    }

    const fetchApiRefresh = () => {
        console.log(userdata)
        setisLoading(true)
        axios.get(`${url}/api/bankaccount?market_id=${userdata.user.market_id}`).then((res) => {
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

    useEffect(() => {
        // console.log('useEFFECT $$')
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

    // const editFunc = (data) => {
    //   setModaldata(data)
    //   setShow(true)
    //   setEdit(true)
    // }

    // const dashboardFunc = (data) => {
    //     console.log(data)
    //     history.push(`/store-detail?storeid=${data.id}`)
    //     // setModaldata(data)
    //     // setShow(true)
    //     // setEdit(true)
    // }


    const deleteFunc = (data) => {
        console.log(data)


        Swal.fire({
            title: 'ยืนยันการลบบัญชี',
            text: `ยืนยันการลบบัญชี '${data.bankAccount}'`,
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
                console.log(`${url}/api/store?id=${data.id}`)
                axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
                axios.delete(`${url}/api/bankaccount?id=${data.id}`).then((res) => {
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
        console.log(`${url}/api/bankaccount?id=${modaldata.id}`)
        Swal.fire({
            title: 'ยืนยันการแก้ไข',
            text: `ยืนยันการแก้ไข`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`
                axios.put(`${url}/api/bankaccount?id=${modaldata.id}`, {
                    market_id: `${modaldata.market_id}`,
                    bankName: `${modaldata.bankName}`,
                    bankAccountNo: `${modaldata.bankAccountNo}`,
                    bankAccount: `${modaldata.bankAccount}`
                }).then((res) => {
                    console.log("res = ")
                    console.log(res.data)
                    if (res.data.code === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'สำเร็จ',
                            text: 'สำเร็จ',
                            showConfirmButton: false,
                            timer: 500
                        })
                        // window.location.reload(false)
                        setShow(false)
                        setEdit(false)
                        fetchApiRefresh()
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'ไม่สำเร็จ',
                            text: 'ไม่สำเร็จ',
                            showConfirmButton: false,
                            timer: 500
                        })
                        return 0
                    }
                })
            }
        })
    }
    const basicColumns = [
        {
            name: 'ลำดับ',
            sortable: true,
            // minWidth:'50px',
            selector: (row, key) => key + 1
        },
        {
            name: 'ธนาคาร',
            sortable: true,
            // minWidth:'50px',
            selector: row => row.bankName
        },
        {
            name: 'ชื่อบัญชี',
            sortable: true,
            // minWidth: '50px',
            selector: row => row.bankAccount
        },
        {
            name: 'หมายเลขบัญชี',
            sortable: true,
            // minWidth: '50px',
            selector: row => row.bankAccountNo
        },
        {
            name: 'จัดการ',
            allowOverflow: true,
            cell: (data) => {
                return (
                    <div className='d-flex'>
                        {/* <Box size={15} onClick={() => dashboardFunc(data)} style={{ cursor: 'pointer' }} /> */}
                        {/* <span className='align-middle ms-1' /> */}
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
                                    <CardText className='font-small-3 mb-0'>จำนวนบัญชี</CardText>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            {/* <Button color="primary" onClick={() => history.push('/group-add')}>+ เพิ่มร้านค้า</Button> */}
            <Button color="primary" onClick={() => history.push('/bankaccount-add')}>+ เพิ่มบัญชี</Button>
            <span className='align-middle ms-1' />
            <Button color="warning" onClick={() => fetchApiRefresh()}>รีเฟรช</Button>
            <span className='align-middle ms-1' />

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
                        <h1 className='mb-1'>รายละเอียดบัญชี</h1>
                        <img className='my-0 me-0 mt-2' width={150} src={modaldata.img} />
                    </div>

                    <Row tag='form' className='gy-1 pt-75'>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Detail'>
                                ชื่อธนาคาร
                            </Label>
                            <Input type='text' placeholder='ชื่อธนาคาร' defaultValue={modaldata.bankName} value={modaldata.bankName} onChange={(e) => setModaldata({ ...modaldata, bankName: e.target.value })} disabled={!edit} />
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Name'>
                                ชื่อบัญชี
                            </Label>
                            <Input type='text' placeholder='ชื่อบัญชี' defaultValue={modaldata.bankAccount} value={modaldata.bankAccount} onChange={(e) => setModaldata({ ...modaldata, bankAccount: e.target.value })} disabled={!edit} />
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Location'>
                                หมายเลขบัญชี
                            </Label>
                            <Input type='text' placeholder='หมายเลขบัญชี' defaultValue={modaldata.bankAccountNo} value={modaldata.bankAccountNo} onChange={(e) => setModaldata({ ...modaldata, bankAccountNo: e.target.value })} disabled={!edit} />
                        </Col>

                        <Col xs={12} className='text-center mt-2 pt-50'>
                            {edit ? <Button className='me-1' color='primary' onClick={updateFunc}>
                                บันทึก
                            </Button> : null}

                            <Button type='reset' color='danger' outline onClick={() => setShow(false)}>
                                ยกเลิก
                            </Button>
                        </Col>

                    </Row>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default Store
