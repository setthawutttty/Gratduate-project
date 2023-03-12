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
import Avatar from '@components/avatar'
import { MoreVertical, Edit, User, Check, X, FileText, Archive, Trash, ChevronDown, Delete, TrendingUp, Box, DollarSign, UserPlus, UserCheck, Grid, ShoppingCart } from 'react-feather'

// import axios from "axios"
import Cleave from 'cleave.js/react'
import { useHistory } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import apiConfig from '../configs/apiConfig'

const Home = () => {
  const history = useHistory()
  console.log(history)
  const [admindata, setAdmindata] = useState([])
  console.log(admindata)
  const [storedata, setStoredata] = useState([])
  // const [group, setGroup] = useState(0)
  // const [device, setDevice] = useState(0)
  // const [user, setUser] = useState(0)
  // const [admin, setAdmin] = useState(0)
  const url = apiConfig.mainurl.url
  const fetchApi = (dataauth) => {
    console.log(dataauth)
    Promise.all([
      axios.get(`${url}/api/store?id=${dataauth.store_id}`)
      // axios.get("https://api.phanuwat.info/api/device/device/all"),
      // axios.get("https://api.phanuwat.info/api/user/user/all"),
      // axios.get("https://api.phanuwat.info/api/admin")
    ]).then((res) => {
      setStoredata(res[0].data.data[0])
      console.log(res[0].data.data)
      // setGroup(res[0].data.data.message.length)
      // setDevice(res[1].data.data.message.length)
      // setUser(res[2].data.data.message.length)
      // setAdmin(res[3].data.data.message.length)
      // setGroup([])
      // setDevice([])
      // setUser([])
      // setAdmin([])
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
      setAdmindata(JSON.parse(authStorage).user)
      fetchApi(JSON.parse(authStorage).user)
      // return <Link to="/home"/>
      // history.push('/home')
    }
  }

  useEffect(() => {
    console.log('useEFFECT $$')
    getLocal()
    // fetchApi()
  }, [])

  return (
    <div>
      {/* Group */}
      <Card className='card-statistics'>
        <CardHeader>
          <CardTitle tag='h4'>ข้อมูลร้านค้า</CardTitle>
          {/* <CardText className='card-text font-small-2 me-25 mb-0'>Updated 1 month ago</CardText> */}
        </CardHeader>
        <CardBody className='statistics-body'>
          <Row>
            <Col sm='6' className='mb-1'>
              <div className='d-flex align-items-center'>
                <Avatar color='light-success' icon={<ShoppingCart size={24} />} className='me-2' />
                <div className='my-auto'>
                  {/* <h5 className='fw-bolder mb-0'>ชื่อร้านค้า: {storedata.name}</h5> */}
                  <CardText className='font-small-4 mb-0'>ชื่อร้านค้า: {typeof storedata !== "undefined" ? storedata.name : null}</CardText>
                  <CardText className='font-small-4 mb-0'>รายละเอียดร้านค้า: {typeof storedata !== "undefined" ? storedata.details : null}</CardText>
                </div>
              </div>
            </Col>
            <Col sm='6' className='mb-1'>
              <div className='d-flex align-items-center'>
                <Avatar color='light-success' icon={<User size={24} />} className='me-2' />
                <div className='my-auto'>
                  {/* <h5 className='fw-bolder mb-0'>ชื่อร้านค้า: {storedata.name}</h5> */}
                  <CardText className='font-small-4 mb-0'>ชื่อผู้ดูแล: {typeof storedata !== "undefined" ? storedata.usersName : null}</CardText>
                  <CardText className='font-small-4 mb-0'>อีเมล: {typeof storedata !== "undefined" ? storedata.usersEmail : null}</CardText>
                  <CardText className='font-small-4 mb-0'>เบอร์โทรศัพท์: {typeof storedata !== "undefined" ? storedata.usersTel : null}</CardText>
                </div>
              </div>
            </Col>

          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default Home
