import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Currency from "./pages/Currencymanagement";
import Wallet from "./pages/Walletmanagement";
import AdminWallet from "./pages/AdminWallet";
import WalletTransaction from "./pages/WalletTransaction";
import User from "./pages/Usermanagemnet";
import Deposit from "./pages/Depositmanagement";
import Withdraw from "./pages/Withdrawmanagement";
import CMS from "./pages/CMSmanagement";
import Email from "./pages/Emailmanagement";
import Profit from "./pages/Profitmanagement";
import Profile from "./pages/Profile";
import SiteSettings from "./pages/Sitesettings";
import Tradepair from "./pages/tradepair";
import Profits from "./pages/profits";
import SupportCategory from "./pages/SupportCategory";
import Support from "./pages/Support";
import EmailTemplate from "./pages/Emailmanagement";
import RewardManagement from "./pages/RewardManagement";
import ReferralManagement from "./pages/ReferralManagement";
import UserTrade from "./pages/UserTrade";
import Swaping from "./pages/Swaping";
import CmsManagement from "./pages/CMSmanagement";
import ForgotPassword from "./pages/ForgotPassword";
import AirdropManagement from "./pages/AirdropManagement";
import InternalTransfer from "./pages/InternalTransfer";
import P2Porders from "./pages/P2Porders";
import P2Pdispute from "./pages/P2Pdispute";
import PaymentMethod from "./pages/PaymentMethod";

import TFA from "./pages/Tfa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { removeAuthToken } from "../src/core/lib/localStorage";

function App() {
  function RequireAuth({ children }) {
    var data = sessionStorage.getItem("user_token");
    return data ? children : removeAuthToken();
  }

  return (
    <>
      <BrowserRouter basename="/admin">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/currencymanagement"
            element={
              <RequireAuth>
                <Currency />
              </RequireAuth>
            }
          />
          <Route
            path="/walletmanagement"
            element={
              <RequireAuth>
                <Wallet />
              </RequireAuth>
            }
          />
          <Route
            path="/adminwallet"
            element={
              <RequireAuth>
                <AdminWallet />
              </RequireAuth>
            }
          />
          <Route
            path="/adminwallettransaction"
            element={
              <RequireAuth>
                <WalletTransaction />
              </RequireAuth>
            }
          />
          <Route
            path="/usermanagement"
            element={
              <RequireAuth>
                <User />
              </RequireAuth>
            }
          />
          <Route
            path="/depositmanagement"
            element={
              <RequireAuth>
                <Deposit />
              </RequireAuth>
            }
          />
          <Route
            path="/withdrawmanagement"
            element={
              <RequireAuth>
                <Withdraw />
              </RequireAuth>
            }
          />
          <Route
            path="/cmsmanagement"
            element={
              <RequireAuth>
                <CMS />
              </RequireAuth>
            }
          />
          <Route
            path="/emailmanagement"
            element={
              <RequireAuth>
                <Email />
              </RequireAuth>
            }
          />
          <Route
            path="/profitmanagement"
            element={
              <RequireAuth>
                <Profit />
              </RequireAuth>
            }
          />
          <Route
            path="/adminprofile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/sitesetting"
            element={
              <RequireAuth>
                <SiteSettings />
              </RequireAuth>
            }
          />
          <Route path="/verify-2fa" element={<TFA />} />
          <Route
            path="/tradepair"
            element={
              <RequireAuth>
                <Tradepair />
              </RequireAuth>
            }
          />
          <Route
            path="/profits"
            element={
              <RequireAuth>
                <Profits />
              </RequireAuth>
            }
          />
          <Route
            path="/supportcategory"
            element={
              <RequireAuth>
                <SupportCategory />
              </RequireAuth>
            }
          />
          <Route
            path="/support"
            element={
              <RequireAuth>
                <Support />
              </RequireAuth>
            }
          />
          <Route
            path="/emailtemplate"
            element={
              <RequireAuth>
                <EmailTemplate />
              </RequireAuth>
            }
          />
          <Route
            path="/cmsmanagement"
            element={
              <RequireAuth>
                <CmsManagement />
              </RequireAuth>
            }
          />
          {/* <Route
            path="/rewardmanagement"
            element={
              <RequireAuth>
                <RewardManagement />
              </RequireAuth>
            }
          />
          <Route
            path="/referralmanagement"
            element={
              <RequireAuth>
                <ReferralManagement />
              </RequireAuth>
            }
          />
          <Route
            path="/airdropmanagement"
            element={
              <RequireAuth>
                <AirdropManagement />
              </RequireAuth>
            }
          /> */}
          <Route
            path="/usertrade"
            element={
              <RequireAuth>
                <UserTrade />
              </RequireAuth>
            }
          />
          <Route
            path="/swaping"
            element={
              <RequireAuth>
                <Swaping />
              </RequireAuth>
            }
          />
          {/* <Route
            path="/internaltransfer"
            element={
              <RequireAuth>
                <InternalTransfer />
              </RequireAuth>
            }
          /> */}
          <Route
            path="/p2p_payment_method"
            element={
              <RequireAuth>
                <PaymentMethod />
              </RequireAuth>
            }
          />
           <Route
            path="/P2Porders"
            element={
              <RequireAuth>
                <P2Porders />
              </RequireAuth>
            }
          />
          <Route
            path="/P2Pdispute"
            element={
              <RequireAuth>
                <P2Pdispute />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
