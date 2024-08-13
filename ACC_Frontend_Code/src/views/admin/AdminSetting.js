import React, { useState } from 'react';
import { AppFooter, PrinciSidebar, PrinciHeader, AdminSidebar, AdminHeader } from '../../components/index';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { CCard, CRow } from '@coreui/react';

const AdminSetting = () => {
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => {
        setShowModal(false);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };
    const handleSaveChanges = () => {
        setShowModal(true);
    };

    return (
        <div>
            <AdminSidebar />
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                <AdminHeader />
                <div className="body flex-grow-1 py-3">
                    <CRow className='justify-content-center'>
                        <CCard className='col-md-5' id='card_border_color_change' style={{ paddingBottom: '40px' }}>
                            <Container fluid>
                                <Row className="justify-content-center">
                                    <Col md={8}>
                                        <h3 className="mt-4 mb-3" style={{ color: 'rgb(12, 71, 148)' }}>Profile Settings</h3>
                                        <Form>
                                            <Form.Group controlId="formBasicEmail" className='mb-4'>
                                                <Form.Label>Email address</Form.Label>
                                                <Form.Control type="email" placeholder="******user@gmail.com" disabled />
                                            </Form.Group>
                                            <Form.Group controlId="formBasicOldPassword" className='mb-4'>
                                                <Form.Label>Old Password</Form.Label>
                                                <Form.Control type="password" placeholder="Enter old password" />
                                            </Form.Group>
                                            <Form.Group controlId="formBasicNewPassword" className='mb-4'>
                                                <Form.Label>New Password</Form.Label>
                                                <Form.Control type="password" placeholder="Enter new password" />
                                            </Form.Group>
                                            <Form.Group controlId="formBasicCheckbox" className='mb-4'>
                                                <Form.Check type="checkbox" label="Remember me" />
                                            </Form.Group>
                                            <Button id='but_color' variant="primary" type="button" onClick={handleSaveChanges}>
                                                Save Changes
                                            </Button>
                                        </Form>
                                    </Col>
                                </Row>
                            </Container>
                        </CCard>
                    </CRow>
                </div>
                <AppFooter />
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ color: 'green' }}>Your changes have been saved successfully.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminSetting