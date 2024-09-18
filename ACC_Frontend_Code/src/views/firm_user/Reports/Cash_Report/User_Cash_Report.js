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
import reports from 'src/assets/icons/sidebar_icons/reports.png'


const User_Cash_Report = () => {
  const { user } = useContext(UserContext);
  const userId = user.userId;

  const [firmGlPairs, setFirmGlPairs] = useState([]);
  const [firms, setFirms] = useState([]);
  const [selectedFirmGl, setSelectedFirmGl] = useState('');
  const [selectedFirmId, setSelectedFirmId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalBalance, setTotalBalance] = useState(null);
  const [hasTransactions, setHasTransactions] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedStartMonth, setSelectedStartMonth] = useState(null); // Default to the start month
  const [selectedEndMonth, setSelectedEndMonth] = useState(null); // Default to the end month
  const [selectedYear, setSelectedYear] = useState(null); // Default to the current year
  const [filterType, setFilterType] = useState("byDate"); // State to store selected filter type
  const [transaction_Type, setTransaction_Type] = useState('');


  useEffect(() => {
    const fetchFirmGlPairs = async () => {
      try {
        const response = await fetch(`${api_url}/api/users/cash_firm_ledger_pairs/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const resdata = await response.json();
        setFirmGlPairs(resdata.data);
      } catch (error) {
        console.error('Error fetching firm-GL pairs:', error);
      }
    };
    fetchFirmGlPairs();
  }, [userId]);


  // useEffect(() => {
  //   const fetchFirms = async () => {
  //     try {
  //       const response = await fetch(`${api_url}/api/users/get_all_firms_by_user/${userId}`);
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch firms');
  //       }
  //       const resdata = await response.json();
  //       setFirms(resdata.data);
  //     } catch (error) {
  //       console.error('Error fetching firms:', error);
  //     }
  //   };
  //   fetchFirms();
  // }, [userId]);

  useEffect(() => {
    console.log("selfirm_id and selgl_id :", selectedFirmId, selectedFirmGl,)
    fetchTransactions();
  }, [selectedFirmId, selectedFirmGl, startDate, endDate]);

  const fetchTransactions = async () => {
      setLoading(true);
      try {

        // const firm_id = selectedFirmId;
        // const gl_id = selectedFirmGl;
        // let url = `${api_url}/api/users/ledger_report/${firm_id}/${gl_id}`;

        let url;
        if (selectedFirmId || selectedFirmGl) {
          const firm_id = selectedFirmId;
          const gl_id = selectedFirmGl;

          url = `${api_url}/api/users/ledger_report/${firm_id}/${gl_id}`;
          setTransaction_Type("type");
        } else {
          url = `${api_url}/api/users/cash_report_by_user/${userId}`;
          setTransaction_Type("trans_type");
        }


        if (filterType === "byDate") {

          if (startDate) {
            const formattedStartDate = startDate.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
            url += `?startDate=${formattedStartDate}`;
          }
          if (endDate) {
            // Ensure endDate includes time 23:59:59 of the selected day
            const endDateTime = new Date(endDate);
            endDateTime.setHours(23, 59, 59, 999); // Set time to 23:59:59.999
            const formattedEndDate = endDateTime.toISOString().split('T')[0] + 'T23:59:59'; // Format as YYYY-MM-DDTHH:MM:SS
            url += startDate ? `&endDate=${formattedEndDate}` : `?endDate=${formattedEndDate}`;
          }
        } else if (filterType === "byMonth") {
          let startDate, endDate;

          if (selectedStartMonth) {
            const startYear = selectedStartMonth.getFullYear();
            const startMonth = selectedStartMonth.getMonth() + 1; // Correct month

            // Calculate the start date
            startDate = new Date(startYear, startMonth - 1, 2).toISOString().split('T')[0];
            url += `?startDate=${startDate}`;
          }

          if (selectedEndMonth) {
            const endYear = selectedEndMonth.getFullYear();
            const endMonth = selectedEndMonth.getMonth() + 1; // Correct month

            // Calculate the last day of the end month and set time to 23:59:59
            const endDateObj = new Date(endYear, endMonth, 0);
            endDate = `${endYear}-${endMonth.toString().padStart(2, '0')}-${endDateObj.getDate()}T23:59:59`;
            url += startDate ? `&endDate=${endDate}` : `?endDate=${endDate}`;


          }


        } else if (filterType === "by6Months") {

          if (selectedStartMonth) {

            const year = selectedStartMonth.getFullYear();
            const month = selectedStartMonth.getMonth() + 1; // Correct Month

            // Calculate the start date as the 1st day of the selected month
            const startDate = new Date(year, month - 1, 2).toISOString().split('T')[0];

            // Calculate the end date as the last day of the month 5 months after the selected month
            const endDateObj = new Date(year, month + 5, 0); // 0 sets the date to the last day of the previous month

            const endYear = endDateObj.getFullYear();
            const endMonth = endDateObj.getMonth() + 1; // Convert to 1-based month index
            const endDate = `${endYear}-${endMonth.toString().padStart(2, '0')}-${endDateObj.getDate()}T23:59:59`;

            url += `?startDate=${startDate}&endDate=${endDate}`;

          }

        } else if (filterType === "byYear") {
          if (selectedYear) {
            const year = selectedYear.getFullYear();

            // Start date: January 1st of the selected year
            const startDate = `${year}-01-01T00:00:00`;

            // End date: December 31st of the selected year, set time to 23:59:59
            const endDate = `${year}-12-31T23:59:59`;


            // Append startDate and endDate to the URL
            url += `?startDate=${startDate}&endDate=${endDate}`;
          }
        }

        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);

        const response = await fetch(url);
        const resdata = await response.json();
        console.log(resdata)
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
                          <h5 className="title_font mb-0" style={{ color: 'white' }}>Cash Report</h5>
                        </CCol>
                      </CRow>
                    </CCol>

                  </CRow>

                  <CRow className='allfirms_table_row py-5 justify-content-center'>
                    <CCol>
                      {/* <CRow className='justify-content-center'>
                        <CCol className='col-md-2'>
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
                                  value={`${selectedFirmId}-${selectedFirmGl}`}  // Combine firm_id and gl_id for the selected value
                                  className='form-select'
                                  onChange={(e) => {
                                    const [firm_id, gl_id] = e.target.value.split('-');
                                    setSelectedFirmGl(gl_id);
                                    setSelectedFirmId(firm_id);
                                    // You can also use the gl_id if needed
                                    console.log('Selected firm_id:', firm_id);
                                    console.log('Selected gl_id:', gl_id);
                                  }}
                                  style={{ maxWidth: '100%' }}  // Adjust the width as needed
                                >
                                  <option value="">Select Firm - Account</option>
                                  {firmGlPairs.map((pair) => (
                                    <option key={`${pair.firm_id}-${pair.gl_id}`} value={`${pair.firm_id}-${pair.gl_id}`}>
                                      {pair.firm_name} - {pair.gl_name}
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
                              Firm Balance: {totalBalance}
                            </div>
                          )}
                        </CCol>
                      </CRow>

                      <CRow className='justify-content-center mb-3'>
                        <CCol className="allpay_datefil_col">
                          <FormGroup as={Row} className="mb-3">
                            <Col md={11} className="justify-content-start">
                              <FormControl
                                as="select"
                                value={filterType}
                                className="form-select"
                                onChange={(e) => setFilterType(e.target.value)}
                                style={{ maxWidth: '100%' }}
                              >
                                <option value="byDate">By Date</option>
                                <option value="byMonth">By Month</option>
                                <option value="by6Months">By 6 Month</option>
                                <option value="byYear">By Year</option>
                              </FormControl>
                            </Col>
                          </FormGroup>
                        </CCol>
                      </CRow>

                      <CRow className='justify-content-center mb-3'>

                        <CCol className="allpay_datefil_col">
                          {filterType === "byDate" && (
                            <>
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
                            </>
                          )}

                          {filterType === "byMonth" && (
                            <>
                              <DatePicker
                                selected={selectedStartMonth}
                                onChange={(date) => setSelectedStartMonth(date || new Date())} // Update only if a month is selected
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                placeholderText="Select Start Month"
                                className="form-control allpay_datefil"
                                md={2}
                              />
                              <DatePicker
                                selected={selectedEndMonth}
                                onChange={(date) => setSelectedEndMonth(date || new Date())} // Update only if a month is selected
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                placeholderText="Select End Month"
                                className="form-control allpay_datefil"
                                md={2}
                              />
                            </>
                          )}

                          {filterType === "by6Months" && (
                            <DatePicker
                              selected={selectedStartMonth}
                              onChange={(date) => setSelectedStartMonth(date || new Date())} // Update only if a month is selected
                              dateFormat="MM/yyyy"
                              showMonthYearPicker
                              placeholderText="Select Start Month"
                              className="form-control allpay_datefil"
                              md={2}
                            />
                          )}

                          {filterType === "byYear" && (
                            <DatePicker
                              selected={selectedYear}
                              onChange={(date) => setSelectedYear(date || new Date())}
                              showYearPicker
                              dateFormat="yyyy"
                              placeholderText="Select Year"
                              className="form-control allpay_datefil"
                            />
                          )}

                          <CButton onClick={fetchTransactions} id="fil_but_color" className='mt-0 allpay_datefil_but'>Filter</CButton>
                        </CCol>
                        
                        {/* <CCol className="allpay_datefil_col">
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
                        </CCol> */}
                      </CRow>

                      <CRow>
                        <Col md={12}>
                          <Form>
                            <Card className="mb-3">
                              <Card.Header className="text-white" id='bg__color'>Transactions</Card.Header>
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
                                        <th>Account</th>
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

export default User_Cash_Report;