import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CImage, CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AdminSidebarNav } from './AdminSidebarNav'

import { logoNegative } from 'src/assets/brand/logo-negative'
import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../../views/nav/_adminnav'
import { cibChef } from '@coreui/icons'
import fin_acc_logo from 'src/assets/brand/accounts_brand_logo.png'


const AdminSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
      style={{borderRadius:'0px 0px 50px 0px', boxShadow: '0px 7px 15px rgb(71, 71, 71)' }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/admin">
        <CImage src={fin_acc_logo} style={{height:"60px"}} />
        {/* <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
          <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} /> 
        <CIcon className="sidebar-brand-full" icon={cibChef} height={35} /> */}
        {/* <span></span>*/}
        <div style={{color:'black', fontWeight:'500'}}>TEKHNO FINTEK ACC</div>
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AdminSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      {/* <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      /> */}
    </CSidebar>
  )
}

export default React.memo(AdminSidebar)
