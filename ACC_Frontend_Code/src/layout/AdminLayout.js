import React from 'react'
import { AdminContent, AdminSidebar, AppFooter, AdminHeader } from '../components/index'
// import AdminDashboard from 'src/views/admin/AdminDashboard'

const AdminLayout = () => {
  return (
    <div>
      <AdminSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AdminHeader />
        <div className="body flex-grow-1 px-0">
          <AdminContent />
        </div>
        {/* <AppFooter /> */}
      </div>
    </div>
  )
}

export default AdminLayout