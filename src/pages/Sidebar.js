


import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import { postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { toast } from "react-toastify";

import {
  removeAuthToken,
  getAuthToken,
  getSocketToken,
} from "../core/lib/localStorage";
import { removeAuthorization } from "../core/service/axios";

function Sidebar() {

  const theme = useTheme();
  const navigate = useNavigate();
  const [isToastShown, setIsToastShown] = useState(false);
  let toastId = null;

  useEffect(() => {
    const verifyToken = async () => {
      console.log("-------Verification calls---------");
      const token = sessionStorage.getItem("user_token");

      if (token) {
        try {
          const datas = {
            apiUrl: apiService.verifyToken, // Endpoint for token verification
            payload: { token },
          };

          const response = await postMethod(datas);

          if (response.status === 401 || response.message === "TokenExpired") {
            handleLogout();
          } else {
            console.log("Token is valid");
          }
        } catch (error) {
          console.log("Error in token verification", error);
          handleLogout(); // Handle error in verification process, assuming token might be invalid
        }
      }
    };

    verifyToken();
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleLogout = () => {
    // Display error toast
    if (!toast.isActive(toastId)) {
      toastId = toast.error("Session expired. Please log in again.");
    }

    // Clear sessionStorage and localStorage
    sessionStorage.clear();
    localStorage.clear();

    // Redirect to the login page
    navigate("/");
  };

  const logout = async () => {
    await removeAuthorization();
    await removeAuthToken();
    // localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };


  


  return (
    <>
      <aside className="asidemeni">
        <Link to="/dashboard">
          <img
            src={require("../images/Logo.webp")}
            alt="Logo"
            className="foot_logo_img my-2"
          />
        </Link>
        <div className="mennu_sidemain">
          <div className="mennu_side">
            <NavLink to="/dashboard" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="svg-side"
                    viewBox="0 0 24 24"
                    id="Dashboard"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z"></path>
                    <path
                      d="M19 5v2h-4V5h4M9 5v6H5V5h4m10 8v6h-4v-6h4M9 17v2H5v-2h4M21 3h-8v6h8V3zM11 3H3v10h8V3zm10 8h-8v10h8V11zm-10 4H3v6h8v-6z"
                      fill="#ffffff"
                      class="color000000 svgShape"
                    ></path>
                  </svg>
                </div>
                <span className="side-name">Dashboard</span>
              </div>
            </NavLink>
            <NavLink to="/usermanagement" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <i class="fa-solid fa-user-gear svg-side"></i>
                </div>
                <span className="side-name">User Management</span>
              </div>
            </NavLink>
            <NavLink to="/currencymanagement" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">

                  <i class="fa-solid fa-coins svg-side"></i>
                </div>
                <span className="side-name">Currency</span>
              </div>
            </NavLink>
            <NavLink to="/walletmanagement" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <i class="fa-solid fa-wallet svg-side"></i>
                </div>
                <span className="side-name">Wallet Management</span>
              </div>
            </NavLink>
            <NavLink to="/adminwallet" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <i class="fa-solid fa-user-tie svg-side"></i>
                </div>
                <span className="side-name"> Admin Wallet </span>
              </div>
            </NavLink>
            {/* <NavLink to="/adminwallet" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <i class="fa-solid fa-user-tie svg-side"></i>
                </div>
                <span className="side-name"> Admin Wallet </span>
              </div>
            </NavLink>
            <NavLink to="/adminwallettransaction" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                <i class="fa-solid fa-comments-dollar svg-side"></i>
                </div>
                <span className="side-name"> Wallet Transaction </span>
              </div>
            </NavLink> */}
            <NavLink to="/depositmanagement" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <i class="fa-solid fa-money-bill-trend-up svg-side"></i>
                </div>
                <span className="side-name">Crypto Deposit</span>
              </div>
            </NavLink>
            <NavLink to="/withdrawmanagement" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <i class="fa-solid fa-building-columns svg-side"></i>
                </div>
                <span className="side-name">Crypto Withdraw </span>
              </div>
            </NavLink>
            {/* <NavLink to="/profitmanagement" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <i class="fa-solid fa-sack-dollar svg-side"></i>
                </div>
                <span className="side-name">Fees</span>
              </div>
            </NavLink> */}

            <NavLink to="/usertrade" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <i class="fa-regular fa-address-book svg-side"></i>
                </div>
                <span className="side-name">User Trade</span>
              </div>
            </NavLink>

            <NavLink to="/p2p_payment_method" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                <i class="fa-solid fa-link svg-side"></i>
                </div>
                <span className="side-name">P2P Payment Methods</span>
              </div>
            </NavLink>

            <NavLink to="/P2Porders" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                <i class="fa-solid fa-link svg-side"></i>
                </div>
                <span className="side-name">P2P Orders</span>
              </div>
            </NavLink>

            <NavLink to="/P2Pdispute" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                <i class="fa-solid fa-triangle-exclamation svg-side"></i>
                </div>
                <span className="side-name">P2P Dispute</span>
              </div>
            </NavLink>

            <NavLink to="/swaping" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                <i class="fa-solid fa-shuffle svg-side"></i>
                </div>
                <span className="side-name">Swaping</span>
              </div>
            </NavLink>

            <NavLink to="/profits" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <i class="fa-solid fa-dollar-sign svg-side"></i>
                </div>
                <span className="side-name">Profits</span>
              </div>
            </NavLink>

            <NavLink to="/tradepair" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <i class="fa-solid fa-right-left svg-side"></i>
                </div>
                <span className="side-name">Trading Pair</span>
              </div>
            </NavLink>

            {/* <NavLink to="/rewardmanagement" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <i class="fa-solid fa-gifts  svg-side"></i>

                </div>
                <span className="side-name">Reward Management</span>
              </div>
            </NavLink>
            <NavLink to="/referralmanagement" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <i class="fa-solid fa-users-line svg-side"></i>

                </div>
                <span className="side-name">Referral Management</span>
              </div>
            </NavLink>
            <NavLink to="/airdropmanagement" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <i class="fa-brands fa-dropbox svg-side"></i>
                </div>
                <span className="side-name">Airdrop Management</span>
              </div>
            </NavLink> */}

            {/* <NavLink to="/emailtemplate" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <i class="fa-solid fa-envelope-open-text svg-side"></i>
                </div>
                <span className="side-name">Email Templates</span>
              </div>
            </NavLink> */}

            <NavLink to="/supportcategory" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <i class="fa-solid fa-headset svg-side"></i>
                </div>
                <span className="side-name">Support Category</span>
              </div>
            </NavLink>

            {/* <NavLink to="/cmsmanagement" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <i class="fa-solid fa-text-height svg-side"></i>
                </div>
                <span className="side-name">CMS</span>
              </div>
            </NavLink> */}

            <NavLink to="/support" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <i class="fa-solid fa-ticket svg-side"></i>
                </div>
                <span className="side-name">Support</span>
              </div>
            </NavLink>

            {/* <NavLink to="/internaltransfer" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                <i class="fa-solid fa-money-bill-transfer svg-side"></i>
                </div>
                <span className="side-name">Internal TRansfer</span>
              </div>
            </NavLink> */}

             

            <NavLink to="/sitesetting" className="navlink_new">
              <div className="chat-optionside">
                <div className="menu_items_fex">
                  <i class="fa-solid fa-gear svg-side"></i>
                </div>
                <span className="side-name">Site Settings</span>
              </div>
            </NavLink>

            
          </div>
          <div className="pos-abs">
            <div className="side-lo-div" onClick={logout}>
              <div className="chat-optionside">
                <div className="menu_items_fex" >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="svg-side"
                    viewBox="0 0 24 24"
                    id="logout"
                  >
                    <path
                      d="M21.9 10.6c-.1-.1-.1-.2-.2-.3l-2-2c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l.3.3H16c-.6 0-1 .4-1 1s.4 1 1 1h2.6l-.3.3c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l2-2c.1-.1.2-.2.2-.3.1-.3.1-.5 0-.8z"
                      fill="#ffffff"
                      class="color000000 svgShape"
                    ></path>
                    <path
                      d="M17 14c-.6 0-1 .4-1 1v1c0 .6-.4 1-1 1h-1V8.4c0-1.3-.8-2.4-1.9-2.8L10.5 5H15c.6 0 1 .4 1 1v1c0 .6.4 1 1 1s1-.4 1-1V6c0-1.7-1.3-3-3-3H5c-.1 0-.2 0-.3.1-.1 0-.2.1-.2.1l-.1.1c-.1 0-.2.1-.2.2v.1c-.1 0-.2.1-.2.2V18c0 .4.3.8.6.9l6.6 2.5c.2.1.5.1.7.1.4 0 .8-.1 1.1-.4.5-.4.9-1 .9-1.6V19h1c1.7 0 3-1.3 3-3v-1c.1-.5-.3-1-.9-1zM6 17.3V5.4l5.3 2c.4.2.7.6.7 1v11.1l-6-2.2z"
                      fill="#ffffff"
                      class="color000000 svgShape"
                    ></path>
                  </svg>
                </div>
                <span className="side-name">Logout</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
