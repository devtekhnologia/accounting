import React, { useState, useEffect, useContext } from 'react';
import { AdminHeader, AdminSidebar } from 'src/components';
import AllFirms_logo from 'src/assets/images/admin_dashboard_icons/AllFirms.png';
import { Form, FormControl, FormGroup, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserContext } from 'src/context/UserContextProvider';
import 'src/scss/_custom.scss';
import Users from 'src/assets/icons/sidebar_icons/Users.png'


const ADD_USER_API_URL = 'http://3.7.46.184:3007/api/users/add_user';
const ASSIGN_FIRM_API_URL = 'http://3.7.46.184:3007/api/users/assign_firm_to_user';

const Add_Users = () => {
  const { user } = useContext(UserContext);
  const userId = user.userId;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const status = "1"; // Hardcoded status
  const role = "2"; // Assuming '2' is the role for the user being added
  const [selectedFirmId, setSelectedFirmId] = useState('');
  const [firms, setFirms] = useState([]);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [contactError, setContactError] = useState('');
  const [addressError, setAddressError] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Validation functions
  const validateName = (e) => {
    const value = e.target.value;
    setName(value);
    if (value.length < 2) {
      setNameError('Name must be at least 2 characters long.');
      return false;
    }
    const regex = /^[a-zA-Z\s]+$/;
    if (!regex.test(value)) {
      setNameError('Only letters and spaces are allowed.');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      setEmailError('Enter valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Update regex to require minimum 8 characters
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%`~#^&*()_=+*[\]{};:'",.<>*?&]{8,}$/;
    if (!regex.test(value)) {
      setPasswordError('Password must be at least 8 characters long and contain both letters and numbers.');
      return false;
    }

    setPasswordError('');
    return true;
  };

  const validateContact = (e) => {
    const value = e.target.value;
    setContact(value);
    const regex = /^\d{10}$/;
    if (!regex.test(value)) {
      setContactError('Contact number must be exactly 10 digits and contain only numbers.');
      return false;
    }
    setContactError('');
    return true;
  };

  const validateAddress = (e) => {
    const value = e.target.value;
    setAddress(value);
    if (value.length === 0) {
      setAddressError('Address cannot be blank.');
      return false;
    }
    setAddressError('');
    return true;
  };

  const validateFirmSelection = () => {
    if (selectedFirmId === '') {
      setErrorMessage('Please select a firm for the user.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  // Fetch firms for the dropdown
  useEffect(() => {
    const fetchFirms = async () => {
      try {
        const response = await fetch(`http://3.7.46.184:3007/api/users/get_all_firms_by_user/${userId}`);
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

  const handleAddUser = async () => {
    if (!validateName({ target: { value: name } })) return;
    if (!validateEmail({ target: { value: email } })) return;
    if (!validatePassword({ target: { value: password } })) return;
    if (!validateContact({ target: { value: contact } })) return;
    if (!validateAddress({ target: { value: address } })) return;
    if (!validateFirmSelection()) return;


    try {
      const response = await fetch(ADD_USER_API_URL, {
        method: 'POST',
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

      const responseData = await response.json();
      console.log(responseData.data);
      if (responseData) {
        const newUser = responseData.data;
        if (await assignFirmToUser(newUser)) {
          setSuccessMessage('User added successfully!');
          setErrorMessage('');
        } else {
          setErrorMessage('Failed to assign firm to the user.');
          setSuccessMessage('');
        }
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setErrorMessage('Please check the details and try again.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setErrorMessage('Please check the details and try again.');
      setSuccessMessage('');
    }
  };

  const assignFirmToUser = async (added_user_id) => {
    try {
      const response = await fetch(ASSIGN_FIRM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: added_user_id,
          firm_id: selectedFirmId,
          added_by_user_id: userId
        }),
      });

      const responseData = await response.json();
      console.log(responseData.status);
      return responseData.status;
    } catch (error) {
      console.error('Error assigning firm to user:', error);
      setErrorMessage('Failed to assign firm to the user.');
      setSuccessMessage('');
      return false;
    }
  };

  return (
    <div>
      <AdminSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AdminHeader />
        <div className="body flex-grow-1 px-3">
          <Row className="justify-content-center mb-3">
            <Col xs={12}>
              <div className="card_border_color_change py-5" style={{ borderColor: "white" }}>
                <Row className='align-items-center'>
                  <Col style={{ marginLeft: "11px" }}>
                    <Row className='allfirms_icon_title_row align-items-center'>
                      <Col className='col-2 col-md-1'>
                        <img className='sidebar_icon_color' src={Users} width={25} height={25} alt="All Firms Logo" />
                      </Col>
                      <Col className='col-9 col-md-9'>
                        <h5 className="title_font mb-0" style={{ color: 'white' }}>Add New User</h5>
                      </Col>
                    </Row>
                  </Col>
                  <Col className="col-4 facc_crea_but_col">
                    <Link to={'/all_USERS'}>
                      <Button id="but_color" className='m-0'>All Users</Button>
                    </Link>
                  </Col>
                </Row>

                <Row className="allfirms_table_row py-5 justify-content-center">
                  <Col xs={12} md={6}>
                    <Form>
                      <FormGroup className="mb-3" controlId="formName">
                        <FormControl
                          type="text"
                          placeholder="Name"
                          value={name}
                          onChange={validateName}
                        />
                        {nameError && <div className="text-danger mb-2">{nameError}</div>}
                      </FormGroup>

                      <FormGroup className="mb-3" controlId="formEmail">
                        <FormControl
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={validateEmail}
                        />
                        {emailError && <div className="text-danger mb-2">{emailError}</div>}
                      </FormGroup>

                      <FormGroup className="mb-3" controlId="formPassword">
                        <FormControl
                          type="text"
                          placeholder="Password"
                          value={password}
                          onChange={validatePassword}
                        />
                        {passwordError && <div className="text-danger mb-2">{passwordError}</div>}
                      </FormGroup>

                      <FormGroup className="mb-3" controlId="formContact">
                        <FormControl
                          type="text"
                          placeholder="Contact"
                          value={contact}
                          onChange={validateContact}
                        />
                        {contactError && <div className="text-danger mb-2">{contactError}</div>}
                      </FormGroup>

                      <FormGroup className="mb-3" controlId="formAddress">
                        <FormControl
                          type="text"
                          placeholder="Address"
                          value={address}
                          onChange={validateAddress}
                        />
                        {addressError && <div className="text-danger mb-2">{addressError}</div>}
                      </FormGroup>

                      <Form.Group as={Row} className="mb-3" controlId="formFirmName">
                        <Form.Label column sm={3}>Firm Name</Form.Label>
                        <Col sm={9}>
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

                      <Row className="justify-content-center align-content-center cf_acc_bt_row">
                        <Button onClick={handleAddUser} id='but_color'>Save</Button>
                        {errorMessage && <div className="text-danger mt-2 text-center">{errorMessage}</div>}
                        {successMessage && <div className="text-success mt-2 text-center">{successMessage}</div>}
                      </Row>
                    </Form>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Add_Users;
