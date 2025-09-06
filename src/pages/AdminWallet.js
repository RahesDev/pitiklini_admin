import React, { useEffect } from "react";
import useState from "react-usestateref";
import Sidebar from "./Sidebar";
import Sidebar_2 from "./Nav_bar";
import * as Yup from "yup";
import ReactPaginate from "react-paginate";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Dropdown } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Modal from "@mui/joy/Modal";
import Moment from "moment";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import axios from "axios";

function AdminWallet() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [passState, setPassState] = useState(true);
  const [passValidate, setPassValidate, passValidateref] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [nextStep, setNextStep] = useState(false);
  const [depositState, setDepositState] = useState(false);
  const [withdrawState, setWithdrawState] = useState(false);
  const [selectedCurr, setSelectedCurr, selectedCurrref] = useState({});
  const [network_currency, setcur_network, network_currencyref] = useState([]);
  const [network_default, setnet_default, net_defaultref] = useState("");
  const [address, setAddress, addressref] = useState("");
  const [refreshLoader, setrefreshLoader] = useState(false);
  const [historyLoader, setHistoryLoader, historyLoaderref] = useState(false);
  const [withdrawType, setwithdrawType] = useState("");
  const [balance, setBalance, balanceref] = useState("");

  const initialFormValue = {
    amount: "",
    withAddress: "",
    tfa: "",
    withdraw_otp: "",
  };

  const [formValue, setFormValue, formValueref] = useState(initialFormValue);
  const [amountValidate, setamountValidate] = useState(false);
  const [withAddressValidate, setwithAddress] = useState(false);
  const [
    withdrawnetworkValidate,
    setwithdrawnetworkValidate,
    withdrawnetworkValidateref,
  ] = useState(false);
  const [tfaValidate, settfaValidate] = useState(false);
  const [otpValidate, setotpValidate] = useState(false);
  const [validationnErr, setvalidationnErr] = useState("");
  const [network_current, setnet_current, network_currentref] = useState("");
  const [show_otp, setshow_otp, show_otpref] = useState(false);
  const [withdrawAddress, setwithdrawAddress, withdrawAddressref] = useState();

  const { amount, withAddress, tfa, withdraw_otp } = formValue;

  const [isResendVisible, setIsResendVisible] = useState(false);
  const [resendClick, setResendClick] = useState(false);
  const [counter, setCounter] = useState(120);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendVisible(true);
    }
  }, [counter]);

  const handleChange = async (e) => {
    e.preventDefault();
    const sanitizedValue = e.target.value.replace(/\s/g, "");
    setPassword(sanitizedValue);
    validate(sanitizedValue);
  };

  useEffect(() => {
    getbalance();
  }, []);

  useEffect(() => {
    getUserDetails(currentPage, filterKeyword);
  }, [currentPage, filterKeyword]);

  const validate = (values) => {
    let errors = {};

    if (!values) {
      errors.password = "Password is required !";
      setPassValidate(true);
    } else {
      setPassValidate(false);
    }
    setErrorMsg(errors);

    return errors;
  };

  const getUserDetails = async (page = 1, filterKeyword = "") => {
    const data = {
      apiUrl: apiService.walletCurrenList,
      payload: { page, keyword: filterKeyword }, // Include the keyword here
    };
    const response = await postMethod(data);
    // console.log(response, "=-=-=-=response=-=-=");
    if (response.status) {
      setTotalPages(response.totalPages);
      setrefreshLoader(false);
      const updatedData = response.data.map((user) => ({
        ...user,
        currencyBalance: parseFloat(user.currencyBalance), // Convert currencyBalance to a number
      }));
      console.log("updatedData-->>", updatedData);
      setFilteredUsers(updatedData);
      // setFilteredUsers(response.data); // No need to filter here, since we're now getting all users with the keyword
      setHistoryLoader(false);
    } else {
      setFilteredUsers([]);
    }
  };

  const getbalance = async () => {
    try {
      var obj = {
        network: "mainnet",
      };
      var data = {
        apiUrl: apiService.getBalanceBlock,
        payload: obj,
      };
      var resp = await postMethod(data);
      console.log("Balances:", resp.data);
    } catch (error) {}
  };

  const formSubmit = async () => {
    try {
      let errros = validate(password);
      if (passValidateref.current === false) {
        console.log("It works properly ---->>>>");
        var data = {
          apiUrl: apiService.wallet_login,
          payload: { password: password },
        };
        setButtonLoader(true);
        var resp = await postMethod(data);
        setPassword("");
        setButtonLoader(false);
        if (resp.status == true) {
          // toast.success(resp.Message);
          setPassState(true);
        } else {
          toast.error(resp.Message);
        }
      }
    } catch (error) {}
  };

  const handleFilterChange = (e) => {
    console.log("filter word --->>>", e.target.value);
    setFilterKeyword(e.target.value);
    setCurrentPage(1);
  };

  const handleDeposit = async (value) => {
    try {
      console.log("depo value -->>>", value);
      setSelectedCurr(value);
      setNextStep(true);
      setWithdrawState(false);
      setDepositState(true);
      var network_cur = {};
      var network_names = [];
      if (value.currencyType == "2") {
        if (value.erc20token == "1") {
          network_cur = {
            value: "erc20token",
            label: "ERC20",
            text: "ERC20",
          };
          network_names.push(network_cur);
        }
        if (value.bep20token == "1") {
          network_cur = {
            value: "bep20token",
            label: "BEP20",
            text: "BEP20",
          };
          network_names.push(network_cur);
        }
        if (value.trc20token == "1") {
          network_cur = {
            value: "trc20token",
            label: "TRC20",
            text: "TRC20",
          };
          network_names.push(network_cur);
        }
        setcur_network(network_names);
        console.log("network_currencyref===", network_currencyref.current);
        setnet_default(network_currencyref.current[0].label);
      }
      if (value.coinType == "1" && value.currencyType == "1") {
        console.log(
          value,
          "=-=--=currency ... value ... data=--",
          value.currencysymbol
        );
        var obj = {
          currencySymbol: value.currencysymbol,
          currId: value.currid,
          network: "",
        };
        var data = {
          apiUrl: apiService.generateAdminaddress,
          payload: obj,
        };
        var resp = await postMethod(data);
        if (resp.status) {
          setAddress(resp.data);
          console.log(
            addressref.current,
            "--=-=-addressref=-=-=addressref=-=-=-=-addressref"
          );
        }
      }
    } catch (error) {}
  };

  const onSelect_network = async (e, option) => {
    console.log(option, "-=-onSelect_network");
    if (
      selectedCurrref.current.coinType == "1" &&
      selectedCurrref.current.currencyType == "2"
    ) {
      var obj = {
        currencySymbol: selectedCurrref.current.currencysymbol,
        currId: selectedCurrref.current.currid,
        network: option.value,
      };
      console.log("call here 1111", obj);
      var data = {
        apiUrl: apiService.generateAdminaddress,
        payload: obj,
      };
      var resp = await postMethod(data);
      console.log(resp, "=-=-=resp-=-=--");
      if (resp.status) {
        setAddress(resp.data);
      }
    }
  };

  const getTransaction = async () => {
    var data = {
      apiUrl: apiService.transaction,
    };
    // setSiteLoader(true)

    var resp = await getMethod(data);
    // setSiteLoader(false)
    // setrefreshStatus(false);

    if (resp.message == true) {
      getUserDetails(1);
    }
  };

  const getTransaction2 = async () => {
    getTransaction();
    setrefreshLoader(true);
    setHistoryLoader(true);
    const timer = setTimeout(() => {
      getUserDetails();
      getbalance();
    }, 20000);
  };

  const handleChangeChang = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formData = { ...formValue, ...{ [name]: value } };
    setFormValue(formData);
    validateWith(formData);
    validate_preview(formData);
  };

  const handleWithdraw = async (value) => {
    console.log("withdr value -->>>", value);
    setSelectedCurr(value);
    setNextStep(true);
    setDepositState(false);
    setWithdrawState(true);
    var network_cur = {};
    var network_names = [];
    if (value.currencyType == "2") {
      if (value.erc20token == "1") {
        network_cur = {
          value: "ERC20",
          // label: "ERC20",
          text: "ERC20",
          key: "erc20token",
        };
        network_names.push(network_cur);
      }
      if (value.bep20token == "1") {
        network_cur = {
          value: "BEP20",
          // label: "BEP20",
          text: "BEP20",
          key: "bep20token",
        };
        network_names.push(network_cur);
      }
      if (value.trc20token == "1") {
        network_cur = {
          value: "TRC20",
          // label: "TRC20",
          text: "TRC20",
          key: "trc20token",
        };
        network_names.push(network_cur);
      }
      setcur_network(network_names);
      const totalToken =
        value.beb20Balanceamount +
        value.erc20Balanceamount +
        value.trc20Balanceamount;
      console.log("totalToken-->>", totalToken);
      setBalance(Number(totalToken));
    } else {
      setBalance(Number(value.currencyBalance));
    }
    setwithdrawType(value.coinType);

    // setBalance(Number(value.currencyBalance));
    // validate_preview(formValueref.current);
  };

  const validateWith = async (values) => {
    const errors = {};
    console.log(selectedCurrref.current, "selectedCurrref.current");

    if (
      network_currencyref.current.length > 0 &&
      selectedCurrref.current.currencyType == "2"
    ) {
      errors.withdrawnetwork = "Withdraw network is a required field";
      setwithdrawnetworkValidate(true);
    } else {
      setwithdrawnetworkValidate(false);
    }

    if (!values.amount) {
      errors.amount = "Amount is a required field";
      setamountValidate(true);
    }

    if (!values.withAddress) {
      errors.withAddress = "Destination address is a required field";
      setwithAddress(true);
    }

    if (!values.tfa) {
      errors.tfa = "2FA is a required field";
      settfaValidate(true);
    }

    if (!values.withdraw_otp) {
      errors.withdraw_otp = "Withdraw OTP is a required field";
      setotpValidate(true);
    }

    setvalidationnErr(errors);
    return errors;
  };

  const validate_preview = async (values) => {
    const errors = {};
    console.log(selectedCurrref.current, "selectedCurrref.current1");
    if (
      network_currencyref.current.length > 0 &&
      selectedCurrref.current.currencyType == "2" &&
      !network_currentref.current
    ) {
      errors.withdrawnetwork = "Network is a required field";
      setwithdrawnetworkValidate(true);
    } else {
      setwithdrawnetworkValidate(false);
    }

    if (!values.withAddress) {
      errors.withAddress = "Destination address is a required field";
      setwithAddress(true);
    } else {
      setwithAddress(false);
    }

    if (!values.amount) {
      errors.amount = "Amount is a required field";
      setamountValidate(true);
    } else {
      setamountValidate(false);
    }

    if (!values.withdraw_otp) {
      errors.withdraw_otp = "Withdraw OTP is a required field";
      setotpValidate(true);
    } else {
      setotpValidate(false);
    }

    if (!values.tfa) {
      errors.tfa = "2FA is a required field";
      settfaValidate(true);
    } else {
      settfaValidate(false);
    }
    setvalidationnErr(errors);
    return errors;
  };

  const validate_submit = async (values) => {
    const errors = {};

    if (!values.withdraw_otp) {
      errors.withdraw_otp = "Withdraw OTP is a required field";
      setotpValidate(true);
    }

    if (!values.tfa) {
      errors.tfa = "2FA is a required field";
      settfaValidate(true);
    }

    setvalidationnErr(errors);
    return Object.keys(errors).length === 0;
  };

  const onSelect_network_with = async (option) => {
    console.log("option---->>>>>>>", option);
    setnet_current(option.value);
    validate_preview(formValueref.current);
  };

  const onSelect_address = async (e) => {
    console.log(
      e.target.value,
      "=-=-=-=option=-=-=-=-=option=-=-=-option=-=-="
    );
    setwithdrawAddress(e.target.value);
    formValue.withAddress = e.target.value;
    validate_preview(formValueref.current);
    // setwithAddress(false);
  };

  const withdrawPreview = async () => {
    try {
      console.log(formValue, "=-=-=v=-formValue-=-formValue=-=-vformValue");
      console.log("WIthdraw preview comes --->>>>");
      if (withdrawType != "2") {
        validate_preview(formValueref.current);
        if (
          withdrawnetworkValidateref.current == false &&
          withAddressValidate == false &&
          amountValidate == false
          // tfaValidate == false
        ) {
          if (formValue.amount != "" && formValue.withAddress != "") {
            if (+formValue.amount > 0) {
              if (+balanceref.current >= +formValue.amount) {
                if (
                  selectedCurrref.current.minWithdrawLimit > formValue.amount
                ) {
                  showerrorToast(
                    "Please enter greater than " +
                      selectedCurrref.current.minWithdrawLimit +
                      " amount"
                  );
                } else if (
                  selectedCurrref.current.maxWithdrawLimit < formValue.amount
                ) {
                  showerrorToast(
                    "Please enter less than " +
                      selectedCurrref.current.maxWithdrawLimit +
                      " amount"
                  );
                } else {
                  const obj = {
                    currency_symbol: selectedCurrref.current.currencysymbol,
                    withdrawalAddress: formValue.withAddress,
                    networkType: network_currentref.current,
                    withdrawalAmount: formValue.amount,
                    // otp: formValue.tfa,
                  };
                  console.log(obj, "=-=-obj=-=-");
                  // return;
                  var data = {
                    apiUrl: apiService.fieldValidate,
                    payload: obj,
                  };
                  // var data = {
                  //   apiUrl: apiService.send_otp,
                  // };
                  setButtonLoader(true);
                  var resp = await postMethod(data);
                  if (resp.status == true) {
                    setCounter(120);
                    setResendClick(false);
                    setIsResendVisible(false);
                    showsuccessToast(resp.message);
                    setButtonLoader(false);
                    setshow_otp(true);
                  } else {
                    showerrorToast(resp.message);
                    setButtonLoader(false);
                  }
                }
              } else {
                showerrorToast("Insufficient Balance");

                setButtonLoader(false);
              }
            } else {
              showerrorToast("Please give valid withdraw amount!");
            }
          }
        }
      }
    } catch (error) {}
  };

  const handleResend = async () => {
    try {
      // setResendClick(true);
      // withdrawPreview();
      if (withdrawType != "2") {
        validate_preview(formValueref.current);
        if (
          withdrawnetworkValidateref.current == false &&
          withAddressValidate == false &&
          amountValidate == false
          // tfaValidate == false
        ) {
          if (formValue.amount != "" && formValue.withAddress != "") {
            if (+formValue.amount > 0) {
              if (+balanceref.current >= +formValue.amount) {
                if (
                  selectedCurrref.current.minWithdrawLimit > formValue.amount
                ) {
                  showerrorToast(
                    "Please enter greater than " +
                      selectedCurrref.current.minWithdrawLimit +
                      " amount"
                  );
                } else if (
                  selectedCurrref.current.maxWithdrawLimit < formValue.amount
                ) {
                  showerrorToast(
                    "Please enter less than " +
                      selectedCurrref.current.maxWithdrawLimit +
                      " amount"
                  );
                } else {
                  const obj = {
                    currency_symbol: selectedCurrref.current.currencysymbol,
                    withdrawalAddress: formValue.withAddress,
                    networkType: network_currentref.current,
                    withdrawalAmount: formValue.amount,
                    // otp: formValue.tfa,
                  };
                  console.log(obj, "=-=-obj=-=-");
                  // return;
                  var data = {
                    apiUrl: apiService.fieldValidate,
                    payload: obj,
                  };
                  // var data = {
                  //   apiUrl: apiService.send_otp,
                  // };
                  // setButtonLoader(true);
                  setResendClick(true);
                  var resp = await postMethod(data);
                  if (resp.status == true) {
                    setResendClick(false);
                    setCounter(120);
                    setIsResendVisible(false);
                    showsuccessToast(resp.message);
                    setButtonLoader(false);
                    setshow_otp(true);
                  } else {
                    showerrorToast(resp.message);
                    setButtonLoader(false);
                  }
                }
              } else {
                showerrorToast("Insufficient Balance");

                setButtonLoader(false);
              }
            } else {
              showerrorToast("Please give valid withdraw amount!");
            }
          }
        }
      }
    } catch (error) {}
  };

  const withdrawSubmit = async () => {
    try {
      console.log("Withdraw submit comes --->>>>");
      if (
        formValue.amount != "" &&
        formValue.withAddress != "" &&
        formValue.tfa != "" &&
        formValue.withdraw_otp != ""
      ) {
        if (+formValue.amount > 0) {
          if (selectedCurrref.current.minWithdrawLimit > formValue.amount) {
            showerrorToast(
              "Please enter greater than " +
                selectedCurrref.current.minWithdrawLimit +
                " amount"
            );
          } else if (
            selectedCurrref.current.maxWithdrawLimit < formValue.amount
          ) {
            showerrorToast(
              "Please enter less than " +
                selectedCurrref.current.maxWithdrawLimit +
                " amount"
            );
          } else {
            var obj = {
              currencyId: selectedCurrref.current.currid,
              currency_symbol: selectedCurrref.current.currencysymbol,
              amount: formValue.amount,
              otp: formValue.withdraw_otp,
              tfa: formValue.tfa,
              networkType: network_currentref.current,
              withdrawalAddress: formValue.withAddress,
            };
            console.log("submit withdraw params---", obj);
            var data = {
              apiUrl: apiService.withdrawProcess,
              payload: obj,
            };
            // var obj = {
            //   amount: formValue.amount,
            //   withdraw_address: formValue.withAddress,
            //   tfaCode: formValue.tfa,
            //   currency_symbol: currentcurrency.currencySymbol,
            //   currId: currentcurrency._id,
            //   network: network_currentref.current,
            //   withdrawOtp: formValue.withdraw_otp,
            //   tfa_status: localStorage.getItem("tfa_status"),
            // };
            // var data = {
            //   apiUrl: apiService.submitWithdraw,
            //   payload: obj,
            // };
            setButtonLoader(true);
            var resp = await postMethod(data);
            if (resp.status == true) {
              showsuccessToast(resp.message);
              setButtonLoader(false);
              formValue.amount = "";
              setwithdrawAddress("");
              formValue.tfa = "";
              formValue.withdraw_otp = "";
              setnet_default("");
              setcur_network("");
              setnet_current("");
              setshow_otp(false);
              setNextStep(false);
              handleBack();
              getUserDetails(1);
              getbalance();
              //window.location.reload(false);
            } else {
              showerrorToast(resp.message);
              setButtonLoader(false);
              handleBack();
              getUserDetails(1);
              getbalance();
              // setshow_otp(false);
              // formValue.amount = "";
              // setwithdrawAddress("");
              // formValue.tfa = "";
              // formValue.withdraw_otp = "";
              // setcurrency("");
              // setcurrentcurrency("")
              // setnet_default("");
              // setcur_network("");
              // formValue.amount = "";
              // formValue.withAddress = "";
              // formValue.tfa = "";
              //window.location.reload(false);
            }
          }
        } else {
          showerrorToast("Please give valid withdraw amount!");
        }
      }
    } catch (error) {}
  };

  const handlekeydown = async (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  const nav_page = async (link) => {
    navigate(link);
  };

  const handleBack = async () => {
    setNextStep(false);
    setAddress("");
    setnet_current("");
    setwithdrawAddress("");
    setFormValue(initialFormValue);
    setshow_otp(false);
    setwithdrawnetworkValidate(false);
    setwithAddress(false);
    setamountValidate(false);
    settfaValidate(false);
    setotpValidate(false);
  };

  const copy = async (text) => {
    navigator.clipboard.writeText(text);
    showsuccessToast("Address copied");
  };

  const showsuccessToast = (message) => {
    toast.dismiss();
    toast.success(message);
  };

  const showerrorToast = (message) => {
    toast.dismiss();
    toast.error(message);
  };

  return (
    <div>
      {loader == true ? (
        <div className="loadercss">
          <Bars
            height="80"
            width="80"
            color="#BD7F10"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2 px-0">
              <Sidebar />
            </div>
            <div className="col-lg-10 px-0">
              <div className="pos_sticky">
                <Sidebar_2 />
              </div>
              {passState == false ? (
                <div className="px-4 transaction_padding_top">
                  <div className="px-2 my-4 transaction_padding_top tops">
                    <div className="headerss">
                      <span className="dash-head">Admin Wallet</span>
                    </div>
                    <div className="row adminwal_pass_main mt-5">
                      <div className="col-lg-5 admwal_pass_box">
                        <div className="hero_subhead">
                          <span className="hero_head">Password</span>
                          <div className="hotpic_bot_hd mb-0">
                            <span className="hero_sub_inner">
                              Enter your password
                            </span>
                            <input
                              className="admin_login_imput"
                              type="password"
                              name="password"
                              minLength={6}
                              maxLength={15}
                              value={password}
                              onChange={handleChange}
                              placeholder="Enter password here"
                              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            />
                            {errorMsg && errorMsg.password && (
                              <p className="errorcss mb-0">
                                {errorMsg.password}
                              </p>
                            )}
                          </div>
                          <div className="main_submit mt-2">
                            <div className="site_submain" onClick={formSubmit}>
                              {buttonLoader == false ? (
                                <span className="submit_site">Submit</span>
                              ) : (
                                <span className="submit_site">Loading ...</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {nextStep == false ? (
                    <div className="px-4 transaction_padding_top">
                      <div className="px-2 my-4 transaction_padding_top tops">
                        <div className="headerss">
                          <span className="dash-head">Admin Wallet</span>
                          <div className="Recent_new_add">
                            {refreshLoader == true ? (
                              <i class="fa-solid fa-arrows-rotate fa-spin-pulse mt-1"></i>
                            ) : (
                              <i
                                class="fa-solid fa-arrows-rotate mt-1 "
                                onClick={getTransaction2}
                              ></i>
                            )}
                            <input
                              className="filters"
                              placeholder="Enter currencyname to filter"
                              value={filterKeyword}
                              onChange={(e) => handleFilterChange(e)}
                            />
                          </div>
                        </div>
                        <div className="table-responsive my-5 trans-table">
                          <table className="w_100">
                            <thead className="trans-head">
                              <tr>
                                <th>S.No</th>
                                <th>Currency</th>
                                <th>Balance</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {historyLoader == false ? (
                                <>
                                  {filteredUsers.length > 0 ? (
                                    filteredUsers.map((item, i) => (
                                      <tr key={item._id}>
                                        <td>
                                          <span className="plus_14_ff">
                                            {i + 1}
                                          </span>
                                        </td>
                                        <td>
                                          <span className="plus_14_ff">
                                            {item.currencysymbol}
                                          </span>
                                        </td>
                                        <td>
                                          <span className="plus_14_ff">
                                            {item.currencyType == "1" ? (
                                              <>
                                                {item.currencyBalance.toFixed(
                                                  4
                                                )}
                                              </>
                                            ) : (
                                              <>
                                                {parseFloat(
                                                  item?.erc20Balanceamount +
                                                    parseFloat(
                                                      item?.beb20Balanceamount
                                                    ) +
                                                    parseFloat(
                                                      item?.trc20Balanceamount
                                                    )
                                                ).toFixed(4)}
                                              </>
                                            )}
                                          </span>
                                        </td>
                                        <td>
                                          <span className="plus_14_ff">
                                            <div className="dash-bal-btns-wrapper ">
                                              <button
                                                className="dash-bal-btn"
                                                onClick={() =>
                                                  handleDeposit(item)
                                                }
                                              >
                                                Deposit
                                              </button>
                                              <button
                                                className="dash-bal-btn"
                                                onClick={() =>
                                                  handleWithdraw(item)
                                                }
                                              >
                                                Withdrawal
                                              </button>
                                            </div>
                                          </span>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={4}>
                                        <div className="empty_data my-4">
                                          <div className="plus_14_ff">
                                            No Records Found
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </>
                              ) : (
                                <tr>
                                  <td colSpan={5} className="text-center py-5">
                                    <div className="empty_data">
                                      <div className="loadercss_deporefresh">
                                        <Bars
                                          height="40"
                                          width="40"
                                          color="#ffc630"
                                          ariaLabel="bars-loading"
                                          wrapperStyle={{}}
                                          wrapperClass=""
                                          visible={true}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 transaction_padding_top">
                      <div className="px-2 my-4 transaction_padding_top tops">
                        <div className="headerss">
                          <span className="dash-head">Admin Wallet</span>
                          <button onClick={() => handleBack()}>Back</button>
                        </div>
                        <div className="my-5 currencyinput">
                          {depositState && (
                            <div>
                              <h3 className="text-white my-2">Deposit</h3>
                              <div className="row d-flex justify-content-center mt-5">
                                <div className="col-lg-7">
                                  {selectedCurrref.current.currencyType == 2 ? (
                                    <div className="form_div ">
                                      <h6>Network</h6>
                                      <Dropdown
                                        placeholder="Network"
                                        fluid
                                        className="dep-drops"
                                        selection
                                        options={network_currencyref.current}
                                        defaultValue={
                                          network_currencyref.current[0]
                                        }
                                        onChange={onSelect_network}
                                      />
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {addressref.current == undefined ||
                                  addressref.current == "" ? (
                                    ""
                                  ) : (
                                    <>
                                      <div className="form_div boder-none ">
                                        <h6>Network Address :-</h6>
                                        <div className="qr-wrapper mt-4">
                                          <img
                                            src={
                                              addressref.current == undefined
                                                ? ""
                                                : addressref.current.qrcode
                                            }
                                            className="d-block mx-auto dep-qr"
                                          />
                                          <p className="mt-4">
                                            Scan the QR code or copy the address
                                            to deposit
                                          </p>
                                        </div>
                                      </div>
                                      <div className="form_div boder-none">
                                        <div className="add_box">
                                          <h6 className="address">
                                            {addressref.current == undefined
                                              ? ""
                                              : addressref.current.address}
                                          </h6>
                                          <i
                                            class="ri-file-copy-line text-yellow cursor-pointer"
                                            onClick={() =>
                                              copy(addressref.current.address)
                                            }
                                          ></i>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {withdrawState && (
                            <div>
                              <span className="text-white">Withdraw</span>
                              <div className="row d-flex justify-content-center mt-5">
                                <div className="col-lg-7">
                                  {show_otpref.current == false &&
                                  selectedCurrref.current.currencyType ==
                                    "2" ? (
                                    <div className="form_div">
                                      <div className="sides">
                                        <div className="w-100 rights">
                                          <h6>Choose a Network</h6>
                                          <Dropdown
                                            placeholder="Select an Network"
                                            fluid
                                            className="dep-drops"
                                            selection
                                            options={
                                              network_currencyref.current
                                            }
                                            onChange={(e, data) => {
                                              const selectedOption =
                                                network_currencyref.current.find(
                                                  (option) =>
                                                    option.value === data.value
                                                );
                                              onSelect_network_with(
                                                selectedOption
                                              );
                                            }}
                                            // onChange={onSelect_network}
                                            // defaultValue={net_defaultref.current}
                                            isSearchable={true}
                                            disabled={
                                              show_otpref.current == true
                                            }
                                          />
                                          {withdrawnetworkValidateref.current ==
                                          true ? (
                                            <span className="errorcss ">
                                              {" "}
                                              {
                                                validationnErr.withdrawnetwork
                                              }{" "}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {withdrawType == "1" ? (
                                    <div className="form_div ">
                                      <h6>Address</h6>
                                      <input
                                        type="text"
                                        placeholder="Enter the address"
                                        fluid
                                        maxLength={60}
                                        onKeyDown={handlekeydown}
                                        disabled={show_otpref.current == true}
                                        className="dep-drops"
                                        value={
                                          withdrawAddressref.current == "" ||
                                          withdrawAddressref.current == null ||
                                          withdrawAddressref.current ==
                                            undefined
                                            ? ""
                                            : withdrawAddressref.current
                                        }
                                        onChange={onSelect_address}
                                      />
                                      {withAddressValidate == true ? (
                                        <span className="errorcss mt-0">
                                          {" "}
                                          {validationnErr.withAddress}{" "}
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  <div className="form_div mar-bot boder-none ">
                                    <h6>Amount</h6>
                                    <input
                                      type="text"
                                      pattern="[0-9]*"
                                      maxLength={8}
                                      onKeyDown={(evt) => {
                                        // Prevent non-numeric characters and symbols
                                        if (
                                          !(
                                            (
                                              (evt.key >= "0" &&
                                                evt.key <= "9") || // Allow number keys
                                              evt.key === "." || // Allow decimal point
                                              evt.key === "Backspace" || // Allow backspace
                                              evt.key === "Delete" || // Allow delete
                                              evt.key === "ArrowLeft" || // Allow left arrow key
                                              evt.key === "ArrowRight" || // Allow right arrow key
                                              evt.key === "Tab"
                                            ) // Allow tab key
                                          )
                                        ) {
                                          evt.preventDefault();
                                        }
                                      }}
                                      autoComplete="off"
                                      name="amount"
                                      value={amount}
                                      disabled={show_otpref.current == true}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        // Allow only values greater than or equal to 0
                                        if (value >= 0) {
                                          handleChangeChang(e); // Call your handleChange to update the state
                                        }
                                      }}
                                      onInput={(evt) => {
                                        // Prevent more than one decimal point
                                        if (
                                          evt.target.value.split(".").length > 2
                                        ) {
                                          evt.target.value =
                                            evt.target.value.slice(0, -1);
                                        }
                                      }}
                                      placeholder="Enter the amount"
                                      fluid
                                      className="dep-drops"
                                    />

                                    {amountValidate == true ? (
                                      <span className="errorcss mt-0">
                                        {" "}
                                        {validationnErr.amount}{" "}
                                      </span>
                                    ) : (
                                      ""
                                    )}

                                    {show_otpref.current == true ? (
                                      <>
                                        <div className="form_div p-0 mt-3">
                                          <h6>Withdraw OTP</h6>
                                          <input
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Enter Withdraw OTP"
                                            name="withdraw_otp"
                                            value={withdraw_otp}
                                            maxLength={4}
                                            onInput={(e) => {
                                              e.target.value =
                                                e.target.value.replace(
                                                  /[^0-9]/g,
                                                  ""
                                                ); // Allows only numbers
                                            }}
                                            onKeyDown={(e) => {
                                              if (
                                                [
                                                  "e",
                                                  "E",
                                                  "+",
                                                  "-",
                                                  ".",
                                                ].includes(e.key) // Prevent non-numeric characters
                                              ) {
                                                e.preventDefault();
                                              }
                                            }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              if (
                                                value >= 0 &&
                                                value.length <= 6
                                              ) {
                                                const formData = {
                                                  ...formValue,
                                                  [e.target.name]: value,
                                                };
                                                setFormValue(formData);
                                                validateWith(formData);
                                                validate_preview(formData);
                                              }
                                            }}
                                            className="dep-drops"
                                          />
                                          {otpValidate === true && (
                                            <span className="errorcss mt-0">
                                              {validationnErr.withdraw_otp}
                                            </span>
                                          )}
                                          <span className="text-end text-white w-100 px-1">
                                            Didn't receive code ?
                                            <a>
                                              {resendClick == false ? (
                                                <>
                                                  {isResendVisible ? (
                                                    <span
                                                      onClick={handleResend}
                                                      className="cursor-pointer"
                                                    >
                                                      <a className="text-yellow">
                                                        {" "}
                                                        Resend
                                                      </a>
                                                    </span>
                                                  ) : (
                                                    <span className="text-yellow">
                                                      {" "}
                                                      {counter}s
                                                    </span>
                                                  )}
                                                </>
                                              ) : (
                                                <i class="fa-solid fa-circle-notch fa-spin text-yellow px-2"></i>
                                              )}
                                            </a>
                                          </span>
                                        </div>
                                      </>
                                    ) : (
                                      ""
                                    )}

                                    {/* {withdrawType == "1" ? ( */}
                                    {show_otpref.current == true ? (
                                      <>
                                        {sessionStorage.getItem("tfa_status") ==
                                          0 || 1 ? (
                                          <>
                                            <div className="form_div p-0 mt-4">
                                              <h6>2FA Verification Code</h6>
                                              <input
                                                type="text"
                                                autoComplete="off"
                                                maxLength={6}
                                                name="tfa"
                                                autocomplete="off"
                                                value={tfa}
                                                placeholder="Enter 2FA Code"
                                                onKeyDown={(e) => {
                                                  if (
                                                    [
                                                      "e",
                                                      "E",
                                                      "+",
                                                      "-",
                                                      ".",
                                                    ].includes(e.key) // Prevent non-numeric characters
                                                  ) {
                                                    e.preventDefault();
                                                  }
                                                }}
                                                onInput={(e) => {
                                                  e.target.value =
                                                    e.target.value.replace(
                                                      /[^0-9]/g,
                                                      ""
                                                    ); // Allows only numbers
                                                }}
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  if (
                                                    value >= 0 &&
                                                    value.length <= 6
                                                  ) {
                                                    const formData = {
                                                      ...formValue,
                                                      [e.target.name]: value,
                                                    };
                                                    setFormValue(formData);
                                                    validateWith(formData); // Calling your validate function with updated form data
                                                    validate_preview(formData);
                                                  }
                                                }}
                                                className="dep-drops"
                                              />
                                              {tfaValidate === true && (
                                                <span className="errorcss mt-0">
                                                  {validationnErr.tfa}
                                                </span>
                                              )}
                                            </div>
                                          </>
                                        ) : (
                                          ""
                                        )}
                                      </>
                                    ) : (
                                      ""
                                    )}

                                    {selectedCurrref.current ? (
                                      <>
                                        <div className="fees_content mt-4">
                                          <h4>Fees</h4>
                                          <p>
                                            {selectedCurrref.current.withdrawFee
                                              ? selectedCurrref.current
                                                  .withdrawFee
                                              : "0.0"}{" "}
                                            %
                                          </p>
                                        </div>
                                        <div className="fees_content ">
                                          <h4>Available balance</h4>
                                          <p>
                                            {balanceref.current
                                              ? balanceref.current.toFixed(6)
                                              : "0.0"}
                                            {
                                              selectedCurrref.current
                                                .currencysymbol
                                            }
                                          </p>
                                        </div>
                                        <div className="fees_content ">
                                          <h4>Minimum withdraw</h4>
                                          <p>
                                            {selectedCurrref.current
                                              .minWithdrawLimit
                                              ? selectedCurrref.current
                                                  .minWithdrawLimit
                                              : "0.0"}
                                          </p>
                                        </div>
                                        <div className="fees_content">
                                          <h4>Maximum withdraw</h4>
                                          <p>
                                            {selectedCurrref.current
                                              .maxWithdrawLimit
                                              ? selectedCurrref.current
                                                  .maxWithdrawLimit
                                              : "0.0"}
                                          </p>
                                        </div>
                                      </>
                                    ) : (
                                      ""
                                    )}

                                    {buttonLoader == false ? (
                                      <div className="sumbit_btn">
                                        {sessionStorage.getItem("tfa_status") ==
                                        0 ? (
                                          <button
                                            onClick={() =>
                                              nav_page("/adminprofile")
                                            }
                                          >
                                            Enable2FA
                                          </button>
                                        ) : show_otpref.current == true ? (
                                          <button
                                            onClick={() => withdrawSubmit()}
                                          >
                                            Submit
                                          </button>
                                        ) : show_otpref.current == false ? (
                                          <button
                                            onClick={() => withdrawPreview()}
                                          >
                                            Next
                                          </button>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    ) : (
                                      <div className="sumbit_btn">
                                        <button>Loading ...</button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminWallet;
