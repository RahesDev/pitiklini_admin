import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Link, NavLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import { useMediaQuery, useTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Moment from "moment";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { socket } from "../context/socket";

import {
  removeAuthToken,
  getAuthToken,
  getSocketToken,
} from "../core/lib/localStorage";
import { removeAuthorization } from "../core/service/axios";
import toast, { Toaster } from "react-hot-toast";
import { useDisconnect } from "@web3modal/ethers/react";

const drawerWidth = 240;
function Sidebar() {
  const theme = useTheme();
  const [lastLogin, setLastLogin] = useState("");
  const [loginCheck, setloginCheck] = useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [notifications, setNotification] = React.useState("");
  const [getKYCData, setgetKYCData] = useState("");
  const [profileData, setprofileData] = useState("");
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const logout = async () => {
    await removeAuthorization();
    await removeAuthToken();
    // localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };



  useEffect(() => {

    let socket_token = sessionStorage.getItem("socket_token");

    let socketsplit = socket_token?.split(`_`);

    console.log(socketsplit);
    socket.connect();


    socket.off("socketResponse");
    socket.on("socketResponse" + socketsplit[0], function (res) {
      console.log("socketResponse ressss-->>", res);
      if (res.Reason === "p2pchat") {
        const message = `${res.Message.user_name} sent a new message in Order ${res.Message.orderId}`;
        toast.success(message);

      } else if (res.Reason === "dispup2pchatteraise") {
        const message = `${res.Message.type === "advertiser" ? res.Message.adv_name : res.Message.user_name} raised an appeal`;
        toast.success(message);
      } else if (res.Reason === "updatedispute") {
        const message = `${res.Message.user_name} ${res.Message.status} the appeal`;
        toast.success(message);

      }

    });

    socket.emit("socketResponse");


  }, [0]);


  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);



  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center", backgroundColor: "#121418", color: "#fff" }}
    >
      <Typography variant="h6" sx={{ my: 2 }}>
        <div className="landing-header1">
          <img
            src={require("../images/Logo.webp")}
            alt="Logo"
            className="foot_logo_img my-2"
          />
        </div>
      </Typography>
      <Divider />
      <List>
        {loginCheck == true ? (
          <ListItem disablePadding>
            <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
              <Link to="/dashboard">
                <span className="land_header_leftmenus side-name">
                  Dashboard
                </span>
              </Link>
            </ListItemButton>
          </ListItem>
        ) : (
          ""
        )}
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/usermanagement">
              <span className="land_header_leftmenus side-name">
                User Management
              </span>
            </Link>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/currencymanagement">
              <span className="land_header_leftmenus side-name">Currency</span>
            </Link>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/walletmanagement">
              <span className="land_header_leftmenus side-name">
                Wallet Management
              </span>
            </Link>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/adminwallet">
              <span className="land_header_leftmenus side-name">
                Admin Wallet
              </span>
            </Link>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/depositmanagement">
              <span className="land_header_leftmenus ">Crypto Deposit</span>
            </Link>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/withdrawmanagement">
              <span className="land_header_leftmenus ">Crypto Withdraw</span>
            </Link>
          </ListItemButton>
        </ListItem>


        {/* <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/profitmanagement">
              <span className="land_header_leftmenus ">Fees</span>
            </Link>
          </ListItemButton>
        </ListItem> */}

        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/profitmanagement">
              <span className="land_header_leftmenus ">User Trade</span>
            </Link>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/p2p_payment_method">
              <span className="land_header_leftmenus ">P2P Payment Methods</span>
            </Link>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/P2Porders">
              <span className="land_header_leftmenus ">P2P Orders</span>
            </Link>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/P2Pdispute">
              <span className="land_header_leftmenus ">P2P Dispute</span>
            </Link>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/swaping">
              <span className="land_header_leftmenus ">Swapping</span>
            </Link>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/profits">
              <span className="land_header_leftmenus ">Profits</span>
            </Link>
          </ListItemButton>
        </ListItem>


        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/tradepair">
              <span className="land_header_leftmenus ">Trading Pair</span>
            </Link>
          </ListItemButton>
        </ListItem>

        {/* <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/referralmanagement">
              <span className="land_header_leftmenus ">Reward Management</span>
            </Link>
          </ListItemButton>
        </ListItem>


        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/rewardmanagement">
              <span className="land_header_leftmenus ">Referral Management</span>
            </Link>
          </ListItemButton>
        </ListItem> */}

        {/* <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/profitmanagement">
              <span className="land_header_leftmenus ">Email Templates</span>
            </Link>
          </ListItemButton>
        </ListItem> */}

        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/profitmanagement">
              <span className="land_header_leftmenus ">Support Category</span>
            </Link>
          </ListItemButton>
        </ListItem>

        {/* <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/profitmanagement">
              <span className="land_header_leftmenus ">CMS</span>
            </Link>
          </ListItemButton>
        </ListItem> */}

        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/profitmanagement">
              <span className="land_header_leftmenus ">Support</span>
            </Link>
          </ListItemButton>
        </ListItem>


        <ListItem disablePadding>


          <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
            <Link to="/" onClick={logout}>
              <span className="land_header_leftmenus">Logout</span>
            </Link>
          </ListItemButton>
        </ListItem>

        {/* {loginCheck == false ? (
          <>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
                <div
                  className="lan_had_con"
                  variant="outlined"
                  color="neutral"
                  onClick={() => setIsModalOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="img-con"
                    viewBox="0 0 20 20"
                    id="wallet"
                  >
                    <path d="M16 6H3.5v-.5l11-.88v.88H16V4c0-1.1-.891-1.872-1.979-1.717L3.98 3.717C2.891 3.873 2 4.9 2 6v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm-1.5 7.006a1.5 1.5 0 1 1 .001-3.001 1.5 1.5 0 0 1-.001 3.001z"></path>
                  </svg>
                  <span className="con_lan_con">Connect</span>
                </div>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>

              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
                <Link to="/security">
                  <span className="land_header_leftmenus">Security</span>
                </Link>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
                <Link to="/kyc">
                  <span className="land_header_leftmenus">
                    Identity verification
                  </span>
                </Link>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
                <Link to="/deposit">
                  <span className="land_header_leftmenus">Deposit</span>
                </Link>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
                <Link to="/withdraw">
                  <span className="land_header_leftmenus">Withdraw</span>
                </Link>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center", color: "#fff" }}>
                <Link to="">
                  <div className="land_header_signup">
                    <span className="land-sign-letter">Logout</span>
                  </div>
                </Link>
              </ListItemButton>
            </ListItem>
          </>
        )} */}
      </List>
    </Box>
  );

  const navigate = useNavigate();
  const [address, setAddress, addressref] = useState("");


  const [dropstatus, setdropstatus] = useState(false);

  const dropdowns = async () => {
    console.log(dropstatus, "dropstatus");
    if (dropstatus == true) {
      setdropstatus(false);
    } else {
      setdropstatus(true);
    }
  };

  const { disconnect } = useDisconnect();



  return (
    <div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
        }}
      />
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar component="nav">
          <Toolbar>
            <div className="drawer-head">
              <div className="header-res-menu">
                <div className="landing-header1">
                  <Link to="/">
                    <img
                      src={require("../images/Logo.webp")}
                      alt="logo"
                      className="logo-img"
                    />
                  </Link>
                </div>
              </div>
              <div className="header-right-menu">
                <div className="header_res_flx">
                  {loginCheck == true ? (
                    <div className="header_new">
                      <div className="dropdown head_pair_table">
                        <div className="dropdown show">
                          <a
                            class="text-white dropdown-toggle"
                            href="#"
                            role="button"
                            id="dropdownMenuLink"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <h2>
                              {/* <svg xmlns="http://www.w3.org/2000/svg" className='header_add_icons' viewBox="0 0 256.001 256.001" id="MagnifyingGlass"><rect width="256" height="256" fill="none"></rect><circle cx="116" cy="116" r="84" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" class="colorStroke000000 svgStroke"></circle><line x1="175.394" x2="223.994" y1="175.4" y2="224.001" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" class="colorStroke000000 svgStroke"></line></svg> */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="header_add_icons"
                                fill-rule="evenodd"
                                stroke-linejoin="round"
                                stroke-miterlimit="1.414"
                                clip-rule="evenodd"
                                viewBox="0 0 32 32"
                                id="transaction"
                              >
                                <rect width="32" height="32" fill="none"></rect>
                                <path
                                  fill-rule="nonzero"
                                  d="M23.997,28.994l-0.001,0c-5.342,0 -10.685,0.017 -16.028,0c-2.584,-0.024 -4.96,-2.267 -4.968,-4.998l0,-15.998c0.037,-0.769 1.043,-1.286 1.655,-0.756c0.168,0.146 0.284,0.348 0.327,0.567c0.016,0.083 0.014,0.104 0.018,0.189c0,5.345 -0.05,10.69 0,16.034c0.024,1.547 1.363,2.947 2.98,2.962c4.006,0.013 8.011,0 12.017,0c-0.019,-0.024 -0.037,-0.049 -0.055,-0.075c-0.613,-0.855 -0.942,-1.885 -0.945,-2.923l0,-18.998l-14.997,0c0,0 -0.964,-0.22 -0.999,-0.952c-0.025,-0.536 0.443,-1.021 0.999,-1.047l15.997,0c0.537,0.024 0.974,0.45 1,0.999c0,6.678 -0.062,13.357 0,20.034c0.024,1.53 1.341,2.922 2.939,2.962c0.079,-0.009 0.055,0.005 0.235,-0.005c1.502,-0.09 2.82,-1.428 2.825,-2.996l0,-8.996l-3,0c0,0 -0.484,-0.053 -0.733,-0.32c-0.477,-0.515 -0.198,-1.551 0.584,-1.669c0.066,-0.01 0.083,-0.009 0.149,-0.011l4,0c0.024,0.001 0.049,0.002 0.074,0.003c0.229,0.025 0.265,0.05 0.359,0.096c0.337,0.162 0.552,0.523 0.566,0.901c0,3.343 0.011,6.687 0,10.03c-0.024,2.604 -2.305,4.958 -4.997,4.967l-0.001,0Zm-9.999,-5.999l-3.999,0c-0.778,-0.015 -1.301,-1.052 -0.741,-1.671c0.186,-0.206 0.458,-0.323 0.741,-0.329l3.999,0c0.013,0.001 0.027,0.001 0.04,0.001c0.873,0.052 1.316,1.423 0.419,1.887c-0.141,0.073 -0.297,0.109 -0.459,0.112Zm2,-3.999l-7.999,0c-0.229,-0.007 -0.305,-0.037 -0.434,-0.099c-0.613,-0.296 -0.743,-1.292 -0.144,-1.716c0.122,-0.087 0.263,-0.146 0.411,-0.171c0.055,-0.009 0.111,-0.012 0.167,-0.014l7.999,0c0.018,0.001 0.037,0.001 0.056,0.002c0.736,0.062 1.243,1.044 0.689,1.664c-0.188,0.21 -0.379,0.324 -0.745,0.334Zm0,-3.999l-7.999,0c-0.765,-0.022 -1.312,-1.033 -0.745,-1.667c0.187,-0.21 0.379,-0.323 0.745,-0.333l7.999,0c0.018,0 0.037,0.001 0.056,0.001c0.739,0.063 1.227,1.063 0.689,1.665c-0.188,0.21 -0.379,0.323 -0.745,0.334Zm0,-4l-7.999,0c-0.763,-0.021 -1.308,-1.037 -0.745,-1.666c0.187,-0.21 0.379,-0.323 0.745,-0.333l7.999,0c0.018,0 0.037,0.001 0.056,0.001c0.229,0.019 0.302,0.054 0.427,0.123c0.576,0.319 0.682,1.275 0.095,1.691c-0.122,0.086 -0.263,0.145 -0.411,0.17c-0.055,0.009 -0.111,0.013 -0.167,0.014Z"
                                  fill="#ffffff"
                                  class="color000000 svgShape"
                                ></path>
                              </svg>
                            </h2>
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    className="p-0 "
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { xs: "block", lg: "none" } }}
                  >
                    <MenuIcon className="mt-2" />
                  </IconButton>
                </div>
              </div>
            </div>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", lg: "block" } }}
            >
              <div className="inhead_main">
                <div className="inheader-right-menu">
                  <div
                    className="lan_had_con1"
                    variant="outlined"
                    color="neutral"
                    onClick={dropdowns}
                  >
                    <span className="con_lan_con">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="inhead_user_icon"
                        enable-background="new 0 0 512 512"
                        viewBox="0 0 512 512"
                        id="user"
                      >
                        <circle
                          cx="256.1"
                          cy="128.6"
                          r="128.6"
                          fill="#ffffff"
                          transform="rotate(-45.001 256.1 128.604)"
                          class="color231f20 svgShape"
                        ></circle>
                        <path
                          fill="#ffffff"
                          d="M403.6,364.5c-9.9-9.9-63.1-61.1-147.5-61.1s-137.7,51.3-147.5,61.1C48.9,424.2,47.5,498.1,47.5,512h417.2
		C464.7,498.1,463.3,424.2,403.6,364.5z"
                          class="color231f20 svgShape"
                        ></path>
                      </svg>{" "}
                      <i class="fa-solid fa-angle-down text-white ml-2 text-sm"></i>{" "}
                    </span>
                    <div
                      className={
                        dropstatus == true
                          ? "dropdown-content"
                          : "dropdown-content d-none"
                      }
                    >
                      <div className="d-flex flex-column gap10">
                        <Link to="/adminprofile">
                          <div className="d-flex gap10 align-items-baseline">
                            <i class="fa-solid fa-user img-con"></i>
                            <span className="">Profile</span>
                          </div>
                        </Link>

                        <Link to="/sitesetting">
                          <div className="d-flex gap10 align-items-baseline">
                            <i class="fa-solid fa-gear img-con"></i>
                            <span className="">Setting</span>
                          </div>
                        </Link>

                        <Link>
                          <div className="d-flex gap10 align-items-baseline" onClick={logout}>
                            <i class="fa-solid fa-arrow-right-from-bracket img-con"></i>
                            <span className="">Logout</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </Typography>
          </Toolbar>
        </AppBar>
        <nav>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", lg: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        </nav>
        <Box component="main" sx={{ p: 3 }}>
          <Toolbar />
        </Box>
        {/*  */}
        <React.Fragment></React.Fragment>
        {/*  */}
      </Box>
    </div>
  );
}

export default Sidebar;
