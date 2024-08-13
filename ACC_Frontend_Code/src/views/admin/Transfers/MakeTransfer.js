import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Form, FormGroup, FormLabel, FormControl, Button, Card, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AdminSidebar, AdminHeader } from 'src/components';
import AllFirms_logo from 'src/assets/images/admin_dashboard_icons/AllFirms.png';
import { UserContext } from 'src/context/UserContextProvider';
import { api_url } from 'src/api/APIURL';
import transfers from 'src/assets/icons/sidebar_icons/transfers.png'


const MakeTransfer = () => {
    const { user } = useContext(UserContext);
    const userId = user.userId;

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
    const [errors, setErrors] = useState({}); // State for validation errors
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalButtonText, setModalButtonText] = useState('');

    useEffect(() => {
        const fetchFirms = async () => {
            try {
                const response = await fetch(`${api_url}/api/users/get_all_firms_by_user/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to show firms');
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
                throw new Error('Failed to show GL list');
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching GL list:', error);
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

    const validateAmount = (amount) => {
        const errors = {};
        if (!amount) {
            errors.amount = 'Amount is required';
        } else if (isNaN(amount) || amount <= 0) {
            errors.amount = 'Amount must be a positive number';
        }
        return errors;
    };

    const handleSavePayment = () => {
        const validationErrors = validateAmount(amount);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setShowModal(true);
        setModalTitle('Confirm Transaction');
        setModalMessage('Are you sure you want to proceed with this Transaction?');
        setModalButtonText('Confirm Transaction');
    };

    const confirmPayment = async () => {
        try {
            const payload = {
                from_gl_id: selectedFromGLId,
                to_gl_id: selectedToGLId,
                amount: Number(amount),
                from_firm_id: selectedFromFirmId,
                to_firm_id: selectedToFirmId,
                remark: remark
            };

            const response = await fetch(`${api_url}/api/users/payment/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to process this transaction');
            }

            const result = await response.json();
            console.log(result);

            // Show success modal
            setShowModal(true);
            setModalTitle('Transaction Status');
            setModalMessage('Transaction Successful');
            setModalButtonText('Close');

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Problem for processing transaction:', error);

            // Show failure modal
            setShowModal(true);
            setModalTitle('Transaction Status');
            setModalMessage('Transaction Failed');
            setModalButtonText('Close');
        }
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
                                <Row className='allfirms_title_mainrow'>
                                    <Col md={8} style={{ marginLeft: "10px" }}>
                                        <Row className='allfirms_title_row py-1 align-items-center'>
                                            <Col md={1}>
                                                <img className='' src={transfers} width={25} height={25} alt="AllFirms Logo" />
                                            </Col>
                                            <Col md={5}>
                                                <h4 className="mb-0" style={{color: 'white'}}>Make Transaction</h4>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md={3} className='d-flex align-items-center justify-content-end'>
                                        <Link to={'/firm_transactions'}>
                                            <Button id="but_color">All Transactions</Button>
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
                                                                        value={selectedFromFirmId}
                                                                        className='form-select'
                                                                        onChange={(e) => setSelectedFromFirmId(e.target.value)}
                                                                    >
                                                                        <option value="">Select Firm</option>
                                                                        {firms.map((firm) => (
                                                                            <option key={firm.firm_id} value={firm.firm_id}>
                                                                                {firm.firm_name}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Control>
                                                                </Col>
                                                                <Col className='make_pay_select_acc'>
                                                                    <Form.Control
                                                                        as="select"
                                                                        value={selectedFromGLId}
                                                                        className='form-select'
                                                                        onChange={(e) => setSelectedFromGLId(e.target.value)}
                                                                        disabled={!selectedFromFirmId || loadingFromGL}
                                                                    >
                                                                        <option value="">Select Your Firm Account</option>
                                                                        {fromGeneralLedgers.map((gl) => (
                                                                            <option key={gl.gl_id} value={gl.gl_id}>
                                                                                {gl.gl_name}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Control>
                                                                    {loadingFromGL && <p>Loading...</p>}
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup as={Row} className="mb-3" controlId="formTo">
                                                                <FormLabel column className='make_pay_lable' md={3}>To:</FormLabel>
                                                                <Col className='make_pay_select_firm'>
                                                                    <Form.Control
                                                                        as="select"
                                                                        value={selectedToFirmId}
                                                                        className='form-select'
                                                                        onChange={(e) => setSelectedToFirmId(e.target.value)}
                                                                    >
                                                                        <option value="">Select Firm</option>
                                                                        {firms.map((firm) => (
                                                                            <option key={firm.firm_id} value={firm.firm_id}>
                                                                                {firm.firm_name}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Control>
                                                                </Col>
                                                                <Col className='make_pay_select_acc'>
                                                                    <Form.Control
                                                                        as="select"
                                                                        value={selectedToGLId}
                                                                        className='form-select'
                                                                        onChange={(e) => setSelectedToGLId(e.target.value)}
                                                                        disabled={!selectedToFirmId || loadingToGL}
                                                                    >
                                                                        <option value="">Select Your Firm Account</option>
                                                                        {toGeneralLedgers.map((gl) => (
                                                                            <option key={gl.gl_id} value={gl.gl_id}>
                                                                                {gl.gl_name}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Control>
                                                                    {loadingToGL && <p>Loading...</p>}
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup as={Row} className="mb-3" controlId="formAmount">
                                                                <FormLabel column sm={3}>Amount :</FormLabel>
                                                                <Col sm={4}>
                                                                    <FormControl
                                                                        type="text"
                                                                        placeholder="Enter Amount"
                                                                        value={amount}
                                                                        onChange={(e) => setAmount(e.target.value)}
                                                                        isInvalid={!!errors.amount}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {errors.amount}
                                                                    </Form.Control.Feedback>
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup as={Row} className="mb-3" controlId="formRemark">
                                                                <FormLabel column sm={3}>Remark :</FormLabel>
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
                                                <Row className='justify-content-center mt-3'>
                                                    <Button className='col-md-4 col-6' id='but_color' onClick={handleSavePayment}>Process Transaction</Button>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Modal Component */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    {modalButtonText === 'Confirm Transaction' ? (
                        <>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                            <Button id="but_color" onClick={confirmPayment}>{modalButtonText}</Button>
                        </>
                    ) : (
                        <Button id="but_color" onClick={() => setShowModal(false)}>{modalButtonText}</Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default MakeTransfer;
