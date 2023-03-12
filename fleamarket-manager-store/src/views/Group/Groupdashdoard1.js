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
  import Cleave from 'cleave.js/react'
  import { useHistory } from "react-router-dom"
  
  const Groupdashdoard = () => {
    const history = useHistory()
    console.log(history)
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
        // history.push('/home')
      }
    }
    getLocal()
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Groupdashdoard 🚀</CardTitle>
          </CardHeader>
          <CardBody>
            <CardText>All the best for your new project.</CardText>
            <CardText>
              Please make sure to read our{" "}
              <CardLink
                href="https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation/"
                target="_blank"
              >
                Template Documentation
              </CardLink>{" "}
              to understand where to go from here and how to use our template.
            </CardText>
          </CardBody>
        </Card>
        <Card className="card-payment">
          <CardHeader>
            <CardTitle tag="h4">Pay Amount</CardTitle>
            <CardTitle className="text-primary" tag="h4">
              $455.60
            </CardTitle>
          </CardHeader>
          <CardBody>
            <Form className="form">
              <Row>
                <Col sm="12" className="mb-2">
                  <Label className="form-label" for="payment-card-number">
                    Card Number
                  </Label>
                  <Cleave
                    className="form-control"
                    placeholder="2133 3244 4567 8921"
                    options={{ creditCard: true }}
                    id="payment-card-number"
                  />
                </Col>
                <Col sm="6" className="mb-2">
                  <Label className="form-label" for="payment-expiry">
                    Expiry
                  </Label>
                  <Cleave
                    className="form-control"
                    placeholder="MM / YY"
                    options={{
                      date: true,
                      delimiter: "/",
                      datePattern: ["Y", "m"]
                    }}
                    id="payment-expiry"
                  />
                </Col>
                <Col sm="6" className="mb-2">
                  <Label className="form-label" for="payment-cvv">
                    CVV / CVC
                  </Label>
                  <Input type="number" placeholder="123" id="payment-cvv" />
                </Col>
                <Col sm="12" className="mb-2">
                  <Label className="form-label" for="payment-input-name">
                    Input Name
                  </Label>
                  <Input placeholder="Curtis Stone" id="payment-input-name" />
                </Col>
                <Col className="d-grid" sm="12">
                  <Button color="primary">Make Payment</Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    )
  }
  
  export default Groupdashdoard
  