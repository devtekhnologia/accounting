import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import cashflow_image from 'src/assets/images/admin_dashboard_icons/Cashflow image2.png';
import income_expense_image from 'src/assets/images/admin_dashboard_icons/income_and_expense.png';
import pie_chart_image from 'src/assets/images/admin_dashboard_icons/pie_chart_image.png';

import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from 'src/context/UserContextProvider';
import { api_url } from 'src/api/APIURL';

const AdminDashboard = () => {

  const { user } = useContext(UserContext);
  const userId = user.userId;
  useEffect(() => {
    console.log(userId);

  }, [userId])

  const [total_pay, setTotal_Pay] = useState('');
  const [total_rec, setTotal_Rec] = useState('');

  const fetchTotalAmt = async () => {
    try {
      const payresponse = await fetch(`${api_url}/api/users/show_total_payment_amt/${userId}`);
      const recresponse = await fetch(`${api_url}/api/users/show_total_receipt_amt/${userId}`);
      

      if (!payresponse.ok) {
        throw new Error('Failed to fetch data');
      }
      if (!recresponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const pay_amt = await payresponse.json();
      const rec_amt = await recresponse.json();
      console.log(pay_amt);
      console.log(rec_amt);

      setTotal_Pay(pay_amt.data);
      setTotal_Rec(rec_amt.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchTotalAmt();

  }, [userId])

  return (
    <Container fluid className='p-0'>
      {/* First Row */}
      <Row>
        
        <Col lg={6} md={12}>
          <Card className="mb-4" id='card_border_color_change'>
            <Card.Header id='bg__color'>Total Payments</Card.Header>
            <Card.Body>
              <Card.Text color='black'>Total Receipt Amount ₹ {total_pay}</Card.Text>
              <ProgressBar now={100} variant="warning" />
              {/* <Row className="mt-3">
                <Col>
                  <Card.Text>Current: ₹5,836.79</Card.Text>
                </Col>
                <Col>
                  <Card.Text>Overdue: ₹244,012.67</Card.Text>
                </Col>
              </Row> */}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} md={12}>
          <Card className="mb-4" id='card_border_color_change'>
            <Card.Header id='bg__color'>Total Receipts</Card.Header>
            <Card.Body>
              <Card.Text>Total Payment Amount ₹ {total_rec}</Card.Text>
              <ProgressBar now={100} variant="warning" />
              {/* <Row className="mt-3">
                <Col>
                  <Card.Text>Current: ₹0.00</Card.Text>
                </Col>
                <Col>
                  <Card.Text>Overdue: ₹372,580.05</Card.Text>
                </Col>
              </Row> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Second Row */}
      <Row>
        <Col lg={12}>
          <Card className="mb-4" id='card_border_color_change'>
            <Card.Header id='bg__color'>Cash Flow</Card.Header>
            <Card.Body>
              <img src={cashflow_image} alt="Cash Flow Chart" style={{ width: '100%', height: 'auto' }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Third Row */}
      <Row>
        <Col lg={6} md={12}>
          <Card className="mb-4" id='card_border_color_change'>
            <Card.Header id='bg__color'>Income and Expense</Card.Header>
            <Card.Body>
              <img src={income_expense_image} alt="Income and Expense" style={{ width: '100%', height: 'auto' }} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} md={12}>
          <Card className="mb-4" id='card_border_color_change'>
            <Card.Header id='bg__color'>Top Expenses</Card.Header>
            <Card.Body>
              <img src={pie_chart_image} alt="Top Expenses" style={{ width: '100%', height: 'auto' }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;
