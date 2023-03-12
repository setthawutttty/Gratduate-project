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
import { ShoppingBag, MoreVertical, Edit, User, Check, X, FileText, Archive, Trash, Image, ChevronDown, Delete, TrendingUp, Box, DollarSign, UserPlus, UserCheck, Grid, ShoppingCart } from 'react-feather'

// import axios from "axios"
import Cleave from 'cleave.js/react'
import { useHistory } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import apiConfig from '../configs/apiConfig'

const Home = () => {
  const url = apiConfig.mainurl.url
  const history = useHistory()
  const [admindata, setAdmindata] = useState([])
  const [isLoading, setisLoading] = useState(true)

  const [market, setMarket] = useState([])
  const [marketimg, setMarketimg] = useState([])
  const [store, setStore] = useState([])
  const [storeimg, setStoreimg] = useState([])
  // const [user, setUser] = useState(0)
  // const [admin, setAdmin] = useState(0)
  const fetchApi = (admins) => {
    console.log("admins ========= ")
    console.log(admindata)
    console.log(admins)
    Promise.all([
      axios.get(`${url}/api/market`),
      axios.get(`${url}/api/market/listimage`),
      axios.get(`${url}/api/store`),
      axios.get(`${url}/api/store/listimage`)
    ]).then((res) => {
      // setGroup(res[0].data.data.message.length)
      // setDevice(res[1].data.data.message.length)
      // setUser(res[2].data.data.message.length)
      // setAdmin(res[3].data.data.message.length)
      setMarket(res[0].data)
      setMarketimg(res[0].data)
      setStore(res[2].data)
      setStoreimg(res[2].data)

      setisLoading(false)
      // setDevice(res[0].data)
      // setUser(res[0].data)
      // setAdmin(res[0].data)
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
      {/* ตลาด */}
      <Card className='card-statistics'>
        <CardHeader>
          <CardTitle tag='h4'>สถิติตลาด</CardTitle>

        </CardHeader>
        <CardBody className='statistics-body'>
          <Row>
            <Col>
              <div className='d-flex align-items-center'>
                <Avatar color='light-primary' icon={<ShoppingBag size={24} />} className='me-2' />
                <div className='my-auto'>
                  <h4 className='fw-bolder mb-0'>{market.data.length}</h4>
                  <CardText className='font-small-3 mb-0'>จำนวนตลาด</CardText>
                </div>
              </div>
            </Col>
            <Col>
              <div className='d-flex align-items-center'>
                <Avatar color='light-success' icon={<Image size={24} />} className='me-2' />
                <div className='my-auto'>
                  <h4 className='fw-bolder mb-0'>{marketimg.data.length}</h4>
                  <CardText className='font-small-3 mb-0'>จำนวนรูปภาพ</CardText>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* ร้านค้า */}
      <Card className='card-statistics'>
        <CardHeader>
          <CardTitle tag='h4'>สถิติร้านค้า</CardTitle>
        </CardHeader>
        <CardBody className='statistics-body'>
          <Row>
            <Col>
              <div className='d-flex align-items-center'>
                <Avatar color='light-primary' icon={<ShoppingCart size={24} />} className='me-2' />
                <div className='my-auto'>
                  <h4 className='fw-bolder mb-0'>{store.data.length}</h4>
                  <CardText className='font-small-3 mb-0'>จำนวนร้านค้า</CardText>
                </div>
              </div>
            </Col>
            <Col>
              <div className='d-flex align-items-center'>
                <Avatar color='light-success' icon={<Image size={24} />} className='me-2' />
                <div className='my-auto'>
                  <h4 className='fw-bolder mb-0'>{storeimg.data.length}</h4>
                  <CardText className='font-small-3 mb-0'>จำนวนรูปภาพ</CardText>
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
