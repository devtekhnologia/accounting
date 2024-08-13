import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Form, FormGroup, FormLabel, FormControl, Button, Card, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AllFirms_logo from 'src/assets/images/admin_dashboard_icons/AllFirms.png';
import { UserContext } from 'src/context/UserContextProvider';
import { api_url } from 'src/api/APIURL';
import { FirmusrHeader, FirmusrSidebar } from 'src/components';
import receipts from 'src/assets/icons/sidebar_icons/receipts.png'


const User_CreateReceipt = () => {
    const { user } = useContext(UserContext);
    const userId = user.userId;

    const [firms2, setFirms2] = useState([]);
    const [firms, setFirms] = useState([]);
    const [selectedFromFirmId, setSelectedFromFirmId] = useState('');
    const [selectedToFirmId, setSelectedToFirmId] = useState('');
    const [fromGeneralLedgers, setFromGeneralLedgers] = useState([]);
    const [toGeneralLedgers, setToGeneralLedgers] = useState([]);
    const [selectedFromGLId, setSelectedFromGLId] = useState('');
    const [selectedToGLId, setSelectedToGLId] = useState('');
    const [amount, setAmount] = useState('');
    const [remark, setRemark] = useState('');
    const [loadingFromGL, setLoadingFromGL] = useState(false);
    const [loadingToGL, setLoadingToGL] = useState(false);
    const [amountError, setAmountError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalButtonText, setModalButtonText] = useState('');

    useEffect(() => {
        const fetchFirms = async () => {
            try {
                const response = await fetch(`${api_url}/api/users/get_all_firms_by_adding_user/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const resdata = await response.json();
                setFirms2(resdata.data);
            } catch (error) {
                console.error('Error fetching firms:', error);
            }
        };
        fetchFirms();
    }, [userId]);

    useEffect(() => {
        const fetchFirms = async () => {
            try {
                const response = await fetch(`${api_url}/api/users/get_all_firms_by_user/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const resdata = await response.json();
                setFirms(resdata.data);
            } catch (error) {
                console.error('Error fetching firms:', error);
            }
        };
        fetchFirms();
    }, [userId]);

    const fetchGeneralLedgers = async (firm_id) => {
        try {
            const response = await fetch(`${api_url}/api/users/get_general_ledgers/${firm_id}`);
            if (!response.ok) {
                throw new Error('No GLs here');
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching data of GLs:', error);
        }
    };

    useEffect(() => {
        const loadGeneralLedgers = async () => {
            if (selectedFromFirmId) {
                setLoadingFromGL(true);
                const generalLedgers = await fetchGeneralLedgers(selectedFromFirmId);
                setFromGeneralLedgers(generalLedgers);
                setLoadingFromGL(false);
            }
        };
        loadGeneralLedgers();
    }, [selectedFromFirmId]);

    useEffect(() => {
        const loadGeneralLedgers = async () => {
            if (selectedToFirmId) {
                setLoadingToGL(true);
                const generalLedgers = await fetchGeneralLedgers(selectedToFirmId);
                setToGeneralLedgers(generalLedgers);
                setLoadingToGL(false);
            }
        };
        loadGeneralLedgers();
    }, [selectedToFirmId]);

    const handleSaveReceipt = () => {
        // Reset the amount error state
        setAmountError('');

        // Validate amount
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setAmountError('Please enter a valid amount greater than zero.');
            return;
        }

        // Set up the confirmation modal
        setModalTitle('Confirm Receipt');
        setModalMessage('Are you sure you want to proceed with this receipt?');
        setModalButtonText('Confirm Receipt');
        setShowModal(true);
    };

    const confirmReceipt = async () => {
        try {
            const payload = {
                to_firm_id: selectedToFirmId,
                to_gl_id: selectedToGLId,
                from_firm_id: selectedFromFirmId,
                from_gl_id: selectedFromGLId,
                amount: Number(amount),
                remark: remark
            };

            const response = await fetch(`${api_url}/api/users/receipt/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to process receipt');
            }

            const result = await response.json();
            console.log(result);
            setModalTitle('Amount Received');
            setModalMessage('The amount has been successfully received.');
            setModalButtonText('Close');
        } catch (error) {
            console.error('Error processing receipt:', error);
            setModalTitle('Receipt Failed');
            setModalMessage('There was an error processing the receipt. Please try again.');
            setModalButtonText('Close');
        } finally {
            setShowModal(true);
        }
    };

    return (
        <div>
            <FirmusrSidebar />
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                <FirmusrHeader />
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
                                    <Col className="col-4 makepay_allpay_but_col">
                                        <Link to={'/user_allreceipts'}>
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
                                                                <FormLabel>Transaction :</FormLabel>
                                                            </FormGroup>
                                                            <FormGroup as={Row} className="mb-3" controlId="formTo">
                                                                <FormLabel column className='make_pay_lable' md={3}>To:</FormLabel>
                                                                <Col className='make_pay_select_firm'>
                                                                    <Form.Control
                                                                        as="select"
                                                                        value={selectedToFirmId}
                                                                        className="form-select"
                                                                        onChange={(e) => setSelectedToFirmId(e.target.value)}
                                                                    >
                                                                        <option value="">Select Firm</option>
                                                                        {firms.map((firm) => (
                                                                            <option key={firm.firm_id} value={firm.firm_id}>{firm.firm_name}</option>
                                                                        ))}
                                                                    </Form.Control>
                                                                </Col>
                                                                <Col className='make_pay_select_acc'>
                                                                    <Form.Control
                                                                        as="select"
                                                                        value={selectedToGLId}
                                                                        className="form-select"
                                                                        onChange={(e) => setSelectedToGLId(e.target.value)}
                                                                        disabled={!selectedToFirmId || loadingToGL}
                                                                    >
                                                                        <option value="">Select Your Firm Account</option>
                                                                        {toGeneralLedgers.map((gl) => (
                                                                            <option key={gl.gl_id} value={gl.gl_id}>{gl.gl_name}</option>
                                                                        ))}
                                                                    </Form.Control>
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup as={Row} className="mb-3" controlId="formFrom">
                                                                <FormLabel column className='make_pay_lable' md={3}>From:</FormLabel>
                                                                <Col className='make_pay_select_firm'>
                                                                    <Form.Control
                                                                        as="select"
                                                                        value={selectedFromFirmId}
                                                                        className="form-select"
                                                                        onChange={(e) => setSelectedFromFirmId(e.target.value)}
                                                                    >
                                                                        <option value="">Select Firm</option>
                                                                        {firms2.map((firm) => (
                                                                            <option key={firm.firm_id} value={firm.firm_id}>{firm.firm_name}</option>
                                                                        ))}
                                                                    </Form.Control>
                                                                </Col>
                                                                <Col className='make_pay_select_acc'>
                                                                    <Form.Control
                                                                        as="select"
                                                                        value={selectedFromGLId}
                                                                        className="form-select"
                                                                        onChange={(e) => setSelectedFromGLId(e.target.value)}
                                                                        disabled={!selectedFromFirmId || loadingFromGL}
                                                                    >
                                                                        <option value="">Select Your Firm Account</option>
                                                                        {fromGeneralLedgers.map((gl) => (
                                                                            <option key={gl.gl_id} value={gl.gl_id}>{gl.gl_name}</option>
                                                                        ))}
                                                                    </Form.Control>
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup as={Row} className="mb-3" controlId="formAmount">
                                                                <FormLabel column xs={12} sm={3}>Amount:</FormLabel>
                                                                <Col xs={12} sm={4}>
                                                                    <FormControl
                                                                        type="text"
                                                                        placeholder="Enter Amount"
                                                                        value={amount}
                                                                        onChange={(e) => setAmount(e.target.value)}
                                                                        isInvalid={!!amountError}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {amountError}
                                                                    </Form.Control.Feedback>
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup as={Row} className="mb-3" controlId="formRemark">
                                                                <FormLabel column xs={12} sm={3}>Remark:</FormLabel>
                                                                <Col xs={12} sm={9}>
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

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalMessage}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        {modalButtonText === 'Confirm Receipt' ? 'Cancel' : 'Close'}
                    </Button>
                    {modalButtonText === 'Confirm Receipt' && (
                        <Button variant="primary" onClick={confirmReceipt}>
                            {modalButtonText}
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default User_CreateReceipt;
