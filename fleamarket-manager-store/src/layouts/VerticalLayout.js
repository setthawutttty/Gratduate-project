// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'

// ** Menu Items Array
import navigation from '@src/navigation/vertical'
// import navigation2 from '@src/navigation/vertical/indexuser'
import { useHistory } from "react-router-dom"

const VerticalLayout = props => {
  const history = useHistory()
  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])

  // const getLocal = () => {
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
      try {
        console.log(JSON.parse(authStorage).data.message[0].admin_permission)
      } catch {
        
      }
      

      // (JSON.parse(authStorage).data.message[0].admin_permission === 0) ? 
      // return <Link to="/home"/>
      // history.push('/home')
    }
  // }
  // getLocal()

  return (
    // <Layout menuData={(!authStorage) ? null : JSON.parse(authStorage).data.message[0].admin_permission === 0 ? navigation : navigation2} {...props}>
    //   {props.children}
    // </Layout>
    <Layout menuData={navigation} {...props}>
      {props.children}
    </Layout>
  )
  
}

export default VerticalLayout
