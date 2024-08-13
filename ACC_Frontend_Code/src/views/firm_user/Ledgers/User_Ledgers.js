import React, { useContext, useEffect, useState } from 'react';
import AllFirms_logo from 'src/assets/images/admin_dashboard_icons/AllFirms.png';
import {
  CButton,
  CCard,
  CImage,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react';
import { AdminHeader, AdminSidebar, FirmusrHeader, FirmusrSidebar } from 'src/components';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Modal } from 'react-bootstrap';
import { UserContext } from 'src/context/UserContextProvider';
import axios from 'axios';
import { api_url } from 'src/api/APIURL';
import Firm_acc from 'src/assets/icons/sidebar_icons/Firm_acc.png'


const User_Ledgers = () => {
  const { user } = useContext(UserContext);
  const userId = user.userId;
  const [firms, setFirms] = useState([]);
  const [selectedFirmId, setSelectedFirmId] = useState('');
  const [firmsData, setFirmsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({ gl_id: '', gl_name: '', gl_status: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [firmToDelete, setFirmToDelete] = useState(null);
  const [totalBalance, setTotalBalance] = useState(null);


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

  const fetchData = async (firm_id) => {
    try {
      const response = await fetch(`${api_url}/api/users/get_general_ledgers/${firm_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setFirmsData(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (selectedFirmId) {
      fetchData(selectedFirmId);
    }
  }, [selectedFirmId]);

  const updateLedgData = async (firm_id, gl_id, data) => {
    try {
      const response = await axios.put(`${api_url}/api/users/update_general_ledgers/${firm_id}/${gl_id}`, data);
      if (response.status !== 200) {
        throw new Error('Failed to update data');
      }
      alert(response.data.message);
      setShowModal(false);
      fetchData(firm_id);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const deleteLedgData = async () => {
    if (!firmToDelete) return;

    const { firm_id, gl_id } = firmToDelete;

    try {
      const response = await axios.delete(`${api_url}/api/users/delete_general_ledgers/${firm_id}/${gl_id}`);
      if (response.status !== 200) {
        throw new Error('Failed to delete data');
      }
      // alert(response.data.message);
      setShowDeleteModal(false);
      fetchData(firm_id);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleEdit = (firm) => {
    setEditData(firm);
    setShowModal(true);
  };

  const handleDelete = (firm) => {
    setFirmToDelete(firm);
    setShowDeleteModal(true);
  };

  const handleSave = () => {
    updateLedgData(selectedFirmId, editData.gl_id, { gl_name: editData.gl_name, gl_status: editData.gl_status });
  };

  return (
    <div>
      <FirmusrSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <FirmusrHeader />
        <div className="body flex-grow-1 px-3">
          <CRow className='justify-content-center mb-3'>
            <CCol md={12}>
              <CCard className='card_border_color_change py-5' style={{ borderColor: "white" }}>
                <CRow className='align-items-center'>
                  <CCol style={{ marginLeft: "11px" }}>
                    <CRow className='allfirms_icon_title_row align-items-center'>
                      <CCol className='col-2 col-md-1'>
                        <img className='sidebar_icon_color' src={Firm_acc} width={25} height={25} alt="All Firms Logo" />
                      </CCol>
                      <CCol className='col-7 col-md-7'>
                        <h5 className="title_font mb-0" style={{ color: 'white' }}>Firm Accounts</h5>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol className="col-4 facc_crea_but_col">
                    <Link to={'/user_create_ledger'}>
                      <CButton id="but_color" className='m-0'>Create</CButton>
                    </Link>
                  </CCol>
                </CRow>

                <CRow className='allfirms_table_row py-5 justify-content-center'>
                  <CCol>
                    <CRow className='justify-content-center mb-3'>
                      <CCol className="justify-content-start justify-content-md-start facc_sel_firm_col">
                        <Form.Group as={Row} className="mb-3" controlId="formFirmName">
                          <Col md={11} className="justify-content-start justify-content-md-start">
                            {/* <Form.Label column sm={2}>Firm Name</Form.Label> */}

                            <Form.Control as="select" value={selectedFirmId} className='form-select' onChange={(e) => setSelectedFirmId(e.target.value)}>
                              <option value="">Select Firm</option>
                              {firms.map((firm) => (
                                <option key={firm.firm_id} value={firm.firm_id}>
                                  {firm.firm_name}
                                </option>
                              ))}
                            </Form.Control>
                          </Col>
                        </Form.Group>
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





                    <CRow className='justify-content-center'>
                      <Col md={12}>
                        <CTable hover responsive className="custom-table">
                          <CTableHead className="custom-table-header">
                            <CTableRow>
                              <CTableHeaderCell>Sr. No.</CTableHeaderCell>
                              <CTableHeaderCell>Firm Account Name</CTableHeaderCell>
                              <CTableHeaderCell>Status</CTableHeaderCell>
                              <CTableHeaderCell>Curr. Balance</CTableHeaderCell>
                              <CTableHeaderCell>Action</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {firmsData.map((firm, index) => (
                              <CTableRow key={index}>
                                <CTableDataCell>{index + 1}</CTableDataCell>
                                <CTableDataCell>{firm.gl_name}</CTableDataCell>
                                <CTableDataCell>{firm.gl_status}</CTableDataCell>
                                <CTableDataCell>{firm.balance}</CTableDataCell>
                                <CTableDataCell>
                                  <CButton color="warning" size="sm" className="me-2" onClick={() => handleEdit(firm)}>Edit</CButton>
                                  <CButton color="danger" size="sm" onClick={() => handleDelete({ firm_id: selectedFirmId, gl_id: firm.gl_id })}>Delete</CButton>
                                </CTableDataCell>
                              </CTableRow>
                            ))}
                          </CTableBody>
                        </CTable>
                      </Col>
                    </CRow>
                  </CCol>
                </CRow>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit General Ledger</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formGLName">
              <Form.Label>Gen Ledger Name</Form.Label>
              <Form.Control
                type="text"
                value={editData.gl_name}
                onChange={(e) => setEditData({ ...editData, gl_name: e.target.value })}
              />
            </Form.Group>
            {/* <Form.Group controlId="formGLStatus" className="mt-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                value={editData.gl_status}
                onChange={(e) => setEditData({ ...editData, gl_status: e.target.value })}
              />
            </Form.Group> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <CButton color="secondary" onClick={() => setShowModal(false)}>Close</CButton>
          <CButton color="primary" onClick={handleSave}>Save changes</CButton>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this ledger?
        </Modal.Body>
        <Modal.Footer>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</CButton>
          <CButton color="danger" onClick={deleteLedgData}>Delete</CButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default User_Ledgers;
