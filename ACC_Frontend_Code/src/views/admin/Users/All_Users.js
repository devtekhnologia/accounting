import React, { useState, useEffect, useContext } from 'react';
import AllFirms_logo from 'src/assets/images/admin_dashboard_icons/AllFirms.png';
import {
  CButton, CCard, CCol, CImage, CRow, CTable, CTableBody, CTableDataCell,
  CTableHead, CTableHeaderCell, CTableRow, CModal, CModalBody, CModalFooter,
  CModalHeader, CModalTitle, CForm, CFormLabel, CFormInput, CFormSelect
} from '@coreui/react';
import { AdminHeader, AdminSidebar } from 'src/components';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Link } from 'react-router-dom';
import { UserContext } from 'src/context/UserContextProvider';
import Users from 'src/assets/icons/sidebar_icons/Users.png'
import { Col, InputGroup, Row } from 'react-bootstrap';
import { api_url } from 'src/api/APIURL';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const USERS_ADDED_BY_USER_API_URL = userId => `http://192.168.29.17:3007/api/users/users_added_by_user/${userId}`;
const TOTAL_BALANCE_OF_USER_API_URL = userId => `http://192.168.29.17:3007/api/users/total_bal_of_all_firms/${userId}`;
const USER_DETAILS_API_URL = user_id => `http://192.168.29.17:3007/api/users/user_details/${user_id}`;
const UPDATE_USER_DETAILS_API_URL = user_id => `http://192.168.29.17:3007/api/users/update_user_details/${user_id}`;
const UPDATE_FIRM_USER_API_URL = user_id => `http://192.168.29.17:3007/api/users/update_firm_user/${user_id}`;
const DELETE_FIRM_USER_API_URL = uf_id => `http://192.168.29.17:3007/api/users/delete_firm_user/${uf_id}`;

