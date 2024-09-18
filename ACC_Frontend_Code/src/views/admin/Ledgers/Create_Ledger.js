import React, { useState, useEffect, useContext } from 'react';
import { CButton, CCard, CCol, CModal, CModalBody, CModalFooter, CModalHeader, CRow } from '@coreui/react';
import { AdminHeader, AdminSidebar } from 'src/components';
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';
import { UserContext } from 'src/context/UserContextProvider';
import { api_url } from 'src/api/APIURL';
import Firm_acc from 'src/assets/icons/sidebar_icons/Firm_acc.png';

const Create_Ledger = () => {
    const { user } = useContext(UserContext);
    const userId = user.userId;
    const [firms, setFirms] = useState([]);
    const [selectedFirmId, setSelectedFirmId] = useState('');
    const [generalLedgerName, setGeneralLedgerName] = useState('');
    const [gl_Type, setGl_Type] = useState(false); // Changed to boolean
    const [opening_Balance, setOpening_Balance] = useState('');
    const [selectFirmError, setSelectFirmError] = useState('');
    const [glNameError, setGLNameError] = useState('');
    const [openBalError, setOpenBalError] = useState(''); // Added state for balance validation
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    const validateGLName = (e) => {
        const value = e.target.value;
        setGeneralLedgerName(value);
        setSelectFirmError('');

        if (value.length === 0) {
            setGLNameError('Name must be at least 2 characters long.');
            return false;
        }

        setGLNameError('');

        const regex = /^[a-zA-Z\s]+$/;
        if (value.length < 1) {
            setGLNameError('Name must be at least 2 characters long.');
            return false;
        } else if (regex.test(value)) {
            setGLNameError('');
            return true;
        } else {
            setGLNameError('Only letters and spaces are allowed.');
            return false;
        }
    };

    const validateOpeningBalance = (e) => {
        const value = e.target.value;
        setOpening_Balance(value);
        const decimalRegex = /^[0-9]*\.?[0-9]+$/; // Regex for decimal numbers

        if (!decimalRegex.test(value) || value < 0) {
            setOpenBalError('Enter a valid positive decimal number.');
        } else {
            setOpenBalError('');
        }
    };

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

    const handleCreateLedger = async () => {
        try {
            if (selectedFirmId) {
                setSelectFirmError('');
            }
    
            if (!selectedFirmId || !generalLedgerName) {
                setSelectFirmError('Please select a firm and enter a firm account name.');
                return;
            }
    
            if (!validateGLName({ target: { value: generalLedgerName } })) {
                setSelectFirmError('');
                setGLNameError('Enter a valid firm account name.');
                return;
            }
    
            if (openBalError) {
                setSelectFirmError('');
                return;
            }
    
            const firm_id = selectedFirmId;
            const response = await axios.post(`${api_url}/api/users/create_general_ledgers/${firm_id}`, {
                gl_name: generalLedgerName,
                gl_type: gl_Type ? '1' : '2', // Map boolean to enum type
                open_balance: opening_Balance.trim() === '' ? '' : opening_Balance // Set to blank if empty
            });
    
            if (response.status === 201) {
                setModalTitle('Firm Account Status');
                setModalMessage('Firm account created successfully !!');
                setModalVisible(true);
                setGeneralLedgerName(''); // Reset the input after successful creation
                setOpening_Balance('');
            }
        } catch (error) {
            console.error('Error creating general ledger:', error);
            setModalTitle('Firm Account Status');
            setModalMessage('Please try again !!');
            setModalVisible(true);
        }
    };
    

    return (
        <div>
            <AdminSidebar />
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                <AdminHeader />
                <div className="body flex-grow-1 px-3">
                    <CRow className="justify-content-center mb-3">
                        <CCol md={12}>
                            <CCard className="card_border_color_change py-5" style={{ borderColor: "white" }}>
                                <CRow className='align-items-center'>
                                    <CCol style={{ marginLeft: "11px" }} className='col-9'>
                                        <CRow className='allfirms_icon_title_row align-items-center'>
                                            <CCol className='col-2 col-md-1'>
                                                <img className='sidebar_icon_color' src={Firm_acc} width={25} height={25} alt="All Firms Logo" />
                                            </CCol>
                                            <CCol className='col-8 col-md-7'>
                                                <h5 className="title_font mb-0" style={{ color: 'white' }}>Create Firm Account</h5>
                                            </CCol>
                                        </CRow>
                                    </CCol>
                                </CRow>
                                <CRow className="allfirms_table_row py-5 justify-content-center">
                                    <CCol md={10}>
                                        <Form>
                                            <Form.Group as={Row} className="mb-3" controlId="formFirmName">
                                                <Form.Label column sm={3}>Firm Name</Form.Label>
                                                <Col sm={6}>
                                                    <Form.Control as="select" value={selectedFirmId} className="form-select" onChange={(e) => setSelectedFirmId(e.target.value)}>
                                                        <option value="">Select Firm</option>
                                                        {firms.map((firm) => (
                                                            <option key={firm.firm_id} value={firm.firm_id}>
                                                                {firm.firm_name}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} className="mb-3" controlId="formGeneralLedgerName">
                                                <Form.Label column sm={3}>Firm Account Name</Form.Label>
                                                <Col sm={6}>
                                                    <Form.Control type="text" value={generalLedgerName} onChange={validateGLName} />
                                                    <div style={{ color: 'green', fontSize: '14px' }}>[Firm Account Name can be Expense or Salary or Person Name like 'Aditya', 'Megha']</div>
                                                    {glNameError && <div className="text-danger mb-2">{glNameError}</div>}
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} className="mb-3" controlId="formOpeningBalance">
                                                <Form.Label column sm={3}>Opening Balance</Form.Label>
                                                <Col sm={6}>
                                                    <Form.Control type="text" value={opening_Balance} onChange={validateOpeningBalance} />
                                                    {openBalError && <div className="text-danger mb-2">{openBalError}</div>}
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} className="mb-3" controlId="formGLType">
                                                <Col sm={6}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        label="Is it Cash"
                                                        checked={gl_Type}
                                                        onChange={(e) => setGl_Type(e.target.checked)}
                                                    />
                                                </Col>
                                            </Form.Group>
                                            {selectFirmError && <div className="text-danger mb-2">{selectFirmError}</div>}
                                            <Row className='cf_acc_bt_row justify-content-center align-content-center'>
                                                <Button variant="primary" id="but_color" onClick={handleCreateLedger}>Create</Button>
                                            </Row>
                                        </Form>
                                    </CCol>
                                </CRow>
                            </CCard>
                        </CCol>
                    </CRow>
                </div>
            </div>

            <Modal show={modalVisible} onHide={() => setModalVisible(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalMessage}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setModalVisible(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Create_Ledger;
