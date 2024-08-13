import React, { useState, useEffect, useContext } from 'react';
import { CButton, CCard, CCol, CImage, CRow } from '@coreui/react';
import { AdminHeader, AdminSidebar, FirmusrHeader, FirmusrSidebar } from 'src/components';
import AllFirms_logo from 'src/assets/images/admin_dashboard_icons/AllFirms.png';
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';
import { UserContext } from 'src/context/UserContextProvider';
import { api_url } from 'src/api/APIURL';
import Firm_acc from 'src/assets/icons/sidebar_icons/Firm_acc.png';

const User_Create_Ledger = () => {
    const { user } = useContext(UserContext);
    const userId = user.userId;
    const [firms, setFirms] = useState([]);
    const [selectedFirmId, setSelectedFirmId] = useState('');
    const [generalLedgerName, setGeneralLedgerName] = useState('');

    const [selectFirmError, setSelectFirmError] = useState('');
    const [glNameError, setGLNameError] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    // Validation functions
    const validateGLName = (e) => {
        setGeneralLedgerName(e.target.value);
        setSelectFirmError('');

        if (generalLedgerName.length === 0) {
            setGLNameError('Name must be at least 2 characters long.');
            return false;
        }

        setGLNameError('');

        const regex = /^[a-zA-Z\s]+$/;
        if (generalLedgerName.length < 2) {
            setGLNameError('Name must be at least 2 characters long.');
            return false;
        } else if (regex.test(generalLedgerName)) {
            setGLNameError('');
            return true;
        } else {
            setGLNameError('Only letters and spaces are allowed.');
            return false;
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
                setSelectFirmError('Please select a firm and enter a firm account name');
                return;
            }

            if (!validateGLName({ target: { value: generalLedgerName } })) {
                setSelectFirmError('');
                setGLNameError('Enter valid firm account name.');
                return;
            }

            const firm_id = selectedFirmId;
            const response = await axios.post(`${api_url}/api/users/create_general_ledgers/${firm_id}`, {
                gl_name: generalLedgerName
            });

            if (response.status === 201) {
                setModalTitle('Firm Account Status');
                setModalMessage('Firm account created successfully !!');
                setGeneralLedgerName(''); // Reset the input after successful creation
            } else {
                setModalTitle('Firm Account Status');
                setModalMessage('Please try again !!');
            }
        } catch (error) {
            console.error('Error creating general ledger:', error);
            setModalTitle('Firm Account Status');
            setModalMessage('Something went wrong !!');
        } finally {
            setShowModal(true);
        }
    };

    return (
        <div>
            <FirmusrSidebar />
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                <FirmusrHeader />
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

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default User_Create_Ledger;
