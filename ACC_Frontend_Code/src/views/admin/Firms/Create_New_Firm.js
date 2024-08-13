import React, { useContext, useState } from 'react';
import { AdminHeader, AdminSidebar } from 'src/components';
import AllFirms_logo from 'src/assets/images/admin_dashboard_icons/AllFirms.png';
import { Form, FormControl, FormGroup, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { APIAdmin } from 'src/api/APIAdmin';
import { UserContext } from 'src/context/UserContextProvider';
import 'src/scss/_custom.scss';
import Firms_icon from 'src/assets/icons/sidebar_icons/Firms.png'


const Create_New_Firm = () => {
    const { user } = useContext(UserContext);
    const userId = user.userId;

    const [firmName, setFirmName] = useState('');
    const [firmAddress, setFirmAddress] = useState('');
    const [firmGstno, setFirmGstno] = useState('');
    const [firmEmail, setFirmEmail] = useState('');

    const [fnameError, setFNameError] = useState('');
    const [femailError, setFEmailError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [gstnoError, setGSTnoError] = useState('');

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Validation functions
    const validateFName = (e) => {
        setFirmName(e.target.value);

        if (e.target.value.length < 2) {
            setFNameError('Name must be at least 2 characters long.');
            return false;
        }

        const regex = /^[a-zA-Z0-9\s!@#$%^&*(),.?":{}|<>]+$/;
        if (regex.test(e.target.value)) {
            setFNameError('');
            return true;
        } else {
            setFNameError('Only letters, numbers, spaces, and special characters are allowed.');
            return false;
        }
    };


    const validateEmail = (e) => {
        if ((e.target.value).length >= 0) {
            setFirmEmail(e.target.value);
            setFEmailError('');

            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (regex.test(firmEmail)) {
                setFEmailError('');
                return true;
            } else {
                setFEmailError('Enter valid email address.');
                return false;
            }
        } else {
            setFEmailError('Email address must not be blank.');
            return false;
        }
    };

    const validateGst = (e) => {
        const gstNo = e.target.value;

        // Update the GST number state
        setFirmGstno(gstNo);

        // Clear previous error messages
        setGSTnoError('');

        // Define the regex to match exactly 15 characters with letters and numbers
        const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

        // Check if the GST number matches the regex
        if (gstNo.length === 0) {
            setGSTnoError('GST number must not be blank.');
            return false;
        } else if (gstNo.length !== 15) {
            setGSTnoError('GST number must be exactly 15 characters long.');
            return false;
        } else if (regex.test(gstNo)) {
            setGSTnoError('');
            return true;
        } else {
            setGSTnoError('GST number must contain the correct format of letters and numbers.');
            return false;
        }
    };

    const validateAddress = (e) => {
        if ((e.target.value).length >= 0) {
            setFirmAddress(e.target.value);
            setAddressError('');
            return true;
        } else {
            setAddressError('Address cannot be blank.');
            return false;
        }
    };

    const create_firm = () => {
        if (!validateFName({ target: { value: firmName } })) {
            setFNameError('Enter valid name.');
            return;
        }
        if (!validateEmail({ target: { value: firmEmail } })) {
            setFEmailError('Invalid Email.');
            return;
        }
        if (!validateGst({ target: { value: firmGstno } })) {
            setGSTnoError('GST No. must be exactly 15 digits and contain letters and numbers.');
            return;
        }
        if (!validateAddress({ target: { value: firmAddress } })) {
            setAddressError('Address cannot be blank.');
            return;
        }

        APIAdmin().CREATE_FIRM(userId, {
            firm_name: firmName,
            firm_email: firmEmail,
            firm_gstno: firmGstno,
            firm_address: firmAddress,
            firm_status: "1"
        }).then((response) => {
            setSuccessMessage('Firm added successfully with GST NO.', firmGstno);
            setErrorMessage('');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }).catch((error) => {
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : 'Please fill out details again.';
            setErrorMessage(errorMessage);
            setSuccessMessage('');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    };

    return (
        <div>
            <AdminSidebar />
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                <AdminHeader />
                <div className="body flex-grow-1 px-3 px-sm-0">
                    <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10} lg={8}>
                            <div className="card_border_color_change py-5" style={{ borderColor: "white", borderRadius: "10px" }}>
                                <Row className='align-items-center'>
                                    <Col style={{ marginLeft: "11px" }}>
                                        <Row className='allfirms_icon_title_row align-items-center'>
                                            <Col className='col-2 col-md-1'>
                                                <img className='sidebar_icon_color' src={Firms_icon} width={25} height={25} alt="All Firms Logo" />
                                            </Col>
                                            <Col className='col-9 col-md-9'>
                                                <h5 className="title_font mb-0" style={{ color: 'white' }}>Create Firm</h5>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col className="col-4 facc_crea_but_col">
                                        <Link to={'/all_firms'}>
                                            <Button id="but_color" className='m-0'>All Firms</Button>
                                        </Link>
                                    </Col>
                                </Row>
                                {/* <Row className="allfirms_title_mainrow">
                                    <Col xs={8} style={{ marginLeft: "10px" }} className='col-12'>
                                        <Row className="allfirms_title_row py-1 align-items-center">
                                            <Col xs={1} className='col-1'>
                                                <img className='sidebar_icon_color' src={Firms_icon} width={25} height={25} alt="All Firms Logo" />
                                            </Col>
                                            <Col xs={4} sm={7} className='col-1'>
                                                <h5 className="mb-0 title_font" style={{color: 'white'}}>Create Firm</h5>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={3} className="text-start col-4">
                                        <Link to={'/all_firms'}>
                                            <Button id="but_color">All Firms</Button>
                                        </Link>
                                    </Col>
                                </Row> */}

                                <Row className="allfirms_table_row py-5 justify-content-center">
                                    <Col xs={12} md={8}>
                                        <Form>
                                            <FormGroup className="mb-2" controlId="formFirmName">
                                                <FormControl
                                                    type="text"
                                                    placeholder="Firm Name"
                                                    value={firmName}
                                                    onChange={validateFName}
                                                />
                                            </FormGroup>
                                            {fnameError && <div className="text-danger mb-2">{fnameError}</div>}

                                            <FormGroup className="mb-2" controlId="formEmailID">
                                                <FormControl
                                                    type="email"
                                                    placeholder="Email address"
                                                    value={firmEmail}
                                                    onChange={validateEmail}
                                                />
                                            </FormGroup>
                                            {femailError && <div className="text-danger mb-2">{femailError}</div>}

                                            <FormGroup className="mb-2" controlId="formAddress">
                                                <FormControl
                                                    type="text"
                                                    placeholder="Address"
                                                    value={firmAddress}
                                                    onChange={validateAddress}
                                                />
                                            </FormGroup>
                                            {addressError && <div className="text-danger mb-2">{addressError}</div>}

                                            <FormGroup className="mb-2" controlId="formGSTNumber">
                                                <FormControl
                                                    type="text"
                                                    placeholder="GST Number"
                                                    value={firmGstno}
                                                    onChange={validateGst}
                                                />
                                                <div style={{ color: 'green', fontSize: '14px' }}>[GST NO. must be in a format "22 AAAAA9898A 3 Z 7"]</div>
                                            </FormGroup>
                                            {gstnoError && <div className="text-danger mb-2">{gstnoError}</div>}

                                            {/* <FormGroup className="mb-3" controlId="formStatus">
                                                <FormControl
                                                    type="text"
                                                    placeholder="Status"
                                                    disabled
                                                />
                                            </FormGroup> */}

                                            <Row className="justify-content-center align-content-center cf_acc_bt_row">
                                                <Button onClick={create_firm} id='but_color'>Save</Button>

                                            </Row>
                                            <Row>
                                                {errorMessage && <div className="text-danger mt-2 text-center err_msg">{errorMessage}</div>}
                                                {successMessage && <div className="text-success mt-2 text-center err_msg">{successMessage}</div>}
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
}

export default Create_New_Firm;
