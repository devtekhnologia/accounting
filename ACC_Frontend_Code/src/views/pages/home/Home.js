import React, { useState } from 'react'
import {
    CAccordion,
    CAccordionBody,
    CAccordionHeader,
    CAccordionItem,
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CForm,
    CFormCheck,
    CFormInput,
    CFormSelect,
    CFormTextarea,
    CHeader,
    CHeaderBrand,
    CHeaderNav,
    CImage,
    CInputGroup,
    CInputGroupText,
    CNavItem,
    CNavLink,
    CNavbar,
    CRow,
    Colors
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cibChef, cilAlignRight, cilLockLocked, cilUser, cilVerticalAlignTop } from '@coreui/icons'
import { NavLink } from 'react-router-dom'
import image from 'src/assets/images/image1.jpg'
import HomeHeader from './HomeHeaderwithlogin'
import Accordion from '@coreui/react'
import video from 'src/assets/videos/video.webm'
import { Button } from '@coreui/react'
import solution from 'src/assets/images/Home/solution.jpg'
import HomeWidgets from 'src/assets/widgets/HomeWidgets'
import homeexam from 'src/assets/images/Home/homeexam.png'
import HomeFooter from './HomeFooter'
import onlineexam from 'src/assets/images/Home/onlineexam.png'
import exam1 from 'src/assets/images/Home/exam1.png'
import exam2 from 'src/assets/images/Home/exam2.png'
import HomeHeaderwithlogin from './HomeHeaderwithlogin'
import { AppFooter, ExaminerHeader, ExaminerSidebar } from 'src/components'





const Home = () => {
    const sitelogo = {}

    return (

        
            
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                {/* <HomeHeaderwithlogin /> */}
                <div className="body flex-grow-1 px-5">

                    <CRow>
                        <h1>
                            Wait !! Screen is going to be ready !!
                        </h1>
                    </CRow>


                </div>
                <AppFooter />
            </div>
        
        
    )
}

export default Home