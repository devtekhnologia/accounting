import React from 'react'
import { FirmusrContent, FirmusrHeader, FirmusrSidebar } from '../components/index'
// import AdminDashboard from 'src/views/admin/AdminDashboard'

const FirmUserLayout = () => {
  return (
    <div>
      <FirmusrSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <FirmusrHeader />
        <div className="body flex-grow-1 px-5">
          <FirmusrContent />
        </div>
        {/* <AppFooter /> */}
      </div>
    </div>
  )
}

export default FirmUserLayout