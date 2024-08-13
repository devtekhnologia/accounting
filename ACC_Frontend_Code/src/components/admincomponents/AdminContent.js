import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
// routes config
import routes from '../../Route/Routess'
import AdminDashboard from '../../views/admin/AdminDashboard/AdminDashboard'


const AdminContent = () => {
  return (
    <CContainer lg>
      <AdminDashboard />
    </CContainer>
  )
}

export default React.memo(AdminContent)
