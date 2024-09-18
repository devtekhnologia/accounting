import React, { Component, Suspense } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import '../scss/style.scss'


const Routess = () => {

  const loading = (
    <div className="pt-3 text-center">
      <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
  )


  // Containers

  //--------------------------Admin Pages----------------------------------------------//

  const AdminLayout = React.lazy(() => import('../layout/AdminLayout'))

  const Edit_Profile = React.lazy(() => import('../views/admin/AdminDashboard/Edit_Profile'))

  //----------All Firms-------------//

  const All_Firms = React.lazy(() => import('../views/admin/Firms/All_Firms'))



  //-------------Create New Firms-------------//
  const Create_New_Firm = React.lazy(() => import('../views/admin/Firms/Create_New_Firm'))

  //-------------------Ledgers--------------------//
  const Ledgers = React.lazy(() => import('../views/admin/Ledgers/Ledgers'))

  const Create_Ledger = React.lazy(() => import('../views/admin/Ledgers/Create_Ledger'))

  //----------------All Users----------------//
  const All_Users = React.lazy(() => import('../views/admin/Users/All_Users'))

  //--------------Add New Users---------------//
  const Add_Users = React.lazy(() => import('../views/admin/Users/Add_Users'))

  //------------Payments----------------//
  const MakePayment = React.lazy(() => import('../views/admin/Payments/MakePayment'))
  const AllPayments = React.lazy(() => import('../views/admin/Payments/AllPayments'))

  //---------------Receipts--------------//
  const Create_Receipt = React.lazy(() => import('../views/admin/Receipts/CreateReceipt'))
  const AllReceipts = React.lazy(() => import('../views/admin/Receipts/AllReceipts'))

  //-----------Transfers----------------//
  const MakeTransfer = React.lazy(() => import('../views/admin/Transfers/MakeTransfer'))
  const AllTransfers = React.lazy(() => import('../views/admin/Transfers/AllTransfers'))

  //-------Reports-----//
  //-------------Firm Transactions--------------//
  const Firm_Transactions = React.lazy(() => import('../views/admin/Reports/Firm_Transactions/Firm_Transactions'))

  // //-------------User Transactions--------------//
  // const User_Transactions = React.lazy(() => import('../views/admin/Reports/User_Transactions/User_Transactions'))

  //-------------Day Book--------------//
  const Day_Book = React.lazy(() => import('../views/admin/Reports/Day_Book/Day_Book'))

  //-------------Ledger Report--------------//
  const Ledger_Report = React.lazy(() => import('../views/admin/Reports/Ledger_Report/Ledger_Report'))

  //-------------Cash Report--------------//
  const Cash_Report = React.lazy(() => import('../views/admin/Reports/Cash_Report/Cash_Report'))

  //-------------Complete Report--------------//
  const Complete_Report = React.lazy(() => import('../views/admin/Reports/Complete_Report/Complete_Report'))

  //-----Other Pages-----//
  const AdminSetting = React.lazy(() => import('../views/admin/AdminSetting'))
  const AdminHelp = React.lazy(() => import('../views/admin/AdminHelp'))

  //--------------------------Home Pages----------------------------------------------//
  const Home = React.lazy(() => import('../views/pages/home/Home'))
  const HomeContact = React.lazy(() => import('../views/pages/home/HomeContact'))
  const HomeAboutus = React.lazy(() => import('../views/pages/home/HomeAboutus'))
  const HomeSpecialFeatures = React.lazy(() => import('../views/pages/home/HomeSpecialFeatures'))
  const HomeProducts = React.lazy(() => import('../views/pages/home/HomeProducts'))
  const HomeHeader = React.lazy(() => import('../views/pages/home/HomeHeaderwithlogin'))







  //--------------------------Firm_User Pages----------------------------------------------//

  const FirmUsrDash = React.lazy(() => import('../layout/FirmUserLayout'))

  const User_Edit_Profile = React.lazy(() => import('../views/firm_user/FirmUsrDashboard/User_Edit_Profile'))


  //----------All Firms-------------//

  const User_All_Firms = React.lazy(() => import('../views/firm_user/Firms/User_All_Firms'))



  // //-------------Create New Firms-------------//
  // const Create_New_Firm = React.lazy(() => import('../views/admin/Firms/Create_New_Firm'))

  // //-------------------Ledgers--------------------//
  const User_Ledgers = React.lazy(() => import('../views/firm_user/Ledgers/User_Ledgers'))

  const User_Create_Ledger = React.lazy(() => import('../views/firm_user/Ledgers/User_Create_Ledger'))

  // //----------------All Users----------------//
  // const All_Users = React.lazy(() => import('../views/admin/Users/All_Users'))

  // //--------------Add New Users---------------//
  // const Add_Users = React.lazy(() => import('../views/admin/Users/Add_Users'))

  //------------Payments----------------//
  const User_MakePayment = React.lazy(() => import('../views//firm_user/Payments/User_MakePayment'))
  const User_AllPayments = React.lazy(() => import('../views/firm_user/Payments/User_AllPayments'))

  //---------------Receipts--------------//
  const User_CreateReceipt = React.lazy(() => import('../views/firm_user/Receipts/User_CreateReceipt'))
  const User_AllReceipts = React.lazy(() => import('../views/firm_user/Receipts/User_AllReceipts'))

  // //-----------Transfers----------------//
  const User_MakeTransfer = React.lazy(() => import('../views/firm_user/Transfers/User_MakeTransfer'))
  const User_AllTransfers = React.lazy(() => import('../views/firm_user/Transfers/User_AllTransfers'))

  //-------Reports-----//
  //-------------Firm Transactions--------------//
  const User_Firm_Transactions = React.lazy(() => import('../views/firm_user/Reports/Firm_Transactions/User_Firm_Transactions'))

  // //-------------User Transactions--------------//
  // const User_Transactions = React.lazy(() => import('../views/admin/Reports/User_Transactions/User_Transactions'))

  //-------------Day Book--------------//
  const User_Day_Book = React.lazy(() => import('../views/firm_user/Reports/Day_Book/User_Day_Book'))

  //-------------Ledger Report--------------//
  const User_Ledger_Report = React.lazy(() => import('../views/firm_user/Reports/Ledger_Report/User_Ledger_Report'))

  //-------------Cash Report--------------//
  const User_Cash_Report = React.lazy(() => import('../views/firm_user/Reports/Cash_Report/User_Cash_Report'))

  //-------------Complete Report--------------//
  const User_Complete_Report = React.lazy(() => import('../views/firm_user/Reports/Complete_Report/User_Complete_Report'))

  //--------------------------Login and Register Pages----------------------------------------------//
  const Login = React.lazy(() => import('../views/pages/login/Login'))
  const LoginForgotPassword = React.lazy(() => import('../views/pages/login/LoginForgotPassword'))
  const New_Password = React.lazy(() => import('../views/pages/login/New_Password'))
  const Signup = React.lazy(() => import('../views/pages/signup/Signup'))
  const Logout = React.lazy(() => import('../views/pages/logout/Logout'))
  const Page404 = React.lazy(() => import('../views/pages/page404/Page404'))
  const Page500 = React.lazy(() => import('../views/pages/page500/Page500'))






  return (
    <BrowserRouter>
      <Suspense fallback={loading}>
        <Routes>
          {/* --------Login Pages--------- */}

          <Route exact path="/" name="Login Page" element={<Login />} />
          <Route exact path="/forgotpassword" name="Forgot Password" element={<LoginForgotPassword />} />
          <Route exact path="/new_password/:contactNoReg" name="New_Password" element={<New_Password />} />
          <Route path="/logout" name="Logout" component={Logout} />


          {/* --------Register Pages--------- */}


          <Route exact path="/signup" name="Register Page" element={<Signup />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />


          {/* ----------------Home--------------------------------- */}
          <Route path="/home" name="Home Layout" element={<Home />} />
          <Route path="/ContactUs" name="Contact" element={<HomeContact />} />
          <Route path="/Aboutus" name="Aboutus" element={<HomeAboutus />} />
          <Route path="/SpecialFeatures" name="Special Features" element={<HomeSpecialFeatures />} />
          <Route path="/Products" name="Products" element={<HomeProducts />} />



          {/* ----------------Admin Dashboard--------------------------------- */}

          <Route path="/super_admin_dash" name="AdminDashboard" element={<AdminLayout />} />
          <Route path="/edit_profile" name="Edit_Profile" element={<Edit_Profile />} />


          {/* -------------All Firms------------- */}
          <Route path="/all_firms" name="All_Firms" element={<All_Firms />} />
          {/* -------------Create New Firms------------- */}
          <Route path="/create_firms" name="Create_New_Firm" element={<Create_New_Firm />} />
          {/* -------------Ledgerss------------- */}
          <Route path="/create_ledger" name="Create_Ledger" element={<Create_Ledger />} />

          <Route path="/ledgers" name="Ledgers" element={<Ledgers />} />
          {/* -------------All Users------------- */}
          <Route path="/all_users" name="All_Users" element={<All_Users />} />
          {/* ------------Add New Users------------- */}
          <Route path="/add_users" name="Add_Users" element={<Add_Users />} />
          {/* -------------Payments------------- */}
          <Route path="/make_payment" name="MakePayment" element={<MakePayment />} />
          <Route path="/all_payments" name="AllPayments" element={<AllPayments />} />
          {/* -------------Receipts------------- */}
          <Route path="/create_receipt" name="Create_Receipt" element={<Create_Receipt />} />
          <Route path="/all_receipts" name="AllReceipts" element={<AllReceipts />} />
          {/* -------------Transfers------------ */}
          <Route path="/make_transfer" name="MakeTransfer" element={<MakeTransfer />} />
          <Route path="/all_transfers" name="AllTransfers" element={<AllTransfers />} />
          {/* --------Reports--------- */}
          {/* -------------Firm Transactions------------- */}
          <Route path="/firm_transactions" name="Firm_Transactions" element={<Firm_Transactions />} />
          {/* -------------User Transactions-------------
          <Route path="/user_transactions" name="User_Transactions" element={<User_Transactions />} /> */}
          {/* -------------Day Book------------- */}
          <Route path="/day_book" name="Day_Book" element={<Day_Book />} />

          {/* -------------Ledger_Report------------- */}
          <Route path="/ledger_report" name="Ledger_Report" element={<Ledger_Report />} />

          {/* -------------Cash_Report------------- */}
          <Route path="/cash_report" name="Cash_Report" element={<Cash_Report />} />

          {/* -------------Complete_Report------------- */}
          <Route path="/complete_report" name="Complete_Report" element={<Complete_Report />} />

          {/* -------------Other Pages------------- */}
          <Route path="/adminsetting" name="AdminSetting" element={< AdminSetting />} />
          <Route path="/adminhelp" name="AdminHelp" element={< AdminHelp />} />






          {/* -------------Firm_User Pages----------------------------------------------------------------------------------------------------------- */}
          <Route path="/firm_user_dash" name="Firm_User_Dash" element={< FirmUsrDash />} />
          <Route path="/user_edit_profile" name="Firm_User_Dash" element={< User_Edit_Profile />} />

          {/* -------------All Firms------------- */}
          <Route path="/user_all_firms" name="User_All_Firms" element={<User_All_Firms />} />
          {/* -------------Create New Firms------------- */}
          <Route path="/create_firms" name="Create_New_Firm" element={<Create_New_Firm />} />
          {/* -------------Ledgerss------------- */}
          <Route path="/user_create_ledger" name="User_Create_Ledger" element={<User_Create_Ledger />} />

          <Route path="/user_ledgers" name="User_Ledgers" element={<User_Ledgers />} />
          {/* -------------All Users------------- */}
          <Route path="/all_users" name="All_Users" element={<All_Users />} />
          {/* ------------Add New Users------------- */}
          <Route path="/add_users" name="Add_Users" element={<Add_Users />} />
          {/* -------------Payments------------- */}
          <Route path="/user_makepayment" name="User_MakePayment" element={<User_MakePayment />} />
          <Route path="/user_allpayments" name="User_AllPayments" element={<User_AllPayments />} />
          {/* -------------Receipts------------- */}
          <Route path="/user_createreceipt" name="User_CreateReceipt" element={<User_CreateReceipt />} />
          <Route path="/user_allreceipts" name="User_AllReceipts" element={<User_AllReceipts />} />
          {/* -------------Transfers------------ */}
          <Route path="/user_maketransfer" name="User_MakeTransfer" element={<User_MakeTransfer />} />
          <Route path="/user_alltransfers" name="User_AllTransfers" element={<User_AllTransfers />} />
          {/* --------Reports--------- */}
          {/* -------------Firm Transactions------------- */}
          <Route path="/user_firm_transactions" name="User_Firm_Transactions" element={<User_Firm_Transactions />} />
          {/* -------------User Transactions-------------
          <Route path="/user_transactions" name="User_Transactions" element={<User_Transactions />} /> */}
          {/* -------------Day Book------------- */}
          <Route path="/user_day_book" name="User_Day_Book" element={<User_Day_Book />} />

          {/* -------------User_Ledger_Report------------- */}
          <Route path="/user_ledger_report" name="User_Ledger_Report" element={<User_Ledger_Report />} />

          {/* -------------User_Cash_Report------------- */}
          <Route path="/user_cash_report" name="User_Cash_Report" element={<User_Cash_Report />} />

          {/* -------------User_Complete_Report------------- */}
          <Route path="/user_complete_report" name="User_Complete_Report" element={<User_Complete_Report />} />


          {/* -------------Other Pages------------- */}
          <Route path="/adminsetting" name="AdminSetting" element={< AdminSetting />} />
          <Route path="/adminhelp" name="AdminHelp" element={< AdminHelp />} />



        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default Routess
