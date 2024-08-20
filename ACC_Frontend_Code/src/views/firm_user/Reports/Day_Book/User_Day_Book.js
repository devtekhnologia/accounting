import React, { useState, useEffect, useContext } from 'react';
import { CButton, CCard, CCol, CImage, CRow } from '@coreui/react';
import { AdminHeader, AdminSidebar, FirmusrHeader, FirmusrSidebar } from 'src/components';
import { Col, Form, FormControl, FormGroup, Row, Card, Table } from 'react-bootstrap';
import { UserContext } from 'src/context/UserContextProvider';
import { api_url } from 'src/api/APIURL';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import reports from 'src/assets/icons/sidebar_icons/reports.png';

const User_Day_Book = () => {
  const { user } = useContext(UserContext);
  const userId = user.userId;
  const [firms, setFirms] = useState([]);
  const [selectedFirmId, setSelectedFirmId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalBalance, setTotalBalance] = useState(null);
  const [hasTransactions, setHasTransactions] = useState(true);
  const [startDate, setStartDate] = useState(new Date()); // Automatically set to today's date
  const [endDate, setEndDate] = useState(new Date()); // Automatically set to today's date
  const [transaction_Type, setTransaction_Type] = useState('');


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

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let url;
      if (selectedFirmId) {
        const firm_id = selectedFirmId;
        url = `${api_url}/api/users/show_firm_all_transactions/${firm_id}/transactions`;
        setTransaction_Type("type");
      } else {
        url = `${api_url}/api/users/show_day_book_transactions/${userId}`;
        setTransaction_Type("trans_type");
      }

      // Format dates as YYYY-MM-DD
      const formattedStartDate = startDate.toLocaleDateString('en-CA');
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1); // Include the end date in the filter
      const formattedEndDate = adjustedEndDate.toLocaleDateString('en-CA');

      url += `?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;

      const response = await fetch(url);
      const resdata = await response.json();
      if (!response.ok || resdata.status === false) {
        setHasTransactions(false);
        setTransactions([]);
        return;
      }
      setTransactions(resdata.data);
      console.log(resdata.data);
      setHasTransactions(resdata.data.length > 0);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setHasTransactions(false);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div>
      <FirmusrSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <FirmusrHeader />
        <div className="body flex-grow-1 px-2">
          <>
            <CRow className='justify-content-center mb-3'>
              <CCol className='col-md-12'>
                <CCard className='card_border_color_change py-5' style={{ borderColor: "white" }}>
                  <CRow className='align-items-center'>
                    <CCol style={{ marginLeft: "11px" }} className='col-10'>
                      <CRow className='allfirms_icon_title_row align-items-center'>
                        <CCol className='col-2 col-md-1'>
                          <img className='sidebar_icon_color' src={reports} width={25} height={25} alt="All Firms Logo" />
                        </CCol>
                        <CCol className='col-7 col-md-7'>
                          <h5 className="title_font mb-0" style={{ color: 'white' }}>Transactions</h5>
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow className='allfirms_table_row py-5 justify-content-center'>
                    <CCol>
                      <CRow className='justify-content-center mb-3'>
                        <CCol className="justify-content-start justify-content-md-start facc_sel_firm_col">
                          <Form>
                            <FormGroup as={Row} className="mb-3">
                              <Col md={11} className="justify-content-start justify-content-md-start">
                                <FormControl
                                  as="select"
                                  value={selectedFirmId}
                                  className="form-select"
                                  onChange={(e) => setSelectedFirmId(e.target.value)}
                                  style={{ maxWidth: '100%' }}  // Adjust the width as needed
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
                              padding: '10px',
                              borderRadius: '5px'
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
                            onChange={(date) => setStartDate(date || new Date())} // Update only if a date is selected
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Start Date"
                            className="form-control allpay_datefil"
                            md={2}
                          />
                          <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date || new Date())} // Update only if a date is selected
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
                          <Form>
                            <Card className="mb-3">
                              <Card.Header className="text-white" id='bg__color'>Firm Transactions</Card.Header>
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
                                        <th>Transaction of Firm</th>
                                        <th>From/To</th>
                                        <th>Transaction with Firm</th>
                                        <th>Cr/Dr Amount</th>
                                        <th>Date</th>
                                        <th>Remark</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {transactions.map((transaction, index) => (
                                        <tr key={transaction.transaction_id}>
                                          <td>{index + 1}</td>
                                          {transaction[transaction_Type] === 'payment' ? (
                                            <td>{transaction.from_firm_name} - {transaction.from_gl_name}</td>
                                          ) : (
                                            <td>{transaction.to_firm_name} - {transaction.to_gl_name}</td>
                                          )}

                                          {transaction[transaction_Type] === 'payment' ? (
                                            <td style={{ fontWeight: "500" }}>To</td>
                                          ) : (
                                            <td style={{ fontWeight: "500" }}>From</td>
                                          )}

                                          {transaction[transaction_Type] === 'payment' ? (
                                            <td>{transaction.to_firm_name} - {transaction.to_gl_name}</td>
                                          ) : (
                                            <td>{transaction.from_firm_name} - {transaction.from_gl_name}</td>
                                          )}

                                          <td style={{ color: transaction[transaction_Type] === 'payment' ? "red" : "green" }}>{transaction[transaction_Type] === 'payment' ? '-' : '+'}{transaction.amount}</td>
                                          <td>{new Date(transaction.transaction_date).toLocaleString()}</td>
                                          <td>{transaction.remark}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                )}
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
  );
};

export default User_Day_Book;
