import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBarChart,
  cilBell,
  cilCalculator,
  cilChart,
  cilChartLine,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeech,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import Dashboard_icon from 'src/assets/icons/sidebar_icons/Dashboard.png'
import Firms_icon from 'src/assets/icons/sidebar_icons/Firms.png'
import Firm_acc_icon from 'src/assets/icons/sidebar_icons/Firm_acc.png'
import Users_icon from 'src/assets/icons/sidebar_icons/Users.png'
import payments_icon from 'src/assets/icons/sidebar_icons/payments.png'
import receipts_icon from 'src/assets/icons/sidebar_icons/receipts.png'
import transfers_icon from 'src/assets/icons/sidebar_icons/transfers.png'
import reports_icon from 'src/assets/icons/sidebar_icons/reports.png'

import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import routes from '../../Route/Routess'

const _firmusernav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/firm_user_dash',
    icon: <img src={Dashboard_icon} width={29} height={24} className='mx-2' />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Section',
  },
  {
    component: CNavGroup,
    name: 'Firms',
    icon: <img src={Firms_icon} width={23} height={23} className='mx-3' />,
    items: [
      {
        component: CNavItem,
        name: 'My Firms',
        to: '/user_all_firms',
      },
      // {
      //   component: CNavItem,
      //   name: 'User Transactions',
      //   to: '/user_transactions',
      // },
    ],
  },
  {
    component: CNavItem,
    name: 'Firm Accounts',
    to: '/user_ledgers',
    icon: <img src={Firm_acc_icon} width={23} height={23} className='mx-3' />,
  },
  {
    component: CNavItem,
    name: 'Payments',
    to: '/user_makepayment',
    icon: <img src={payments_icon} width={23} height={23} className='mx-3' />,
  },
  {
    component: CNavItem,
    name: 'Receipts',
    to: '/user_createreceipt',
    icon: <img src={receipts_icon} width={23} height={23} className='mx-3' />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Make Transaction',
  //   to: '/user_maketransfer',
  //   icon: <img src={transfers_icon} width={23} height={23} className='mx-3' />,
  // },
  {
    component: CNavGroup,
    name: 'Reports',
    icon: <img src={reports_icon} width={23} height={23} className='mx-3' />,
    items: [
      {
        component: CNavItem,
        name: 'Firms Transactions',
        to: '/user_firm_transactions',
      },
      // {
      //   component: CNavItem,
      //   name: 'User Transactions',
      //   to: '/user_transactions',
      // },
    ],
  },
  // {
  //   component: CNavItem,
  //   name: 'Setting',
  //   to: '/adminsetting',
  //   icon: <CIcon icon={cilSpeech} />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Help',
  //   to: '/adminhelp',
  //   icon: <CIcon icon={cilSpeech} />,
  // },


]

export default _firmusernav