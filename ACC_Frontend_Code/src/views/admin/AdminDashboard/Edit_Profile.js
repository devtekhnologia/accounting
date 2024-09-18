import React, { useState, useEffect, useContext } from 'react';
import { AdminHeader, AdminSidebar } from 'src/components';
import AllFirms_logo from 'src/assets/images/admin_dashboard_icons/AllFirms.png';
import { Form, FormControl, FormGroup, Row, Col, Button, Modal, FormLabel, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserContext } from 'src/context/UserContextProvider';
import 'src/scss/_custom.scss';
import { cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SHOW_USER_DETAILS_API_URL = `http://192.168.29.17:3007/api/users/user_details/`;
const UPDATE_USER_DETAILS_API_URL = `http://192.168.29.17:3007/api/users/update_user_details/`;

const Edit_Profile = () => {
  const { user } = useContext(UserContext);
  const userId = user.userId;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const status = "1"; // Hardcoded status
  const role = "1"; // Assuming '2' is the role for the user being added
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false); // State for showing password

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${SHOW_USER_DETAILS_API_URL}${userId}`);
        if (response.ok) {
          const data = await response.json();
          const userDetails = data.data;
          setName(userDetails.usr_name);
          setEmail(userDetails.usr_email);
          setPassword(userDetails.usr_password);
          setContact(userDetails.usr_contact);
          setAddress(userDetails.usr_address);
        } else {
          throw new Error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setErrorMessage('Failed to fetch user details. Please try again.');
      }
    };

    fetchUserDetails();
  }, [userId]);

  // Update user details
  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`${UPDATE_USER_DETAILS_API_URL}${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          contact,
          address,
          status,
          role
        }),
      });

      if (response.ok) {
        setSuccessMessage('User details updated successfully.');
        setErrorMessage('');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setErrorMessage('Failed to update user. Please try again.');
      setSuccessMessage('');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div>
      <AdminSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AdminHeader />
        <div className="body flex-grow-1 px-1">
          <>
            <Row className="justify-content-center mb-3">
              <Col xs={10}>
                <div className="card_border_color_change py-5" style={{ borderColor: "white", borderRadius: "10px" }}>
                  <Row className='align-items-center'>
                    <Col style={{ marginLeft: "11px" }} className='col-10'>
                      <Row className='allfirms_icon_title_row align-items-center'>
                        <Col className='col-2 col-md-1'>
                          <CIcon icon={cilUser} style={{ color: 'white', margin: "5px 0px 0px 0px" }} width={25} height={25} className="" />
                        </Col>
                        <Col className='col-7 col-md-7'>
                          <h5 className="title_font mb-0" style={{ color: 'white' }}>My Profile</h5>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row className="allfirms_table_row py-5 justify-content-center">
                    <Col xs={12} md={8}>
                      <Form>

                        <FormGroup as={Row} className="mb-3" controlId="formName">
                          <FormLabel column md={4}>Name</FormLabel>
                          <Col md={8}>
                            <FormControl
                              type="text"
                              placeholder="Name"
                              value={name}
                              readOnly
                            />
                          </Col>

                        </FormGroup>

                        <FormGroup as={Row} className="mb-3" controlId="formEmail">
                          <FormLabel column md={4}>Email</FormLabel>
                          <Col md={8}>
                            <FormControl
                              type="email"
                              placeholder="Email"
                              value={email}
                              readOnly
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup as={Row} className="mb-3" controlId="formPassword">
                          <FormLabel column md={4}>Password</FormLabel>
                          <Col md={8}>
                            <InputGroup>
                              <FormControl
                                type={showPassword ? 'text' : 'password'} // Toggle password visibility
                                placeholder="Password"
                                value={password}
                                readOnly
                              />

                              <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                                {showPassword ? <FaEye /> : <FaEyeSlash />} {/* Toggle eye icon */}
                              </InputGroup.Text>
                            </InputGroup>
                          </Col>

                        </FormGroup>

                        <FormGroup as={Row} className="mb-3" controlId="formContact">
                          <FormLabel column md={4}>Contact No.</FormLabel>
                          <Col md={8}>
                            <FormControl
                              type="text"
                              placeholder="Contact"
                              value={contact}
                              readOnly
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup as={Row} className="mb-3" controlId="formAddress">
                          <FormLabel column md={4}>Address</FormLabel>
                          <Col md={8}>
                            <FormControl
                              type="text"
                              placeholder="Address"
                              value={address}
                              readOnly
                            />
                          </Col>
                        </FormGroup>

                        <Row className="justify-content-center align-content-center cf_acc_bt_row">
                          <Button onClick={() => setShowModal(true)} id='but_color'>Edit</Button>
                        </Row>
                      </Form>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormGroup className="mb-3" controlId="formName">
              <FormControl
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                readOnly
              />
            </FormGroup>

            <FormGroup className="mb-3" controlId="formEmail">
              <FormControl
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly
              />
            </FormGroup>

            <FormGroup className="mb-3" controlId="formPassword">
              <InputGroup>
                <FormControl
                  type={showPassword ? 'text' : 'password'} // Toggle password visibility
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />} {/* Toggle eye icon */}
                </InputGroup.Text>
              </InputGroup>
            </FormGroup>

            <FormGroup className="mb-3" controlId="formContact">
              <FormControl
                type="text"
                placeholder="Contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </FormGroup>

            <FormGroup className="mb-3" controlId="formAddress">
              <FormControl
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormGroup>

            <Row className="justify-content-center align-content-center cf_acc_bt_row">
              <Button onClick={handleUpdateUser} id='but_color'>Save</Button>
              {errorMessage && <div className="text-danger mt-2 text-center">{errorMessage}</div>}
              {successMessage && <div className="text-success mt-2 text-center">{successMessage}</div>}
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Edit_Profile;
