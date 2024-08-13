import { CNav, CNavLink } from '@coreui/react'
import React from 'react'
import Colors from '@coreui/react'
import HomeContact from './HomeContact'

const HomeFooter = () => {
    return (
        <div className='d-flex home-center' style={{ backgroundColor: "black", color: 'white' }}>
            <div className='p-5'>
                <b>Features</b>
                
                <CNavLink href='/SpecialFeatures'>Special Features </CNavLink>
                <CNavLink href='#'> Exam Types</CNavLink>
                <CNavLink href='#'> Onscreen Evaluation</CNavLink>
                <CNavLink href='#'> Question Bank</CNavLink>
                
            </div>
            <div className='p-5'>
                <b>
                    For Education
                </b>
                
                <CNavLink href='#'> Online Exam For School</CNavLink>
                <CNavLink href='#'> Exam Invigilation</CNavLink>

            </div>
            <div className='p-5'>
                <b>
                    About Us 
                </b>
                
                <CNavLink href='/Aboutus'> About QPE </CNavLink>
                <CNavLink href='/ContactUs'> Contact Us</CNavLink>
                <CNavLink href='#'> Terms of Use </CNavLink>
                <CNavLink href='#'> Privacy Policy</CNavLink>
                <CNavLink href='#'> Refunds and Cancellation</CNavLink>
                
            </div>
        </div>
    )
}

export default HomeFooter
