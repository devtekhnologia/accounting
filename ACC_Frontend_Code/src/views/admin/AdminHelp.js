import React from 'react'
import { AdminSidebar, AdminHeader, AppFooter } from '../../components/index'
import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem, CButton, CCard, CCardHeader, CCol, CForm, CFormInput, CRow } from '@coreui/react'
import { Accordion } from 'reactstrap'

const AdminHelp = () => {
    return (
        <div>
            <AdminSidebar />
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                <AdminHeader />
                <div className="body flex-grow-1 px-5">
                    <div class="container text-center">

                        <CRow>
                            <CCol className='col-md-6'>
                                <CCard className='p-3 card_border_color_change' style={{ borderColor: "white" }}>
                                    <CCardHeader className='mb-2' style={{ backgroundColor: "#0A2E73", color: "white", borderColor: "#0A2E73" }}>Get Help</CCardHeader>
                                    <div class="mb-3" id="first">
                                        <label for="basic-url" class="form-label">Examiner ID</label>
                                        <input class="form-control" list="datalistOptions" id="exampleDataList" />
                                    </div>
                                    <div class="mb-3" id="first">
                                        <label for="basic-url" class="form-label">School Name</label>
                                        <input class="form-control" list="datalistOptions" id="exampleDataList" />
                                    </div>
                                    <div class="mb-3" id="first">
                                        <label for="basic-url" class="form-label">Address</label>
                                        <input class="form-control" list="datalistOptions" id="exampleDataList" />
                                    </div>
                                    <div class="mb-3" id="first">
                                        <label for="basic-url" class="form-label">Your Query</label>
                                        <input class="form-control" list="datalistOptions" id="exampleDataList" />
                                    </div>
                                    <div class="mb-3" id="first">
                                        <label for="basic-url" class="form-label">City</label>
                                        <input class="form-control" list="datalistOptions" id="exampleDataList" />
                                    </div>
                                    <div class="mb-3" id="first">
                                        <label for="basic-url" class="form-label">Date</label>
                                        <input class="form-control" list="datalistOptions" id="exampleDataList" />
                                    </div>
                                    <CButton className='col-md-6 align-self-center' style={{ backgroundColor: "#0A2E73", color: "white", borderColor: "#0A2E73" }}>
                                        Submit
                                    </CButton>
                                </CCard>

                            </CCol>
                            <CCol className='col-md-6'>
                                <CCard className='p-3 card_border_color_change' style={{ borderColor: "white" }}>
                                    <CCardHeader style={{ backgroundColor: "#0A2E73", color: "white", borderColor: "#0A2E73" }}>FAQs</CCardHeader>

                                    <CAccordion flush>
                                        <CAccordionItem itemKey={1}>
                                            <CAccordionHeader>How much Time does revaluation take ?</CAccordionHeader>
                                            <CAccordionBody>
                                                <strong>This is the first item's accordion body.</strong> It is hidden by default, until the
                                                collapse plugin adds the appropriate classes that we use to style each element. These classes
                                                control the overall appearance, as well as the showing and hiding via CSS transitions. You can
                                                modify any of this with custom CSS or overriding our default variables. It's also worth noting
                                                that just about any HTML can go within the <code>.accordion-body</code>, though the transition
                                                does limit overflow.
                                            </CAccordionBody>
                                        </CAccordionItem>
                                        <CAccordionItem itemKey={2}>
                                            <CAccordionHeader>Do Marks increase after revaluation</CAccordionHeader>
                                            <CAccordionBody>
                                                <strong>This is the second item's accordion body.</strong> It is hidden by default, until the
                                                collapse plugin adds the appropriate classes that we use to style each element. These classes
                                                control the overall appearance, as well as the showing and hiding via CSS transitions. You can
                                                modify any of this with custom CSS or overriding our default variables. It's also worth noting
                                                that just about any HTML can go within the <code>.accordion-body</code>, though the transition
                                                does limit overflow.
                                            </CAccordionBody>
                                        </CAccordionItem>
                                        <CAccordionItem itemKey={3}>
                                            <CAccordionHeader>Will marks decrease after revaluation</CAccordionHeader>
                                            <CAccordionBody>
                                                <strong>This is the second item's accordion body.</strong> It is hidden by default, until the
                                                collapse plugin adds the appropriate classes that we use to style each element. These classes
                                                control the overall appearance, as well as the showing and hiding via CSS transitions. You can
                                                modify any of this with custom CSS or overriding our default variables. It's also worth noting
                                                that just about any HTML can go within the <code>.accordion-body</code>, though the transition
                                                does limit overflow.
                                            </CAccordionBody>
                                        </CAccordionItem>
                                        <CAccordionItem itemKey={2}>
                                            <CAccordionHeader>What if marks will not change</CAccordionHeader>
                                            <CAccordionBody>
                                                <strong>This is the second item's accordion body.</strong> It is hidden by default, until the
                                                collapse plugin adds the appropriate classes that we use to style each element. These classes
                                                control the overall appearance, as well as the showing and hiding via CSS transitions. You can
                                                modify any of this with custom CSS or overriding our default variables. It's also worth noting
                                                that just about any HTML can go within the <code>.accordion-body</code>, though the transition
                                                does limit overflow.
                                            </CAccordionBody>
                                        </CAccordionItem>
                                    </CAccordion>
                                </CCard>

                            </CCol>
                        </CRow>
                    </div>
                </div>
                <AppFooter />
            </div>
        </div>
    )
}

export default AdminHelp

