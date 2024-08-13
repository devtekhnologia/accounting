import React from 'react'
import HomeHeader from './HomeHeaderwithlogin'
import image from 'src/assets/images/about.jpg'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const HomeAboutus = () => {
    return (
        <div > <HomeHeader />
            <div  >
                <div>
                <CCard>
                    <CCardBody>
                    <h1><b>About Us</b></h1>
                    <p><br/>
                    <br/>
                    The Ultimate Solution for Reliable, Accurate, and Scalable Assessments!<br/>
                    We are the easy system of Plug-and-Play SaaS platform to make 
                    the academic examination and hiring assessment process a lot more 
                    reliable, accurate and scalable.
                    </p>
                    </CCardBody>
                </CCard>
                </div>
            </div>
        </div>
    )
}

export default HomeAboutus