const All_Users = () => {
  const { user } = useContext(UserContext);
  const userId = user.userId;

  const [users, setUsers] = useState([]);
  const [assignedFirms, setAssignedFirms] = useState([]);
  const [firms, setFirms] = useState([]);
  const [selectedFirmId, setSelectedFirmId] = useState('');

  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [view_modalVisible, setView_ModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
    address: '',
    status: '',
    role: '',
    firms: []
  });

  const [showPassword, setShowPassword] = useState(false); // State for showing password

  const [update_selFirm_Ids, setUpdate_selFirm_Ids] = useState([]);
  const [update_deselFirm_Ids, setUpdate_deselFirm_Ids] = useState([]);



  const fetchUsers = async () => {
    try {
      const response = await fetch(USERS_ADDED_BY_USER_API_URL(userId));
      if (response.ok) {
        const data = await response.json();
        const usersWithBalance = await Promise.all(data.data.map(async (user) => {
          const balanceResponse = await fetch(TOTAL_BALANCE_OF_USER_API_URL(user.user_id));
          const balanceData = await balanceResponse.json();
          return { ...user, currbal: balanceData.data };
        }));
        setUsers(usersWithBalance);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    if (!modalVisible) {
      setSuccessMessage('');
      setErrorMessage('');
    }
  }, [userId, modalVisible]);

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

  const fetchUserDetails = async (user) => {
    console.log("Fetching user details for:", user);
    try {
      const response = await fetch(USER_DETAILS_API_URL(user.user_id));
      if (response.ok) {
        const data = await response.json();
        console.log("data :", data);
        setSelectedUser(user);

        setAssignedFirms(data.data.firms);

        setFormData({
          name: data.data.usr_name,
          email: data.data.usr_email,
          password: data.data.usr_password,
          contact: data.data.usr_contact || '',
          address: data.data.usr_address,
          status: data.data.usr_status === 'Active' ? '1' : '0',
          role: data.data.usr_role,
          firms: data.data.firms
        });


        // setModalVisible(true);
      } else {
        console.error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Log the updated selectedUser
  useEffect(() => {
    console.log("Selected user has been updated:", selectedUser);
    console.log("Assigned Firms has been updated:", assignedFirms);
    console.log("Selected Firm_ids :", update_selFirm_Ids);
    console.log("De-selected Firm_ids :", update_deselFirm_Ids);
  }, [selectedUser, assignedFirms, update_selFirm_Ids, update_deselFirm_Ids]);



  const handleUpdate = async () => {

    try {
      // Update user details
      const updateUserResponse = await fetch(UPDATE_USER_DETAILS_API_URL(selectedUser.user_id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          contact: formData.contact,
          address: formData.address,
          status: '1',
          role: '2'
        })
      });
      const updateUserResdata = await updateUserResponse.json();
      console.log('Update user: ', updateUserResdata);

      // Update firm assignments (multiple firms)
      const updateFirmResponse = await fetch(UPDATE_FIRM_USER_API_URL(selectedUser.user_id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedFirmIds: update_selFirm_Ids,
          deselectedFirmIds: update_deselFirm_Ids,
          added_by_user_id: userId
        })
      });
      const updateFirmResdata = await updateFirmResponse.json();
      console.log('Update userFirm: ', updateFirmResdata);
      // console.log(update_selFirm_Ids);
      // console.log(update_deselFirm_Ids);

      if (updateUserResponse.ok && updateFirmResponse.ok) {
        setSuccessMessage('User details updated successfully !!');
        setModalVisible(false);
        setLoading(true);
        fetchUsers();
      } else {
        setErrorMessage('Something went wrong !!');
        console.error('Failed to update user details or firm');
      }
    } catch (error) {
      console.error('Error updating user details or firm:', error);
    }
  };




  const handleDeleteModalOpen = (user) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(DELETE_FIRM_USER_API_URL(selectedUser.uf_id), {
        method: 'DELETE'
      });

      if (response.ok) {
        // setSuccessMessage('User deleted successfully !!');
        setDeleteModalVisible(false);
        setLoading(true);
        fetchUsers();
      } else {
        setErrorMessage('Failed to delete user !!');
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <AdminSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AdminHeader />
        <div className="body flex-grow-1 px-3 px-md-2">
          <>
            <CRow className='justify-content-center mb-3'>
              <CCol className='col-md-12'>
                <CCard className='card_border_color_change py-5' style={{ borderColor: "white" }}>
                  <CRow className='align-items-center'>
                    <CCol style={{ marginLeft: "11px" }}>
                      <CRow className='allfirms_icon_title_row align-items-center'>
                        <CCol className='col-2 col-md-1'>
                          <img className='sidebar_icon_color' src={Users} width={25} height={25} alt="All Firms Logo" />
                        </CCol>
                        <CCol className='col-9 col-md-9'>
                          <h5 className="title_font mb-0" style={{ color: 'white' }}>All Users</h5>
                        </CCol>
                      </CRow>
                    </CCol>
                    <CCol className="col-6 facc_crea_but_col">
                      <Link to={'/add_users'}>
                        <CButton id="but_color" className='m-0'>Add New User</CButton>
                      </Link>
                    </CCol>
                  </CRow>

                  <CRow className='allfirms_table_row py-5 px-1'>
                    <CTable hover responsive className="custom-table">
                      <CTableHead className="custom-table-header">
                        <CTableRow>
                          <CTableHeaderCell id='sss'>Sr. No.</CTableHeaderCell>
                          <CTableHeaderCell id='sss'>Name</CTableHeaderCell>
                          <CTableHeaderCell id='sss'>Address</CTableHeaderCell>
                          <CTableHeaderCell id='sss'>Email Id</CTableHeaderCell>
                          {/* <CTableHeaderCell id='sss'>Status</CTableHeaderCell> */}
                          <CTableHeaderCell id='sss'>Assigned Firm</CTableHeaderCell>
                          <CTableHeaderCell id='sss'>Curr. Balance</CTableHeaderCell>
                          <CTableHeaderCell id='sss'>Action</CTableHeaderCell>
                          <CTableHeaderCell id='sss'>Details</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {users.map((user, index) => (
                          <CTableRow key={user.user_id}>
                            <CTableDataCell>{index + 1}</CTableDataCell>
                            <CTableDataCell>{user.usr_name}</CTableDataCell>
                            <CTableDataCell>{user.usr_address}</CTableDataCell>
                            <CTableDataCell>{user.usr_email}</CTableDataCell>
                            {/* <CTableDataCell>{user.usr_status}</CTableDataCell> */}
                            <CTableDataCell>
                              {user.firm_name.map((firm, firmIndex) => (
                                <div key={firmIndex}>{firm}</div>
                              ))}
                            </CTableDataCell>
                            <CTableDataCell>{user.currbal}</CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                color="warning"
                                size="sm"
                                className="me-2"
                                onClick={() => { fetchUserDetails(user); setModalVisible(true); }}
                              >
                                Edit
                              </CButton>
                              <CButton color="danger" size="sm" onClick={() => handleDeleteModalOpen(user)}>Delete</CButton>
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                color="info"
                                size="sm"
                                onClick={() => { fetchUserDetails(user); setView_ModalVisible(true); }}
                              >
                                View
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </CRow>

                </CCard>
              </CCol>
            </CRow>
          </>
        </div>
      </div>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Edit User Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="name">Name</CFormLabel>
              <CFormInput id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} readOnly />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="email">Email</CFormLabel>
              <CFormInput id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} readOnly />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="password">Password</CFormLabel>
              <InputGroup>
                <CFormInput id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />} {/* Toggle eye icon */}
                </InputGroup.Text>
              </InputGroup>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="contact">Contact</CFormLabel>
              <CFormInput id="contact" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="address">Address</CFormLabel>
              <CFormInput id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="firmId">Assigned Firm</CFormLabel>
              <CFormSelect
                id="firmId"
                multiple
                value={formData.firms} // Selected firms
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);

                  // Extract only firm_id from assignedFirms
                  const assignedFirmIds = assignedFirms.map(firm => firm.firm_id.toString());

                  // Track firms that have been selected and deselected
                  let newlySelectedFirms = [...update_selFirm_Ids]; // Initialize with already selected firms
                  let newlyDeselectedFirms = [...update_deselFirm_Ids]; // Initialize with already deselected firms

                  // Process each firm_id in assignedFirmIds
                  assignedFirmIds.forEach(firm_id => {
                    if (selectedOptions.includes(firm_id)) {
                      // If the firm_id is selected and was previously deselected, remove it from newlyDeselectedFirms
                      newlyDeselectedFirms = newlyDeselectedFirms.filter(id => id !== firm_id);

                      // Add it to newlySelectedFirms if not already present
                      if (!newlySelectedFirms.includes(firm_id)) {
                        newlySelectedFirms.push(firm_id);
                      }
                    } else {
                      // If the firm_id is deselected and was previously selected, remove it from newlySelectedFirms
                      newlySelectedFirms = newlySelectedFirms.filter(id => id !== firm_id);

                      // Add it to newlyDeselectedFirms if not already present
                      if (!newlyDeselectedFirms.includes(firm_id)) {
                        newlyDeselectedFirms.push(firm_id);
                      }
                    }
                  });

                  // Process firms that were not originally in assignedFirmIds (new selections)
                  selectedOptions.forEach(firm_id => {
                    if (!assignedFirmIds.includes(firm_id)) {
                      // If the firm_id is newly selected, add it to newlySelectedFirms
                      if (!newlySelectedFirms.includes(firm_id)) {
                        newlySelectedFirms.push(firm_id);
                      }

                      // Ensure it's not mistakenly in newlyDeselectedFirms
                      newlyDeselectedFirms = newlyDeselectedFirms.filter(id => id !== firm_id);
                    }
                  });

                  // Ensure the selected and deselected firm IDs are unique
                  setFormData({ ...formData, firms: selectedOptions });
                  setUpdate_selFirm_Ids([...new Set(newlySelectedFirms)]);
                  setUpdate_deselFirm_Ids([...new Set(newlyDeselectedFirms)]);

                  // Update the assignedFirms to reflect the latest selection
                  setAssignedFirms(firms.filter(firm => selectedOptions.includes(firm.firm_id.toString())));
                }}



              >
                {firms.map((firm) => (
                  <option key={firm.firm_id} value={firm.firm_id}>
                    {firm.firm_name}
                  </option>
                ))}
              </CFormSelect>
            </div>



          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleUpdate}>Save</CButton>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancel</CButton>
          {errorMessage && <div className="text-danger mt-2 text-center">{errorMessage}</div>}
          {successMessage && <div className="text-success mt-2 text-center">{successMessage}</div>}
        </CModalFooter>
      </CModal>

      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>{selectedUser ? `Delete User ${selectedUser.usr_name}` : ''}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedUser && (
            <p>Are you sure you want to delete user {selectedUser.usr_name}?</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={handleDelete}>Delete</CButton>
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>Cancel</CButton>
          {/* {errorMessage && <div className="text-danger mt-2 text-center">{errorMessage}</div>}
          {successMessage && <div className="text-success mt-2 text-center">{successMessage}</div>} */}
        </CModalFooter>
      </CModal>

      <CModal visible={view_modalVisible} onClose={() => setView_ModalVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>User Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="name">Name</CFormLabel>
              <CFormInput id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} readOnly />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="email">Email</CFormLabel>
              <CFormInput id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} readOnly />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="password">Password</CFormLabel>
              <InputGroup>
                <CFormInput id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} readOnly />
                <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />} {/* Toggle eye icon */}
                </InputGroup.Text>
              </InputGroup>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="contact">Contact</CFormLabel>
              <CFormInput id="contact" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} readOnly />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="address">Address</CFormLabel>
              <CFormInput id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} readOnly />
            </div>
            {/* <div className="mb-3">
              <CFormLabel htmlFor="status">Status</CFormLabel>
              <CFormSelect id="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="role">Role</CFormLabel>
              <CFormSelect id="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value="1">Admin</option>
                <option value="2">User</option>
              </CFormSelect>
            </div> */}
            <div className="mb-3">
              <CFormLabel htmlFor="firmId">Assigned Firm</CFormLabel>
              {/* <Form.Group as={Row} className="mb-3" controlId="formFirmName">
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
              </Form.Group> */}

              <CFormSelect
                id="firmId"
                value={formData.firms}
                onChange={(e) => setSelectedFirmId(e.target.value)}
              >
                {assignedFirms.map((ass_firms) => (
                  <option key={ass_firms.firm_id} value={ass_firms.firm_id}>
                    {ass_firms.firm_name}
                  </option>
                ))}

                {/* {firms.map((firm) => (
                  <option key={firm.firm_id} value={firm.firm_id}>
                    {firm.firm_name}
                  </option>
                ))} */}
              </CFormSelect>
              {/* <CFormInput id="firmId" value={formData.firmId} onChange={(e) => setFormData({ ...formData, firmId: e.target.value })} /> */}

              {/* <ul>
                {assignedFirms.map((firm, index) => (
                  <li key={index}>{firm.firm_name}</li> // Assuming the firm object has a firm_name property
                ))}
              </ul> */}
            </div>
          </CForm>
        </CModalBody>
      </CModal>
    </div>
  );
}

export default All_Users;