import React, { useContext, useEffect, useState } from 'react';
import AllFirms_logo from 'src/assets/images/admin_dashboard_icons/AllFirms.png';
import { CButton, CCard, CImage, CCol, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { AdminHeader, AdminSidebar } from 'src/components';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { UserContext } from 'src/context/UserContextProvider';
import { api_url } from 'src/api/APIURL';
import axios from 'axios';
import { Col, Form, Modal, Row } from 'react-bootstrap';
import Firms_icon from 'src/assets/icons/sidebar_icons/Firms.png'
import { Button } from '@coreui/coreui';

const All_Firms = () => {
  const { user } = useContext(UserContext);
  const userId = user.userId;
  useEffect(() => {
    console.log(userId);

  }, [userId])

  const [firmsData, setFirmsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({ firm_id: '', firm_name: '', firm_email: '', firm_gstno: '', firm_address: '', firm_status: '' });
  const [totalBalanceall, setTotalBalanceAll] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [firmToDelete, setFirmToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [firmDetails, setFirmDetails] = useState({});

  const fetchData = async () => {
    try {
      const response = await fetch(`${api_url}/api/users/get_all_firms_by_user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setFirmsData(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchTotalBalance = async () => {
    try {
      const response = await fetch(`${api_url}/api/users/total_bal_of_all_firms/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch total balance');
      }
      const data = await response.json();
      setTotalBalanceAll(data.data);
    } catch (error) {
      console.error('Error fetching total balance:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTotalBalance();
  }, [userId]);

  const updateFirmData = async (firm_id, data) => {
    try {
      const response = await axios.put(`${api_url}/api/users/update_firm_details/${firm_id}`, data);
      if (response.status !== 200) {
        throw new Error('Failed to update data');
      }
      const responseData = response.data;
      alert(responseData.message);
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const deleteFirmData = async (firm_id) => {
    try {
      const response = await axios.delete(`${api_url}/api/users/delete_firm/${firm_id}`);
      if (response.status !== 200) {
        throw new Error('Failed to delete data');
      }
      const data = response.data;
      // alert(data.message);
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const fetchFirmDetails = async (firm_id) => {
    try {
      const response = await axios.get(`${api_url}/api/users/get_firm_details/${firm_id}`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch firm details');
      }
      const data = response.data;
      setFirmDetails(data.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching firm details:', error);
    }
  };

  const handleEdit = (firm) => {
    setEditData(firm);
    setShowModal(true);
  };

  const handleSave = () => {
    updateFirmData(editData.firm_id, {
      firm_name: editData.firm_name,
      firm_email: editData.firm_email,
      firm_gstno: editData.firm_gstno,
      firm_address: editData.firm_address,
      firm_status: '1'
    });
  };

  const handleDelete = (firm) => {
    setFirmToDelete(firm);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteFirmData(firmToDelete.firm_id);
    setShowDeleteModal(false);
  };

  const handleView = (firm_id) => {
    fetchFirmDetails(firm_id);
  };

  return (
    <div>
      <AdminSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AdminHeader />
        <div className="body flex-grow-1 px-2 px-md-2">
          <CRow className='justify-content-center mb-3'>
            <CCol className='col-md-12'>
              <CCard className='card_border_color_change py-4' style={{ borderColor: "white" }}>
                <CRow className='align-items-center'>
                  <CCol style={{ marginLeft: "11px" }}>
                    <CRow className='allfirms_icon_title_row align-items-center'>
                      <CCol className='col-2 col-md-1'>
                        <img className='sidebar_icon_color' src={Firms_icon} width={25} height={25} alt="All Firms Logo" />
                      </CCol>
                      <CCol className='col-7 col-md-7'>
                        <h5 className="title_font mb-0" style={{ color: 'white' }}>All Firms</h5>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol className="col-5 facc_crea_but_col">
                    <Link to={'/create_firms'}>
                      <CButton id="but_color" className='m-0'>Create Firm</CButton>
                    </Link>
                  </CCol>
                </CRow>


                <CRow className='justify-content-center mt-4 allf_tot_bal'>
                  <CCol md={11} className="d-flex align-items-center justify-content-end">
                    {totalBalanceall !== null && (
                      <div className='mx-sm-4'
                        style={{
                          backgroundColor: 'green',
                          color: 'white',
                          padding: '10px',
                          borderRadius: '5px'
                        }}>
                        Cash in Hand: {totalBalanceall}
                      </div>
                    )}
                  </CCol>
                </CRow>

                <CRow className='allfirms_table_row py-3 px-3'>
                  <CTable hover responsive className="custom-table">
                    <CTableHead className="custom-table-header">
                      <CTableRow>
                        <CTableHeaderCell>Sr. No.</CTableHeaderCell>
                        <CTableHeaderCell>Firm Name</CTableHeaderCell>
                        <CTableHeaderCell>Address</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>GST No.</CTableHeaderCell>
                        <CTableHeaderCell>Curr. Balance</CTableHeaderCell>
                        <CTableHeaderCell>Action</CTableHeaderCell>
                        <CTableHeaderCell>Details</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {firmsData.map((firm, index) => (
                        <CTableRow key={firm.firm_id}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{firm.firm_name}</CTableDataCell>
                          <CTableDataCell>{firm.firm_address}</CTableDataCell>
                          <CTableDataCell>{firm.firm_status}</CTableDataCell>
                          <CTableDataCell>{firm.firm_gstno}</CTableDataCell>
                          <CTableDataCell>{firm.total_balance}</CTableDataCell>
                          <CTableDataCell>
                            <CButton color="warning" size="sm" className="me-2" onClick={() => handleEdit(firm)}>Edit</CButton>
                            <CButton color="danger" size="sm" onClick={() => handleDelete(firm)}>Delete</CButton>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton color="info" size="sm" onClick={() => handleView(firm.firm_id)}>View</CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CRow>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Firm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFirmName">
              <Form.Label>Firm Name</Form.Label>
              <Form.Control
                type="text"
                value={editData.firm_name}
                onChange={(e) => setEditData({ ...editData, firm_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formFirmEmail" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                value={editData.firm_email}
                onChange={(e) => setEditData({ ...editData, firm_email: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formFirmGstno" className="mt-3">
              <Form.Label>GST No.</Form.Label>
              <Form.Control
                type="text"
                value={editData.firm_gstno}
                onChange={(e) => setEditData({ ...editData, firm_gstno: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formFirmAddress" className="mt-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={editData.firm_address}
                onChange={(e) => setEditData({ ...editData, firm_address: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <CButton color="secondary" onClick={() => setShowModal(false)}>Close</CButton>
          <CButton color="primary" onClick={handleSave}>Save changes</CButton>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this firm?
        </Modal.Body>
        <Modal.Footer>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</CButton>
          <CButton color="danger" onClick={confirmDelete}>Delete</CButton>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Firm Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h5>Firm Name: {firmDetails.firm_name}</h5>
            <p>Email: {firmDetails.firm_email}</p>
            <p>GST No: {firmDetails.firm_gstno}</p>
            <p>Address: {firmDetails.firm_address}</p>
            <p>Status: {firmDetails.firm_status}</p>
            <p>Current Balance: {firmDetails.total_balance}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <CButton color="secondary" onClick={() => setShowDetailsModal(false)}>Close</CButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default All_Firms;
