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
import apiConfig from '../configs/apiConfig'
import { MoreVertical, Edit, User, Check, X, FileText, Archive, Trash, ChevronDown, Delete, TrendingUp, Box, DollarSign, UserPlus, UserCheck, Grid, ShoppingBag, ShoppingCart } from 'react-feather'

// import axios from "axios"
import Cleave from 'cleave.js/react'
import { useHistory } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
// import apiConfig from '../../configs/apiConfig'

const Home = () => {
  const url = apiConfig.mainurl.url
  const history = useHistory()
  console.log(history)
  const [userdata, setUserdata] = useState([])
  console.log(userdata)
  

  const [isLoading, setisLoading] = useState(true)
  
  const [storedata, setStoredata] = useState([])
  const [storedataimg, setStoredataimg] = useState([])

  const fetchApi = (datauser) => {
      console.log("datauser ========= ")
      console.log(datauser.user.market_id)
        Promise.all([
          axios.get(`${url}/api/store?market_id=${datauser.user.market_id}`),
          axios.get(`${url}/api/market/listimage?market_id=${datauser.user.market_id}`)
        ]).then((result) => {
          console.log(result[0].data)
          setStoredata(result[0].data)
          setStoredataimg(result[1].data)
          setisLoading(false)
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
      localStorage.clear()
    } else if (authStorage) {
      console.log('=========== JSON.parse(authStorage) ===========')
      console.log(JSON.parse(authStorage))
      setUserdata(JSON.parse(authStorage))
      fetchApi(JSON.parse(authStorage))
    }
  }

  useEffect(() => {
    console.log('useEFFECT $$')
    getLocal()
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
        {/* Group */}
        <Card className='card-statistics'>
          <CardHeader>
            <CardTitle tag='h4'>สรุป</CardTitle>
            
          </CardHeader>
          <CardBody className='statistics-body'>
          
            <Row>
              <Col>
                <div className='d-flex align-items-center'>
                  <Avatar color='light-success' icon={<ShoppingCart size={24} />} className='me-2' />
                  <div className='my-auto'>
                    <h4 className='fw-bolder mb-0'>{storedata.data.length}</h4>
                    <CardText className='font-small-3 mb-0'>จำนวนร้านค้า</CardText>
                  </div>
                </div>
              </Col>    
              <Col>
                <div className='d-flex align-items-center'>
                  <Avatar color='light-success' icon={<ShoppingCart size={24} />} className='me-2' />
                  <div className='my-auto'>
                    <h4 className='fw-bolder mb-0'>{storedataimg.data.length}</h4>
                    <CardText className='font-small-3 mb-0'>จำนวนรูปภาพร้านค้า</CardText>
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
