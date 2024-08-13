import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
// routes config
import routes from '../../Route/Routess'
import FirmusrDashboard from '../../views/firm_user/FirmUsrDashboard/FirmUserDashboard'


const FirmusrContent = () => {
  return (
    <CContainer lg>
      <FirmusrDashboard />
    </CContainer>
  )
}

export default React.memo(FirmusrContent)
