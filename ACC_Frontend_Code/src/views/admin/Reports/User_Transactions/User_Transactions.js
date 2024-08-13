import { CButton, CCard, CCol, CImage, CRow } from '@coreui/react'
import React from 'react'
import { AdminHeader, AdminSidebar } from 'src/components'
import AllFirms_logo from 'src/assets/images/admin_dashboard_icons/AllFirms.png';
import { Col, Form, FormControl, FormGroup, FormLabel, Row, Button, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const User_Transactions = () => {
  return (
    <div>
      <AdminSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AdminHeader />
        <div className="body flex-grow-1 px-5">
          <>
            <CRow className='justify-content-center mb-3'>
              <CCol className='col-md-12'>
                <CCard className='card_border_color_change py-5' style={{ borderColor: "white" }}>
                  <CRow className='allfirms_title_mainrow'>
                    <CCol className='col-md-9' style={{ marginLeft: "10px" }}>
                      <CRow className='allfirms_title_row py-1 align-items-center'>
                        <CCol className='col-md-1'>
                          <CImage className='' src={AllFirms_logo} width={25} height={25} />
                        </CCol>
                        <CCol className='col-md-3'>
                          <h4>
                          User Transactions
                          </h4>
                        </CCol>
                      </CRow>
                    </CCol>
                    <CCol className='col-md-2 align-content-center justify-content-end'>
                      <Link to={'/make_transfer'}>
                        <CButton id="but_color">
                          Make A Transfer
                        </CButton>
                      </Link>
                    </CCol>
                  </CRow>
                  <CRow className='allfirms_table_row py-5 justify-content-center'>
                    <CCol>
                      <CRow className='justify-content-center'>
                        <CCol className='col-md-2'>
                          <Form>
                            <FormGroup as={Row} className="mb-3" controlId="formUserType">
                              <Col>
                                <Form.Check
                                  type="radio"
                                  label="User"
                                  name="userType"
                                  id="firm"
                                  inline
                                  defaultChecked
                                />
                              </Col>
                            </FormGroup>
                          </Form>
                        </CCol>
                      </CRow>

                      <CRow className='justify-content-center'>
                        <CCol md={5}>
                          <Form>
                            <FormGroup as={Row} className="mb-3">
                              <Col sm={12}>
                                <Form.Control as="select">
                                  <option>Name</option>
                                </Form.Control>
                              </Col>

                            </FormGroup>
                          </Form>
                        </CCol>
                      </CRow>

                      <CRow>
                        <Col md={12}>
                          <Form>
                            <Card className="mb-3">
                              <Card.Header className="text-white" id='bg__color' >Transactions</Card.Header>
                              <Card.Body>
                                <FormGroup as={Row} className="mb-3">
                                  <Col sm={3}>
                                    <Form.Control as="select">
                                      <option>Filter By</option>
                                    </Form.Control>
                                  </Col>
                                  <Col sm={3}>
                                    <Form.Control type="date" placeholder="Date" />
                                  </Col>

                                  <Col sm={3} style={{ justifyContent: 'end' }}>
                                    <Form.Control type="text" placeholder="Total Payment Amount : 2154.00" />
                                  </Col>
                                </FormGroup>

                                <Table striped bordered hover responsive>
                                  <thead>
                                    <tr>
                                      <th>Sr.No</th>
                                      <th>Transaction Details</th>
                                      <th>With</th>
                                      <th>Cr/Dr</th>
                                      <th>Date</th>
                                      <th>Details</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {/* Add your data rows here */}
                                  </tbody>
                                </Table>
                              </Card.Body>
                            </Card>
                          </Form>
                        </Col>
                      </CRow>
                    </CCol>

                  </CRow>
                </CCard>
              </CCol>
            </CRow>
          </>
        </div>
      </div>
    </div>
  )
}

export default User_Transactions;
