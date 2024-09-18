import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Form, FormGroup, FormLabel, FormControl, Button, Card, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AdminSidebar, AdminHeader } from 'src/components';
import AllFirms_logo from 'src/assets/images/admin_dashboard_icons/AllFirms.png';
import { UserContext } from 'src/context/UserContextProvider';
import { api_url } from 'src/api/APIURL';
import receipts from 'src/assets/icons/sidebar_icons/receipts.png'
import { CSpinner } from '@coreui/react';
import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/react';


const CreateReceipt = () => {
    const { user } = useContext(UserContext);
    const userId = user.userId;

    const [firmGlPairs, setFirmGlPairs] = useState([]);
    const [selectedToFirmGl, setSelectedToFirmGl] = useState('');
    const [selectedFromFirmGl, setSelectedFromFirmGl] = useState('');

    const [amount, setAmount] = useState('');
    const [remark, setRemark] = useState('');
    const [transactionDate, setTransactionDate] = useState(new Date()); // New state for date
    const [amountError, setAmountError] = useState(''); // New state for amount error
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalButtonText, setModalButtonText] = useState('');

    const [loading, setLoading] = useState(false);
    const [isTransSuccessful, setIsTransSuccessful] = useState(true);

    useEffect(() => {
        const firmGlPairs = async () => {
            try {
                const response = await fetch(`${api_url}/api/users/firm_ledger_pairs/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const resdata = await response.json();
                setFirmGlPairs(resdata.data);
            } catch (error) {
                console.error('Error fetching firms:', error);
            }
        };
        firmGlPairs();
    }, [userId]);


    const handleSaveReceipt = () => {
        // Reset the amount error state
        setAmountError('');

        // Validate amount
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setAmountError('Please enter a valid amount greater than zero.');
            return;
        }

        // Show the confirmation modal
        setShowModal(true);
        setModalTitle('Confirm Receipt');
        setModalMessage('Are you sure you want to create this receipt?');
        setModalButtonText('Confirm');
    };

    const confirmReceipt = async () => {
        if (modalButtonText === 'Close') {
            setShowModal(false);
        } else {

            setLoading(true);
            try {

                const [selectedToFirmId, selectedToGLId] = selectedToFirmGl.split('-');
                const [selectedFromFirmId, selectedFromGLId] = selectedFromFirmGl.split('-');

                const payload = {
                    to_firm_id: selectedToFirmId,
                    to_gl_id: selectedToGLId,
                    from_firm_id: selectedFromFirmId,
                    from_gl_id: selectedFromGLId,
                    amount: Number(amount),
                    remark: remark,
                    trans_type: 'receipt',
                    transaction_date: transactionDate.toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                    }) // Added date to payload
                };

                const response = await fetch(`${api_url}/api/users/receipt/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    setIsTransSuccessful(false);
                    throw new Error('Failed to process receipt');
                }

                const result = await response.json();
                console.log(result);
                console.log(transactionDate);
                console.log(transactionDate.toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                }));

                // Show success modal
                setShowModal(true);
                setModalTitle('Receipt Status');
                setModalMessage('Amount Received !!');
                setModalButtonText('Close');

                refresh();
            } catch (error) {
                setIsTransSuccessful(false);
                console.error('Error processing receipt:', error);

                // Show failure modal
                setShowModal(true);
                setModalTitle('Receipt Status');
                setModalMessage('Receipt Failed !!');
                setModalButtonText('Close');
                refresh();
            } finally {
                setLoading(false);
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
                <div className="flex-grow-1 px-3 px-md-5">
                    <Row className="justify-content-center mb-3">
                        <Col xs={12}>
                            <Card className="card_border_color_change py-5" style={{ borderColor: "white" }}>
                                <Row className='align-items-center'>
                                    <Col style={{ marginLeft: "11px" }}>
                                        <Row className='allfirms_icon_title_row align-items-center'>
                                            <Col className='col-2 col-md-1'>
                                                <img className='sidebar_icon_color' src={receipts} width={25} height={25} alt="All Firms Logo" />
                                            </Col>
                                            <Col className='col-9 col-md-9'>
                                                <h5 className="title_font mb-0" style={{ color: 'white' }}>Create Receipt</h5>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col className="col-5 crearecp_allrecp_but_col">
                                        <Link to={'/all_receipts'}>
                                            <Button id="but_color" className='m-0'>All Receipts</Button>
                                        </Link>
                                    </Col>
                                </Row>

                                <Row className="allfirms_table_row py-5 justify-content-center">
                                    <Col className="make_pay_block_col mb-3 mb-md-0">
                                        <Row className="justify-content-center">
                                            <Col md={12}>
                                                <Card className="bg_color_blue_white">
                                                    <Card.Body>
                                                        <Form>
                                                            <FormGroup className="mb-3" controlId="formTransactionID">
                                                                <FormLabel style={{ fontWeight: 'bold' }}>Transaction :</FormLabel>
                                                            </FormGroup>
                                                            <FormGroup as={Row} className="mb-3" controlId="formTo">
                                                                <FormLabel column className='make_pay_lable' md={3}>To:</FormLabel>
                                                                <Col className='make_pay_select_firm'>
                                                                    <Form.Control
                                                                        as="select"
                                                                        value={selectedToFirmGl}
                                                                        className="form-select"
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
                                                            <FormGroup as={Row} className="mb-3" controlId="formFrom">
                                                                <FormLabel column className='make_pay_lable' md={3}>From:</FormLabel>
                                                                <Col className='make_pay_select_firm'>
                                                                    <Form.Control
                                                                        as="select"
                                                                        value={selectedFromFirmGl}
                                                                        className="form-select"
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
                                                            <FormGroup as={Row} className="mb-3" controlId="formAmount">
                                                                <FormLabel column className='make_pay_lable' md={3}>Amount:</FormLabel>
                                                                <Col sm={4}>
                                                                    <FormControl
                                                                        type="text"
                                                                        placeholder='Enter Amount'
                                                                        value={amount}
                                                                        onChange={(e) => setAmount(e.target.value)}
                                                                    />
                                                                    {amountError && <p style={{ color: 'red' }}>{amountError}</p>} {/* Display the amount error */}
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
                                                                <FormLabel column md={3}>Remark:</FormLabel>
                                                                <Col sm={9}>
                                                                    <FormControl
                                                                        type="text"
                                                                        placeholder="Enter Remark"
                                                                        value={remark}
                                                                        onChange={(e) => setRemark(e.target.value)}
                                                                    />
                                                                </Col>
                                                            </FormGroup>

                                                        </Form>
                                                    </Card.Body>
                                                </Card>
                                                <Row className='justify-content-center align-content-center mt-3 cf_acc_bt_row'>
                                                    <Button id="but_color" onClick={handleSaveReceipt}>Create receipt</Button>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Modal Component */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>

                {loading ? (
                    <div className="d-flex justify-content-center">
                        <CSpinner color="success" />
                    </div>
                ) : !isTransSuccessful ? (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{modalTitle}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <Alert
                                status='error'
                                variant='subtle'
                                flexDirection='column'
                                alignItems='center'
                                justifyContent='center'
                                textAlign='center'
                                height='200px'
                            >
                                <AlertIcon boxSize='40px' mr={0} />
                                <AlertTitle mt={4} mb={1} fontSize='lg'>
                                    {modalMessage}
                                </AlertTitle>
                            </Alert>
                        </Modal.Body>
                        <Modal.Footer>
                            {modalButtonText === 'Confirm' ? (
                                <>
                                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                                    <Button id="but_color" onClick={confirmReceipt}>{modalButtonText}</Button>
                                </>
                            ) : (
                                <Button id="but_color" onClick={() => setShowModal(false)}>{modalButtonText}</Button>
                            )}
                        </Modal.Footer>
                    </>

                ) : (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{modalTitle}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <Alert
                                status='success'
                                variant='subtle'
                                flexDirection='column'
                                alignItems='center'
                                justifyContent='center'
                                textAlign='center'
                                height='200px'
                            >
                                {modalTitle === 'Confirm Receipt' ? (<></>
                                ) : (
                                    <AlertIcon boxSize='40px' mr={0} />
                                )}
                                <AlertTitle mt={4} mb={1} fontSize='lg'>
                                    {modalMessage}
                                </AlertTitle>
                            </Alert>
                        </Modal.Body>
                        <Modal.Footer>
                            {modalButtonText === 'Confirm' ? (
                                <>
                                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                                    <Button id="but_color" onClick={confirmReceipt}>{modalButtonText}</Button>
                                </>
                            ) : (
                                <Button id="but_color" onClick={() => setShowModal(false)}>{modalButtonText}</Button>
                            )}
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default CreateReceipt;
