import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  InputGroup
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Auth, http } from 'src/auth/AuthUser';
import { APIRegister } from 'src/api/APIRegister';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from 'src/context/UserContextProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  useEffect(() => {
    console.log(user.userId); // Log userId whenever user state changes
  }, [user]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const login = () => {
    if (!validateEmail(email)) {
      setErrorMessage('Invalid email');
      return;
    }

    APIRegister().LOGIN({
      email: email,
      password: password,
    }).then((response) => {
      console.log(response);
      const token = response.data.token;
      console.log(response);
      const userdata = jwtDecode(token);
      console.log(userdata);

      setUser(prevState => ({
        ...prevState,
        userId: userdata.userId,
        email: userdata.email,
        role: userdata.role
      }));

      if (response.status && response.message === 'Login successful') {
        setSuccessMessage('Logged in successfully!');
        Auth.login(token);

        if (userdata.role === 'firm_user') {
          navigate('/firm_user_dash');
        } else {
          navigate('/super_admin_dash');
        }
        setTimeout(() => {
          window.location.reload();
        }, 1000);

      } else {
        setErrorMessage('Unexpected response from server');
        setSuccessMessage('');
      }

    }).catch((error) => {
      console.error("Some error, solve it: ", error);
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        if (errorMessage === 'Email and password are required') {
          setErrorMessage('All fields are required');
        } else {
          setErrorMessage('Invalid credentials');
        }
      } else {
        setErrorMessage('Something went wrong !!');
      }
      setSuccessMessage('');
    });
  };

  return (
    <div className="login_background">
      <Container className="d-flex justify-content-center mt-5">
        <Row className="w-100">
          <Col md={6} className="mx-auto">
            <Card className='p-5' id='card_border_color_change' style={{ boxShadow: "4px 4px 60px rgb(61, 61, 61)" }}>
              <Form className="needs-validation" noValidate>
                <h1 className='text-center defaultcolor'>Log In</h1>
                <InputGroup className="mb-2">
                  <Form.Control
                    className='input_fields'
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ borderRadius: '8px' }}
                    type="email"
                    placeholder='Email address'
                  />
                </InputGroup>
                <InputGroup className="mb-4">
                  <Form.Control
                    className='input_fields'
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ borderRadius: '8px' }}
                    type={showPassword ? "text" : "password"} // Toggle type based on showPassword state
                    placeholder='Password'
                  />
                  <InputGroup.Text
                    onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />} {/* Show eye or eye-slash icon */}
                  </InputGroup.Text>
                </InputGroup>
                <Row className='login_log_bt_row justify-content-center align-content-center'>
                  <Col xs={12} className='login_log_bt_col text-center'>
                    <Button onClick={login} className="login_log_bt" id='but_color' type='button'>
                      Log in
                    </Button>
                    {errorMessage && <div className="text-danger">{errorMessage}</div>}
                    {successMessage && <div className="text-success">{successMessage}</div>}
                  </Col>
                </Row>
                <Row className="login_signup_bt_row justify-content-center align-content-center mt-3">
                  <Col className="login_signup_bt_col text-center">
                    <Link to={'/signup'}>
                      <Button className="login_signup_bt" id='but_color'>
                        New User ? Signup
                      </Button>
                    </Link>
                  </Col>
                </Row>
                <br />
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
