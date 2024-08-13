import React from 'react';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import cashflow_image from 'src/assets/images/admin_dashboard_icons/Cashflow image2.png';
import income_expense_image from 'src/assets/images/admin_dashboard_icons/income_and_expense.png';
import pie_chart_image from 'src/assets/images/admin_dashboard_icons/pie_chart_image.png';

import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  return (
    <Container fluid className='p-0'>
      {/* First Row */}
      <Row>
        <Col lg={6} md={12}>
          <Card className="mb-4" id='card_border_color_change'>
            <Card.Header id='bg__color'>Total Receivables</Card.Header>
            <Card.Body>
              <Card.Text>Total Unpaid Invoices ₹372,580.05</Card.Text>
              <ProgressBar now={100} variant="warning" />
              <Row className="mt-3">
                <Col>
                  <Card.Text>Current: ₹0.00</Card.Text>
                </Col>
                <Col>
                  <Card.Text>Overdue: ₹372,580.05</Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} md={12}>
          <Card className="mb-4" id='card_border_color_change'>
            <Card.Header id='bg__color'>Total Payables</Card.Header>
            <Card.Body>
              <Card.Text>Total Unpaid Bills ₹249,849.46</Card.Text>
              <ProgressBar now={100} variant="warning" />
              <Row className="mt-3">
                <Col>
                  <Card.Text>Current: ₹5,836.79</Card.Text>
                </Col>
                <Col>
                  <Card.Text>Overdue: ₹244,012.67</Card.Text>
                </Col>
              </Row>
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
