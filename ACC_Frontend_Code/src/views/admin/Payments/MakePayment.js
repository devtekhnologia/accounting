import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Form, FormGroup, FormLabel, FormControl, Button, Card, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AdminSidebar, AdminHeader } from 'src/components';
import { UserContext } from 'src/context/UserContextProvider';
import { api_url } from 'src/api/APIURL';
import payments from 'src/assets/icons/sidebar_icons/payments.png';

const MakePayment = () => {
  const { user } = useContext(UserContext);
  const userId = user.userId;

  const [firmGlPairs, setFirmGlPairs] = useState([]);
  const [selectedFromFirmGl, setSelectedFromFirmGl] = useState('');
  const [selectedToFirmGl, setSelectedToFirmGl] = useState('');
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showModalFooter, setShowModalFooter] = useState(false);
  const [modalButtonText, setModalButtonText] = useState('');
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchFirmGlPairs = async () => {
      try {
        const response = await fetch(`${api_url}/api/users/firm_ledger_pairs/${userId}`);
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

  const handleSavePayment = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setValidationMessage('Please enter a valid, positive amount.');
      return;
    }

    setValidationMessage('');
    setShowModal(true);
    setModalTitle('Confirm Payment');
    setModalMessage('Are you sure you want to proceed with this payment?');
    setShowModalFooter(true);
    setModalButtonText('Confirm Payment');
  };

  const confirmPayment = async () => {
    if (modalButtonText === 'Close') {
      setShowModal(false);
    } else {
      try {
        const [selectedFromFirmId, selectedFromGLId] = selectedFromFirmGl.split('-');
        const [selectedToFirmId, selectedToGLId] = selectedToFirmGl.split('-');

        const payload = {
          from_gl_id: selectedFromGLId,
          to_gl_id: selectedToGLId,
          amount: Number(amount),
          from_firm_id: selectedFromFirmId,
          to_firm_id: selectedToFirmId,
          remark: remark,
          trans_type: 'payment',
          transaction_date: transactionDate.toLocaleDateString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          })
        };

        const response = await fetch(`${api_url}/api/users/payment/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          
          throw new Error('Failed to process payment');
        }

        const result = await response.json();
        console.log(result);

        setModalTitle('Payment Status');
        setModalMessage('Payment Successful !!');
        setShowModalFooter(false);
        setModalButtonText('Close');
        refresh();
      } catch (error) {
        console.error('Error processing payment:', error);
        setModalTitle('Payment Status');
        setModalMessage('Payment Failed !!');
        setShowModalFooter(false);
        setModalButtonText('Close');
      }
    }
  };

  const refresh = () => {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div>
      <AdminSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AdminHeader />
        <Container fluid className="flex-grow-1 px-3 px-md-5">
          <Row className='justify-content-center mb-3'>
            <Col md={12}>
              <Card className='card_border_color_change py-5' style={{ borderColor: "white" }}>
                <Row className='align-items-center'>
                  <Col style={{ marginLeft: "11px" }}>
                    <Row className='allfirms_icon_title_row align-items-center'>
                      <Col className='col-2 col-md-1'>
                        <img className='sidebar_icon_color' src={payments} width={25} height={25} alt="All Firms Logo" />
                      </Col>
                      <Col className='col-9 col-md-9'>
                        <h5 className="title_font mb-0" style={{ color: 'white' }}>Make Payment</h5>
                      </Col>
                    </Row>
                  </Col>
                  <Col className="col-5 makepay_allpay_but_col">
                    <Link to={'/all_payments'}>
                      <Button id="but_color" className='m-0'>All Payments</Button>
                    </Link>
                  </Col>
                </Row>

                <Row className='allfirms_table_row py-5 justify-content-center'>
                  <Col className="make_pay_block_col mb-3 mb-md-0">
                    <Row className='justify-content-center'>
                      <Col md={12}>
                        <Card className='bg_color_blue_white'>
                          <Card.Body>
                            <Form>
                              <FormGroup className="mb-3" controlId="formTransactionID">
                                <FormLabel>Transaction :</FormLabel>
                              </FormGroup>
                              <FormGroup as={Row} className="mb-3" controlId="formFrom">
                                <FormLabel column className='make_pay_lable' md={3}>From:</FormLabel>
                                <Col className='make_pay_select_firm'>
                                  <Form.Control
                                    as="select"
                                    value={selectedFromFirmGl}
                                    className='form-select'
                                    onChange={(e) => setSelectedFromFirmGl(e.target.value)}
                                  >
                                    <option value="">Select Firm - Account</option>
                                    {firmGlPairs.map((pair) => (
                                      <option key={`${pair.firm_id}-${pair.gl_id}`} value={`${pair.firm_id}-${pair.gl_id}`}>
                                        {pair.firm_name} - {pair.gl_name}
                                      </option>
                                    ))}
                                  </Form.Control>
                                </Col>
                              </FormGroup>
                              <FormGroup as={Row} className="mb-3" controlId="formTo">
                                <FormLabel column className='make_pay_lable' md={3}>To:</FormLabel>
                                <Col className='make_pay_select_firm'>
                                  <Form.Control
                                    as="select"
                                    value={selectedToFirmGl}
                                    className='form-select'
                                    onChange={(e) => setSelectedToFirmGl(e.target.value)}
                                  >
                                    <option value="">Select Firm - Account</option>
                                    {firmGlPairs.map((pair) => (
                                      <option key={`${pair.firm_id}-${pair.gl_id}`} value={`${pair.firm_id}-${pair.gl_id}`}>
                                        {pair.firm_name} - {pair.gl_name}
                                      </option>
                                    ))}
                                  </Form.Control>
                                </Col>
                              </FormGroup>
                              <FormGroup as={Row} className="mb-3" controlId="formAmount">
                                <FormLabel column className='make_pay_lable' md={3}>Amount:</FormLabel>
                                <Col sm={4}>
                                  <FormControl
                                    type="text"
                                    placeholder="Enter Amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                  />
                                </Col>
                              </FormGroup>
                              <FormGroup as={Row} className="mb-3" controlId="formDate">
                                <FormLabel column className='make_pay_lable' md={3}>Date:</FormLabel>
                                <Col sm={4}>
                                  <DatePicker
                                    selected={transactionDate}
                                    onChange={(date) => setTransactionDate(date)}
                                    showTimeSelect
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    className="form-control"
                                  />
                                </Col>
                              </FormGroup>
                              <FormGroup as={Row} className="mb-3" controlId="formRemark">
                                <FormLabel column className='make_pay_lable' md={3}>Remark:</FormLabel>
                                <Col sm={9}>
                                  <FormControl
                                    type="text"
                                    placeholder="Enter Remark"
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                  />
                                </Col>
                              </FormGroup>
                              <Row className='justify-content-center'>
                                <Col sm={5}>
                                  <Button id="but_color" type="button" onClick={handleSavePayment} className="w-100">
                                    Make Payment
                                  </Button>
                                </Col>
                              </Row>
                            </Form>
                            {validationMessage && <p className="text-danger mt-3">{validationMessage}</p>}
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        {showModalFooter && (
          <Modal.Footer>
            <Button id="but_color" onClick={confirmPayment}>
              {modalButtonText}
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
};

export default MakePayment;
