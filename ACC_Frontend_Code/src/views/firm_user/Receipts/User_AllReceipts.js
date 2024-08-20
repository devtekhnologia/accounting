import React, { useState, useEffect, useContext } from 'react';
import { CButton, CCard, CCol, CImage, CRow } from '@coreui/react';
import { AdminHeader, AdminSidebar, FirmusrHeader, FirmusrSidebar } from 'src/components';
import AllFirms_logo from 'src/assets/images/admin_dashboard_icons/AllFirms.png';
import { Col, Form, FormControl, FormGroup, Row, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserContext } from 'src/context/UserContextProvider';
import { api_url } from 'src/api/APIURL';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import receipts from 'src/assets/icons/sidebar_icons/receipts.png'


const User_AllReceipts = () => {
  const { user } = useContext(UserContext);
  const userId = user.userId;
  const [firms, setFirms] = useState([]);
  const [selectedFirmId, setSelectedFirmId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalBalance, setTotalBalance] = useState(null);
  const [hasTransactions, setHasTransactions] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchFirms = async () => {
      try {
        const response = await fetch(`${api_url}/api/users/get_all_firms_by_user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch firms');
        }
        const resdata = await response.json();
        setFirms(resdata.data);
      } catch (error) {
        console.error('Error fetching firms:', error);
      }
    };
    fetchFirms();
  }, [userId]);

  useEffect(() => {
    fetchTransactions();
  }, [selectedFirmId, startDate, endDate]);

  useEffect(() => {
    const fetchTotalBalance = async () => {
      if (selectedFirmId) {
        try {
          const firm_id = selectedFirmId;
          const response = await fetch(`${api_url}/api/users/firm_total_bal/${firm_id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch total balance');
          }
          const resdata = await response.json();
          setTotalBalance(resdata.data.totalBalance);
        } catch (error) {
          console.error('Error fetching total balance:', error);
        }
      }
    };
    fetchTotalBalance();
  }, [selectedFirmId]);

  const fetchTransactions = async () => {
    if (selectedFirmId) {
      setLoading(true);
      try {
        const to_firm_id = selectedFirmId;
        let url = `${api_url}/api/users/show_receipt_transactions/${to_firm_id}`;

        if (startDate) {
          const formattedStartDate = startDate.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
          url += `?startDate=${formattedStartDate}`;
        }
        if (endDate) {
          const adjustedEndDate = new Date(endDate);
          adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
          const formattedEndDate = adjustedEndDate.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
          url += startDate ? `&endDate=${formattedEndDate}` : `?endDate=${formattedEndDate}`;
        }

        const response = await fetch(url);
        const resdata = await response.json();
        if (!response.ok || resdata.status === false) {
          setHasTransactions(false);
          setTransactions([]);
          return;
        }
        setTransactions(resdata.data);
        setHasTransactions(resdata.data.length > 0);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setHasTransactions(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <FirmusrSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <FirmusrHeader />
        <div className="body flex-grow-1 px-2">
          <CRow className='justify-content-center mb-3'>
            <CCol md={12}>
              <CCard className='card_border_color_change py-3' style={{ borderColor: "white" }}>
                <CRow className='align-items-center'>
                  <CCol style={{ marginLeft: "11px" }}>
                    <CRow className='allfirms_icon_title_row align-items-center'>
                      <CCol className='col-2 col-md-1'>
                        <img className='sidebar_icon_color' src={receipts} width={25} height={25} alt="All Firms Logo" />
                      </CCol>
                      <CCol className='col-10 col-md-7'>
                        <h5 className="title_font mb-0" style={{ color: 'white' }}>All Receipts</h5>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol className="col-5 makepay_allpay_but_col">
                    <Link to={'/user_createreceipt'}>
                      <CButton id="but_color" className='m-0'>Create Receipt</CButton>
                    </Link>
                  </CCol>
                </CRow>

                <CRow className='allfirms_table_row py-3 justify-content-center'>
                  <CCol>
                    {/* <CRow className='justify-content-center'>
                      <CCol md={2}>
                        <Form>
                          <FormGroup as={Row} className="mb-3" controlId="formUserType">
                            <Col>
                              <Form.Check
                                type="radio"
                                label="Firm"
                                name="userType"
                                id="firm"
                                inline
                                defaultChecked
                              />
                              <Form.Check
                                type="radio"
                                label="User"
                                name="userType"
                                id="user"
                                inline
                              />
                            </Col>
                          </FormGroup>
                        </Form>
                      </CCol>
                    </CRow> */}
                    <CRow className='justify-content-center mb-3'>
                      <CCol className="justify-content-start justify-content-md-start facc_sel_firm_col">
                        <Form>
                          <FormGroup as={Row} className="mb-3">
                            <Col md={11} className="justify-content-start justify-content-md-start">
                              {/* <Form.Label className="col-md-5 mb-0">Select Firm</Form.Label> */}
                              <FormControl
                                as="select"
                                value={selectedFirmId}
                                className="form-select"
                                onChange={(e) => setSelectedFirmId(e.target.value)}
                                style={{ maxWidth: '100%' }}
                              >
                                <option value="">Select Firm</option>
                                {firms.map((firm) => (
                                  <option key={firm.firm_id} value={firm.firm_id}>
                                    {firm.firm_name}
                                  </option>
                                ))}
                              </FormControl>
                            </Col>
                          </FormGroup>
                        </Form>
                      </CCol>

                      <CCol className="d-flex align-items-center justify-content-center justify-content-md-end mt-0 mt-md-0 facc_f_bal">
                        {totalBalance !== null && (
                          <div style={{
                            backgroundColor: 'green',
                            color: 'white',
                            padding: '8px',
                            borderRadius: '5px',
                            fontSize: '14px'
                          }}>
                            Firm Total Balance: {totalBalance}
                          </div>
                        )}
                      </CCol>
                    </CRow>

                    <CRow className='justify-content-center mb-3'>
                      <CCol className="allpay_datefil_col">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          placeholderText="Start Date"
                          className="form-control allpay_datefil"
                          md={2}
                        />
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate}
                          placeholderText="End Date"
                          className="form-control allpay_datefil"
                          md={2}
                        />
                        <CButton onClick={fetchTransactions} id="fil_but_color" className='mt-0 allpay_datefil_but'>Filter</CButton>
                      </CCol>
                    </CRow>

                    <CRow>
                      <Col md={12}>
                        <Card className="mb-3">
                          <Card.Header className="text-white" id='bg__color'>Receipt Transactions</Card.Header>
                          <Card.Body>
                            {loading ? (
                              <p>Loading...</p>
                            ) : !hasTransactions ? (
                              <p>No Transactions for this firm</p>
                            ) : (
                              <Table striped bordered hover responsive>
                                <thead>
                                  <tr>
                                    <th>Sr.No</th>
                                    <th>Credit To</th>
                                    <th>Debit From</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Remark</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {transactions.map((transaction, index) => (
                                    <tr key={transaction.transaction_id}>
                                      <td>{index + 1}</td>
                                      <td>{transaction.to_gl_name}</td>
                                      <td>{transaction.from_firm_name} - {transaction.from_gl_name}</td>
                                      <td style={{ color: "green" }}>+{transaction.amount}</td>
                                      <td>{new Date(transaction.transaction_date).toLocaleString()}</td>
                                      <td>{transaction.remark}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    </CRow>
                  </CCol>
                </CRow>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  );
};

export default User_AllReceipts;
