import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, Row, InputGroup } from 'react-bootstrap';
import { APIRegister } from 'src/api/APIRegister';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import { useToast, Wrap } from '@chakra-ui/react';

const Signup = () => {
  const [nameReg, setNameReg] = useState('');
  const [emailReg, setEmailReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [contactNoReg, setContactNoReg] = useState('');
  const [addressReg, setAddressReg] = useState('');
  const statusReg = "1";
  const roleReg = "1";

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contactError, setContactError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [addressError, setAddressError] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false); // State for showing password

  const toast = useToast();
  const [toastStatus, setToastStatus] = useState('');
  const [toastDescrip, setToastDescrip] = useState('');

  const navigate = useNavigate();

  // Validation functions
  const validateName = (e) => {
    setNameReg(e.target.value);
    if (nameReg.length === 0) {
      setNameError('Name must be at least 2 characters long.');
      return false;
    }
    setNameError('');
    const regex = /^[a-zA-Z\s]+$/;
    if (nameReg.length < 1) {
      setNameError('Name must be at least 2 characters long.');
      return false;
    } else if (regex.test(nameReg)) {
      setNameError('');
      return true;
    } else {
      setNameError('Only letters and spaces are allowed.');
      return false;
    }
  };

  const validateEmail = (e) => {
    if ((e.target.value).length >= 0) {
      setEmailReg(e.target.value);
      setEmailError('');
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (regex.test(emailReg)) {
        setEmailError('');
        return true;
      } else {
        setEmailError('Enter valid email address.');
        return false;
      }
    } else {
      setEmailError('Email address must not be blank.');
      return false;
    }
  };

  const validatePassword = (e) => {
    const password = e.target.value;
    setPasswordReg(password);
    setPasswordError('');
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%`~#^&*()-_+={};:'",.<>*?&]{8,}$/;
    if (regex.test(password)) {
      setPasswordError('');
      return true;
    } else {
      setPasswordError('Password must be at least 8 characters long and contain both letters and numbers.');
      return false;
    }
  };

  const validateContact = (e) => {
    const contactNo = e.target.value;
    setContactNoReg(contactNo);
    setContactError('');
    const regex = /^\d{10}$/;
    if (regex.test(contactNo)) {
      setContactError('');
      return true;
    } else {
      if (contactNo.length === 0) {
        setContactError('Contact number must not be blank.');
      } else {
        setContactError('Contact number must be exactly 10 digits and contain only numbers.');
      }
      return false;
    }
  };

  const validateAddress = (e) => {
    if ((e.target.value).length >= 0) {
      setAddressReg(e.target.value);
      setAddressError('');
      return true;
    } else {
      setAddressError('Address cannot be blank.');
      return false;
    }
  };

  const register = async () => {
    if (!validateName({ target: { value: nameReg } })) {
      setNameError('Enter valid name.');
      return;
    }
    if (!validateEmail({ target: { value: emailReg } })) {
      setEmailError('Invalid Email.');
      return;
    }
    if (!validatePassword({ target: { value: passwordReg } })) {
      setPasswordError('Password must be at least 8 characters long and contain both letters and numbers.');
      return;
    }
    if (!validateContact({ target: { value: contactNoReg } })) {
      setContactError('Contact number must be 10 digits.');
      return;
    }
    if (!validateAddress({ target: { value: addressReg } })) {
      setAddressError('Address cannot be blank.');
      return;
    }

    // APIs
    APIRegister().REGISTER({
      name: nameReg,
      email: emailReg,
      password: passwordReg,
      contact: contactNoReg,
      address: addressReg,
      status: statusReg,
      role: roleReg
    }).then((response) => {
      console.log(response);
      if (response.status && response.message === 'User registered successfully') {
        setSuccessMessage('Account created successfully.');
        setErrorMessage('');
        handleSuccess('Account created successfully.');

        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      } else {
        setErrorMessage('Something went wrong.');
        setSuccessMessage('');
        handleError('Something went wrong.');
      }
    }).catch((error) => {
      console.error("Some error, solve it: ", error);
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        if (errorMessage === 'All fields are required') {
          setErrorMessage('Please fill out all fields.');
          handleError('Please fill out all fields.');
        } else if (errorMessage === 'User already exists') {
          setErrorMessage('Email or Contact No. is already used.');
          handleError('Email or Contact No. is already used.');
        } else if (errorMessage === 'Firm ID is required for firm_user role' || errorMessage === 'This firm is already assigned to another user') {
          setErrorMessage(errorMessage);
          handleError(errorMessage);
        } else {
          setErrorMessage('Something went wrong !!');
          handleError('Something went wrong !!');
        }
      } else {
        setErrorMessage('Something went wrong !!');
        handleError('Something went wrong !!');
      }

      setSuccessMessage('');

      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    });
  };


  const handleSuccess = (message) => {
    
    toast({
      title: `${message}`,
      description: 'We have created an account for you.',
      status: 'success',
      duration: 11000,
      isClosable: true,
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleError = (message) => {
    setSuccessMessage('');
    toast({
      title: 'Issue',
      description: `${message}`,
      status: 'error',
      duration: 11000,
      isClosable: true,
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="signup_background">
      <Container className="d-flex justify-content-center mt-5">
        <Row className="w-100">
          <Col md={6} lg={5} className="mx-auto">
            <Card className="p-4" id='card_border_color_change' style={{ boxShadow: "4px 4px 80px rgb(5, 5, 5)" }}>
              <Form>
                <h1 className="text-center">Sign Up now</h1>
                <InputGroup className="mb-3">
                  <Form.Control
                    value={nameReg}
                    onChange={validateName}
                    type="text"
                    placeholder="Name"
                  />
                </InputGroup>
                {nameError && <div className="text-danger mb-2">{nameError}</div>}
                <InputGroup className="mb-3">
                  <Form.Control
                    value={emailReg}
                    onChange={validateEmail}
                    type="email"
                    placeholder="Email"
                  />
                </InputGroup>
                {emailError && <div className="text-danger mb-2">{emailError}</div>}
                <InputGroup className="mb-3">
                  <Form.Control
                    value={passwordReg}
                    onChange={validatePassword}
                    type={showPassword ? 'text' : 'password'} // Toggle password visibility
                    placeholder="Password"
                  />
                  <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />} {/* Toggle eye icon */}
                  </InputGroup.Text>
                </InputGroup>
                {passwordError && <div className="text-danger mb-2">{passwordError}</div>}
                <InputGroup className="mb-3">
                  <Form.Control
                    value={contactNoReg}
                    onChange={validateContact}
                    type="tel"
                    placeholder="Contact"
                  />
                </InputGroup>
                {contactError && <div className="text-danger mb-2">{contactError}</div>}
                <InputGroup className="mb-3">
                  <Form.Control
                    value={addressReg}
                    onChange={validateAddress}
                    type="text"
                    placeholder="Address"
                  />
                </InputGroup>
                {addressError && <div className="text-danger mb-2">{addressError}</div>}
                <Row className="login_log_bt_row justify-content-center align-content-center mt-3">
                  <Col className="login_log_bt_col text-center">

                    <Button onClick={register} className="login_log_bt" id='but_color'>
                      Register
                    </Button>

                    {/* {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
                    {successMessage && <div className="text-success mt-2">{successMessage}</div>} */}
                  </Col>
                </Row>
                <Row className="login_signup_bt_row justify-content-center align-content-center mt-3">
                  <Col className="login_signup_bt_col text-center">
                    <Link to={'/'}>
                      <Button className="login_signup_bt" id='but_color'>
                        Go for Login
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;
