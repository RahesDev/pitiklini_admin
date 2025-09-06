import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import useState from "react-usestateref";

import { toast } from "react-toastify";
import Sidebar_2 from "./Nav_bar";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { env } from "../core/service/envconfig";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/material/Typography";
import Modal from "@mui/joy/Modal";
import { Bars } from "react-loader-spinner";

function Dashboard() {
  const [add, setAdd] = useState(false);
  const [stakingpage, setstakingpage] = useState(false);
  const [stakeflex, setstakeflex] = useState(false);

  const [Currencydata, setCurrencydata] = useState([]);
  const [cmsdata, setcmsdata] = useState([]);
  const [validationnErr, setvalidationnErr] = useState({});
  const [stakevalidationerr, setstakevalidationerr] = useState({});
  const [flexstakevalidation, setflexstakevalidation] = useState({});
  const [loader,setLoader] = useState(false);
  const [buttonLoader,setButtonLoader] = useState(false);
  const [buttonLoaderStake,setButtonLoaderStake] = useState(false);

  const [filterKeyword, setFilterKeyword] = useState("");

  const [formData, setFormData, formDataref] = useState({
    currencySymbol: "",
    currencyName: "",
    coinType: "", // 1 for crypto, 2 for FIAT
    currencyType: "", // 1 for coin, 2 for token
    minSwap: 0,
    maxSwap: 0,
    swapFee: 0,
    swapStatus: "", // 0 for Deactive, 1 for Active
    minWithdrawLimit: 0,
    withdrawFee: 0,
    maxWithdrawLimit: 0,
    withdrawStatus: "", // 0 for Deactive, 1 for Active
    depositStatus: "", // 0 for Deactive, 1 for Active
    status: "", // 0 for Deactive, 1 for Active
    // launchpadStatus: "",
    p2p_status: "",
    erc20token: "",
    trc20token: "",
    bep20token: "",
    contractAddress_erc20: "",
    coinDecimal_erc20: "",
    contractAddress_trc20: "",
    coinDecimal_trc20: "",
    contractAddress_bep20: "",
    coinDecimal_bep20: "",
    Currency_image: "",
    // withdrawFee_usdt: 0,
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    const errors = validateForm(updatedFormData);
    setvalidationnErr(errors);
  };


  const handleSubmit = async (e) => {
    console.log("knjkmkmkmkmk",e);
    e.preventDefault();
    const errors = validateForm(formData);
    console.log("form errors---",errors);

    if (Object.keys(errors).length > 0) {
      setvalidationnErr(errors);
      return;
    }
    setvalidationnErr({});
    console.log("Form data submitted:", formData);

    var datas = {
      apiUrl: apiService.currencyAddUpdate,
      payload: formData,
    };

    setButtonLoader(true);
    var response = await postMethod(datas);
    setButtonLoader(false);
    console.log(response, "=-=-=-=response=-=-=");

    if (response.status) {
      toast.success(response.Message);

    } else {
      toast.error(response.Message);

    }
    getUserDetails();
    setAdd(false);
    setstakingpage(false);
    setstakeflex(false);
    setFormData({});
    setStakingData({});
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);


  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };
  useEffect(() => {
    getUserDetails(currentPage);
  }, [currentPage, filterKeyword]);


  const getUserDetails = async (page = 1) => {

    const data = {
      apiUrl: apiService.allCurrencyListCrypto,
      payload: { page, limit: 5, keyword: filterKeyword }, // Include the keyword here
    };
    const response = await postMethod(data);
    if (response.status) {
      setFilteredUsers(response.data);
      setTotalPages(response.totalPages);

    } else {
      setCurrencydata([]);
    }
  };

  const handleFilterChange = (e) => {
    setFilterKeyword(e.target.value);
  };

  const [imageName, setimageName] = useState("");

  const handleFileChange = (val) => {
    try {
      console.log(val);

      const fileExtension = val.name.split(".").at(-1);
      const fileSize = val.size;
      const fileName = val.name;
      setimageName(fileName);

      if (
        fileExtension != "png" &&
        fileExtension != "jpg" &&
        fileExtension != "jpeg"
      ) {
        toast.error(
          "File does not support. You must use .png or .jpg or .jpeg "
        );
      } else if (fileSize > 10000000) {
        toast.error("Please upload a file smaller than 1 MB");
      } else {
        const data = new FormData();
        data.append("file", val);
        data.append("upload_preset", env.upload_preset);
        data.append("cloud_name", env.cloud_name);
        fetch(
          "https://api.cloudinary.com/v1_1/" + env.cloud_name + "/auto/upload",
          { method: "post", body: data }
        )
          .then((resp) => resp.json())
          .then((data) => {
            const imageUrl = data.secure_url;

            // Update the state with the image URL
            setFormData((prevState) => ({
              ...prevState,
              Currency_image: imageUrl,
            }));

            // Validate the form with the updated form data
            validateForm({
              ...formData,
              Currency_image: imageUrl,
            });
          })
          .catch((err) => {
            console.log(err);
            toast.error("Please try again later");
          });
      }
    } catch (error) {
      console.log(error);
      toast.error("Please try again later");
    }
  };



  const getEditDetails = async (data) => {
    console.log(data, "data");

    var obj = {
      _id: data,
    };
    var datas = {
      apiUrl: apiService.viewOneCurrency,
      payload: obj,
    };
    setLoader(true);
    var response = await postMethod(datas);
    setLoader(false);
    if (response.status) {
      setFormData(response.Message);
      setAdd(true);
      console.log(formData, "=-=-=-=response=-=-=");

    } else {
      setcmsdata({});
    }
  };


  const deletecurrency = async (data) => {
    console.log(data, "data");

    var obj = {
      _id: data,
    };
    var datas = {
      apiUrl: apiService.deletecurrency,
      payload: obj,
    };
    setLoader(true);
    var response = await postMethod(datas);
    setLoader(false);
    console.log(response, "=-=-=-=response=-=-=");

    if (response.status) {
      toast.success(response.Message);
      getUserDetails();

      // setAdd(true);
    } else {
      toast.error(response.Message);

      // setcmsdata({});
    }
  };


  const validateForm = (values) => {
    const errors = {};

    // Common validations
    if (!values.currencySymbol) {
      errors.currencySymbol = "Currency Symbol is required";
    } else if (values.currencySymbol.length > 5) {
      errors.currencySymbol = "Max 5 characters allowed";
    }

    if (!values.currencyName) {
      errors.currencyName = "Currency Name is required";
    } else if (values.currencyName.length > 50) {
      errors.currencyName = "Max 50 characters allowed";
    }

    if (!values.Currency_image) {
      errors.Currency_image = "Currency Image is required";
    }
    if (!values.minSwap) {
      errors.minSwap = "Minimum Swap is required";
    } else if (values.minSwap < 0) {
      errors.minSwap = "Value must be positive";
    }

    if (!values.maxSwap) {
      errors.maxSwap = "Maximum Swap is required";
    } else if (values.maxSwap < values.minSwap) {
      errors.maxSwap = "Max Swap must be greater than Min Swap";
    }

    if (!values.swapFee) {
      errors.swapFee = "Swap Fee is required";
    } else if (values.swapFee < 0) {
      errors.swapFee = "Value must be positive";
    }

    if (!values.minWithdrawLimit) {
      errors.minWithdrawLimit = "Minimum Withdraw Limit is required";
    } else if (values.minWithdrawLimit < 0) {
      errors.minWithdrawLimit = "Value must be positive";
    }

    if(values.currencySymbol != "USDT")
    {
       if (!values.withdrawFee) {
         errors.withdrawFee = "Withdraw Fee is required";
        } else if (values.withdrawFee < 0) {
          errors.withdrawFee = "Value must be positive";
        }
    }
   

    if (!values.maxWithdrawLimit) {
      errors.maxWithdrawLimit = "Maximum Withdraw Limit is required";
    } else if (values.maxWithdrawLimit < values.minWithdrawLimit) {
      errors.maxWithdrawLimit =
        "Max Withdraw Limit must be greater than Min Withdraw Limit";
    }

    // Validations for status fields
    if (
      values.swapStatus == undefined ||
      values.swapStatus == "" ||
      values.swapStatus == null
    ) {
      errors.swapStatus = "Swap Status is required";
    }

    if (
      values.withdrawStatus == undefined ||
      values.withdrawStatus == "" ||
      values.withdrawStatus == null
    ) {
      errors.withdrawStatus = "Withdraw Status is required";
    }

    if (
      values.depositStatus == undefined ||
      values.depositStatus == "" ||
      values.depositStatus == null
    ) {
      errors.depositStatus = "Deposit Status is required";
    }

    if (
      values.status == undefined ||
      values.status == "" ||
      values.status == null
    ) {
      errors.status = "Status is required";
    }

    if (
      values.coinType == undefined ||
      values.coinType == "" ||
      values.coinType == null
    ) {
      errors.coinType = "coinType is required";
    }

    // Conditional validations based on coinType
    if (values.coinType == 1) {
      if (
        values.currencyType == undefined ||
        values.currencyType == "" ||
        values.currencyType == null
      ) {
        errors.currencyType = "Currency Type is required";
      }

      // if (
      //   values.launchpadStatus == undefined ||
      //   values.launchpadStatus == "" ||
      //   values.launchpadStatus == null
      // ) {
      //   errors.launchpadStatus = "Launchpad Status is required";
      // }
      
    } else if (values.coinType == 2) {
      if (
        values.p2p_status == undefined ||
        values.p2p_status == "" ||
        values.p2p_status == null
      ) {
        errors.p2p_status = "P2P Status is required";
      }
    }

    // Conditional validations for tokens
    if (values.currencyType == 2) {
      if (
        values.erc20token == undefined ||
        values.erc20token == "" ||
        values.erc20token == null
      ) {
        errors.erc20token = "erc20token is required";
      }

      if (
        values.trc20token == undefined ||
        values.trc20token == "" ||
        values.trc20token == null
      ) {
        errors.trc20token = "trc20token is required";
      }

      if (
        values.bep20token == undefined ||
        values.bep20token == "" ||
        values.bep20token == null
      ) {
        errors.bep20token = "bep20token is required";
      }

      if (values.erc20token == 1) {
        if (!values.contractAddress_erc20) {
          errors.contractAddress_erc20 = "ERC20 Contract Address is required";
        }
        if (!values.coinDecimal_erc20) {
          errors.coinDecimal_erc20 = "ERC20 Coin Decimal is required";
        } else if (values.coinDecimal_erc20 < 0) {
          errors.coinDecimal_erc20 = "Value must be positive";
        }
      }

      if (values.trc20token == 1) {
        if (!values.contractAddress_trc20) {
          errors.contractAddress_trc20 = "TRC20 Contract Address is required";
        }
        if (!values.coinDecimal_trc20) {
          errors.coinDecimal_trc20 = "TRC20 Coin Decimal is required";
        } else if (values.coinDecimal_trc20 < 0) {
          errors.coinDecimal_trc20 = "Value must be positive";
        }
      }

      if (values.bep20token == 1) {
        if (!values.contractAddress_bep20) {
          errors.contractAddress_bep20 = "BEP20 Contract Address is required";
        }
        if (!values.coinDecimal_bep20) {
          errors.coinDecimal_bep20 = "BEP20 Coin Decimal is required";
        } else if (values.coinDecimal_bep20 < 0) {
          errors.coinDecimal_bep20 = "Value must be positive";
        }
      }

      // if(values.currencySymbol == "USDT")
      // {
      //    if (!values.withdrawFee_usdt) {
      //     errors.withdrawFee_usdt = "Withdraw Fee is required";
      //   } else if (values.withdrawFee_usdt < 0) {
      //     errors.withdrawFee_usdt = "Value must be positive";
      //   }
      // }
    }

    return errors;
  };

  const sentback = async (data) => {
    setAdd(false);
    setstakingpage(false);

    setFormData({});
  };

  const stakingstate = async (data, id) => {


    var obj = {
      currencyId: id,
    };
    var datas = {
      apiUrl: apiService.getStaking,
      payload: obj,
    };
    setLoader(true);
    var response = await postMethod(datas);
    console.log(response, "=-=-=-=response=-=-=");
    setLoader(false);


    if (response.status) {
      setStakingData(response.Message);

    } else {
      await getEditDetails(id);

      console.log(formDataref.current);
      setStakingData({

        currencyName: formDataref.current.currencyName,
        currencySymbol: formDataref.current.currencySymbol,
        currencyImage: formDataref.current.Currency_image,
        currencyId: formDataref.current._id,

      });

    }

    setstakingpage(true);
    if (data == "Fixed") {
      setstakeflex(false);
    } else {
      setstakeflex(true);
    }
  };

  const [stakingdata, setStakingData] = useState({
    currencySymbol: "",
    currencyName: "",
    firstDuration: 0,
    secondDuration: 0,
    thirdDuration: 0,
    fourthDuration: 0,
    APRinterest: 0,
    maximumStaking: 0,
    minimumStaking: 0,
    FistDurationAPY: 0,
    SecondDurationAPY: 0,
    ThirdDurationAPY: 0,
    FourthDurationAPY: 0,
    minimumStakingflex: 0,
    maximumStakingflex: 0,
    status: "",
    statusflex: "",
  });

  const handlestakeChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...stakingdata, [name]: value };
    setStakingData(updatedFormData);

    const errors = validateFixedStaking(updatedFormData);
    setstakevalidationerr(errors);
  };

  const handleflexstakeChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...stakingdata, [name]: value };
    setStakingData(updatedFormData);

    const errors = validateFlexibleStaking(updatedFormData);
    setflexstakevalidation(errors);
  };

  const handlestakeSubmit = async (e, type) => {
    e.preventDefault();

    let errors = {};

    if (type === "Fixed") {
      errors = validateFixedStaking(stakingdata);
      if (Object.keys(errors).length > 0) {
        setstakevalidationerr(errors);
        return;
      }
      setstakevalidationerr({});
    } else {
      errors = validateFlexibleStaking(stakingdata);
      if (Object.keys(errors).length > 0) {
        setflexstakevalidation(errors);
        return;
      }
      setflexstakevalidation({});
    }

    console.log("Form data submitted:", stakingdata);
    const data = {
      apiUrl: apiService.updateStakingFlexible,
      payload: stakingdata,
    };

    try {
      setButtonLoaderStake(true);
      const response = await postMethod(data);
      console.log("Response:", response);
      setButtonLoaderStake(false);
      if (response.status) {
        toast.success(response.Message);




      } else {
        toast.error(response.Message);
      }
      getUserDetails();
      setAdd(false);
      setstakingpage(false);
      setstakeflex(false);
      setFormData({});
      setStakingData({});
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  const validateFixedStaking = (values) => {
    const errors = {};

    if (!values.currencySymbol) {
      errors.currencySymbol = "Currency Symbol is required";
    } else if (values.currencySymbol.length > 5) {
      errors.currencySymbol = "Max 5 characters allowed";
    }

    if (!values.currencyName) {
      errors.currencyName = "Currency Name is required";
    } else if (values.currencyName.length > 50) {
      errors.currencyName = "Max 50 characters allowed";
    }

    if (!values.firstDuration) {
      errors.firstDuration = "First Duration Limit is required";
    }

    if (!values.secondDuration) {
      errors.secondDuration = "Second Duration Limit is required";
    }

    if (!values.thirdDuration) {
      errors.thirdDuration = "Third Duration Limit is required";
    }
    if (!values.fourthDuration) {
      errors.fourthDuration = "Fourth Duration Limit is required";
    } 

    if (!values.FistDurationAPY) {
      errors.FistDurationAPY = "First Duration APY is required";
    }

    if (!values.SecondDurationAPY) {
      errors.SecondDurationAPY = "Second Duration APY is required";
    }

    if (!values.ThirdDurationAPY) {
      errors.ThirdDurationAPY = "Third Duration APY is required";
    }

    if (!values.FourthDurationAPY) {
      errors.FourthDurationAPY = "Fourth Duration APY is required";
    }

    if (!values.maximumStaking) {
      errors.maximumStaking = "Maximum Staking Limit is required";
    } else if (values.maximumStaking < values.minimumStaking) {
      errors.maximumStaking =
        "Max Staking Limit must be greater than Min Staking Limit";
    }

    if (!values.minimumStaking) {
      errors.minimumStaking = "Minimum Staking Limit is required";
    }
    if (!values.status) {
      errors.status = "Status is required";
    }

    return errors;
  };

  const validateFlexibleStaking = (values) => {
    const errors = {};

    if (!values.currencySymbol) {
      errors.currencySymbol = "Currency Symbol is required";
    } else if (values.currencySymbol.length > 5) {
      errors.currencySymbol = "Max 5 characters allowed";
    }

    if (!values.currencyName) {
      errors.currencyName = "Currency Name is required";
    } else if (values.currencyName.length > 50) {
      errors.currencyName = "Max 50 characters allowed";
    }

    if (!values.APRinterest) {
      errors.APRinterest = "APY Interest is required";
    } else if (values.APRinterest < 0) {
      errors.APRinterest = "Value must be positive";
    }

    if (!values.maximumStakingflex) {
      errors.maximumStakingflex = "Maximum Staking Limit is required";
    } else if (values.maximumStakingflex < values.minimumStakingflex) {
      errors.maximumStakingflex =
        "Max Staking Limit must be greater than Min Staking Limit";
    }

    if (!values.minimumStakingflex) {
      errors.minimumStakingflex = "Minimum Staking Limit is required";
    }

    if (!values.statusflex) {
      errors.statusflex = "Status is required";
    }

    return errors;
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
      ):(
        <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2 px-0">
            <Sidebar />
          </div>
          <div className="col-lg-10 px-0">
            <div className="pos_sticky">
              <Sidebar_2 />
            </div>
            <div className="px-4 transaction_padding_top">
              {stakingpage == false ? (
                <div className="px-2 my-4 transaction_padding_top tops">
                  <div className="headerss">
                    <span className="dash-head">Crypto Currency Settings</span>
                    {add == false ? (
                      <div className="top_filter">
                        <input
                          className="filters"
                          placeholder="Enter Currencyname to filter"
                          value={filterKeyword}
                          onChange={handleFilterChange}
                        />
                        <i
                          className="fa-solid fa-circle-plus adds cursor-pointer"
                          onClick={() => setAdd(true)}
                        ></i>
                      </div>
                    ) : (
                      <button onClick={() => sentback()}>Back</button>
                    )}
                  </div>
                  {add == false ? (
                    <div className="table-responsive my-5 trans-table">
                      <table className="w_100">
                        <thead className="trans-head">
                          <tr>
                            <th>S.No</th>
                            <th>Currency Image</th>
                            <th>Name</th>
                            <th>Symbol</th>
                            <th>Status</th>
                            {/* <th>Fixed Staking</th>
                            <th>Flexible Staking</th> */}
                            <th>Action</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((item, i) => (
                              <tr key={item._id}>
                                <td>
                                  <span className="plus_14_ff">{i + 1}</span>
                                </td>
                                <td>
                                  <span className="plus_14_ff">
                                    <img
                                      width="35px"
                                      src={item.Currency_image}
                                      alt="Currency"
                                    />
                                  </span>
                                </td>
                                <td>
                                  <span className="plus_14_ff">
                                    {item.name}
                                  </span>
                                </td>
                                <td>
                                  <span className="plus_14_ff">
                                    {item.symbol}
                                  </span>
                                </td>
                                <td>
                                  {item.status == "Active" ? (
                                    <span className="plus_14_ff text-success">
                                      {item.status}
                                    </span>
                                  ) : (
                                    <span className="plus_14_ff text-danger">
                                      {item.status}
                                    </span>
                                  )}
                                </td>
                                {/* <td>
                                  <span className="plus_14_ff">
                                    <i
                                      className="fa-regular fa-pen-to-square cursor-pointer"
                                      onClick={() => stakingstate("Fixed", item._id)}
                                    ></i>
                                  </span>
                                </td>
                                <td>
                                  <span className="plus_14_ff">
                                    <i
                                      className="fa-regular fa-pen-to-square cursor-pointer"
                                      onClick={() => stakingstate("FLexible", item._id)}
                                    ></i>
                                  </span>
                                </td> */}
                                <td>
                                  <span className="plus_14_ff">
                                    <i
                                      className="fa-regular fa-pen-to-square cursor-pointer"
                                      onClick={() => getEditDetails(item._id)}
                                    ></i>
                                  </span>
                                </td>
                                <td>
                                  <span className="plus_14_ff">
                                    <i
                                      className="fa-regular fa-trash-can text-danger cursor-pointer"
                                      onClick={() => deletecurrency(item._id)}
                                    ></i>
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={9}>
                                <div className="empty_data my-4">
                                  <div className="plus_14_ff">
                                    No Records Found
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}

{filteredUsers.length > 0 ? (
                            <tr className="text-center">
                            <td colSpan="9">
                              <div className="paginationcss">
                                <ReactPaginate
                                  previousLabel={"<"}
                                  nextLabel={">"}
                                  breakLabel={"..."}
                                  pageCount={totalPages}
                                  marginPagesDisplayed={1}
                                  pageRangeDisplayed={2}
                                  onPageChange={handlePageClick}
                                  containerClassName={"pagination pagination-md justify-content-center"}
                                  pageClassName={"page-item"}
                                  pageLinkClassName={"page-link"}
                                  previousClassName={"page-item"}
                                  previousLinkClassName={"page-link"}
                                  nextClassName={"page-item"}
                                  nextLinkClassName={"page-link"}
                                  breakClassName={"page-item"}
                                  breakLinkClassName={"page-link"}
                                  activeClassName={"active"}
                                />
                              </div>
                            </td>
                          </tr>
) : (
  	""
)}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="currencyinput mt-5">
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Currency Symbol
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            name="currencySymbol"
                            value={formData.currencySymbol}
                            onChange={handleChange}
                            placeholder="Currency Symbol"
                            className="form-control"
                            required
                          />
                          <div className="help-block">
                            {validationnErr.currencySymbol && (
                              <div className="error">
                                {validationnErr.currencySymbol}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Currency Name
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            name="currencyName"
                            value={formData.currencyName}
                            onChange={handleChange}
                            placeholder="Currency Name"
                            className="form-control"
                          />
                          <div className="help-block">
                            {validationnErr.currencyName && (
                              <div className="error">
                                {validationnErr.currencyName}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Currency Image
                        </label>
                        <div className="col-lg-6">
                          <div className="radio">
                            <div className="imagefile">
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleFileChange(e.target.files[0])
                                }
                              />{" "}
                              {imageName == ""
                                ? "Upload Currency Image"
                                : imageName}
                            </div>
                            <img src={formData.Currency_image} width="50px" />
                          </div>
                          <div className="help-block">
                            {validationnErr.Currency_image && (
                              <div className="error">
                                {validationnErr.Currency_image}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Asset Type
                        </label>
                        <div className="col-lg-6">
                          <div className="radio">
                            <div>
                              <input
                                type="radio"
                                name="coinType"
                                value="1"
                                onChange={handleChange}
                                checked={formData.coinType == "1"}
                              />{" "}
                              Crypto
                            </div>
                            <div>
                              <input
                                type="radio"
                                name="coinType"
                                value="2"
                                onChange={handleChange}
                                checked={formData.coinType == "2"}
                              />{" "}
                              FIAT
                            </div>
                          </div>
                          <div className="help-block">
                            {validationnErr.coinType && (
                              <div className="error">
                                {validationnErr.coinType}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {formData.coinType == "1" && (
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Currency Type
                          </label>
                          <div className="col-lg-6">
                            <div className="radio">
                              <div>
                                <input
                                  type="radio"
                                  name="currencyType"
                                  value="1"
                                  onChange={handleChange}
                                  checked={formData.currencyType == "1"}
                                />{" "}
                                Coin
                              </div>
                              <div>
                                <input
                                  type="radio"
                                  name="currencyType"
                                  value="2"
                                  onChange={handleChange}
                                  checked={formData.currencyType == "2"}
                                />{" "}
                                Token
                              </div>
                            </div>
                            <div className="help-block">
                              {validationnErr.currencyType && (
                                <div className="error">
                                  {validationnErr.currencyType}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {formData.currencyType == "2" &&
                        formData.coinType == "1" && (
                          <>
                            <div className="form-group row">
                              <label className="col-lg-6 col-form-label form-control-label">
                                ERC20 Token
                              </label>
                              <div className="col-lg-6">
                                <div className="radio">
                                  <div>
                                    <input
                                      type="radio"
                                      name="erc20token"
                                      value="1"
                                      onChange={handleChange}
                                      checked={formData.erc20token == "1"}
                                    />{" "}
                                    True
                                  </div>
                                  <div>
                                    <input
                                      type="radio"
                                      name="erc20token"
                                      value="2"
                                      onChange={handleChange}
                                      checked={formData.erc20token == "2"}
                                    />{" "}
                                    False
                                  </div>
                                </div>
                                <div className="help-block">
                                  {validationnErr.erc20token && (
                                    <div className="error">
                                      {validationnErr.erc20token}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {formData.erc20token == "1" && (
                              <>
                                <div className="form-group row">
                                  <label className="col-lg-6 col-form-label form-control-label">
                                    ERC20 Contract Address
                                  </label>
                                  <div className="col-lg-6">
                                    <input
                                      type="text"
                                      name="contractAddress_erc20"
                                      value={formData.contractAddress_erc20}
                                      onChange={handleChange}
                                      placeholder="ERC20 Contract Address"
                                      className="form-control"
                                    />
                                    <div className="help-block">
                                      {validationnErr.contractAddress_erc20 && (
                                        <div className="error">
                                          {validationnErr.contractAddress_erc20}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="form-group row">
                                  <label className="col-lg-6 col-form-label form-control-label">
                                    ERC20 Coin Decimal
                                  </label>
                                  <div className="col-lg-6">
                                    <input
                                      type="number"
                                      min={0}
                                      name="coinDecimal_erc20"
                                      value={formData.coinDecimal_erc20}
                                      onChange={handleChange}
                                      placeholder="ERC20 Coin Decimal"
                                      className="form-control"
                                    />
                                    <div className="help-block">
                                      {validationnErr.coinDecimal_erc20 && (
                                        <div className="error">
                                          {validationnErr.coinDecimal_erc20}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            <div className="form-group row">
                              <label className="col-lg-6 col-form-label form-control-label">
                                TRC20 Token
                              </label>
                              <div className="col-lg-6">
                                <div className="radio">
                                  <div>
                                    <input
                                      type="radio"
                                      name="trc20token"
                                      value="1"
                                      onChange={handleChange}
                                      checked={formData.trc20token == "1"}
                                    />{" "}
                                    True
                                  </div>
                                  <div>
                                    <input
                                      type="radio"
                                      name="trc20token"
                                      value="2"
                                      onChange={handleChange}
                                      checked={formData.trc20token == "2"}
                                    />{" "}
                                    False
                                  </div>
                                </div>
                                <div className="help-block">
                                  {validationnErr.trc20token && (
                                    <div className="error">
                                      {validationnErr.trc20token}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {formData.trc20token == "1" && (
                              <>
                                <div className="form-group row">
                                  <label className="col-lg-6 col-form-label form-control-label">
                                    TRC20 Contract Address
                                  </label>
                                  <div className="col-lg-6">
                                    <input
                                      type="text"
                                      name="contractAddress_trc20"
                                      value={formData.contractAddress_trc20}
                                      onChange={handleChange}
                                      placeholder="TRC20 Contract Address"
                                      className="form-control"
                                    />
                                    <div className="help-block">
                                      {validationnErr.contractAddress_trc20 && (
                                        <div className="error">
                                          {validationnErr.contractAddress_trc20}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="form-group row">
                                  <label className="col-lg-6 col-form-label form-control-label">
                                    TRC20 Coin Decimal
                                  </label>
                                  <div className="col-lg-6">
                                    <input
                                      type="number"
                                      min={0}
                                      name="coinDecimal_trc20"
                                      value={formData.coinDecimal_trc20}
                                      onChange={handleChange}
                                      placeholder="TRC20 Coin Decimal"
                                      className="form-control"
                                    />
                                    <div className="help-block">
                                      {validationnErr.coinDecimal_trc20 && (
                                        <div className="error">
                                          {validationnErr.coinDecimal_trc20}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            <div className="form-group row">
                              <label className="col-lg-6 col-form-label form-control-label">
                                BEP20 Token
                              </label>
                              <div className="col-lg-6">
                                <div className="radio">
                                  <div>
                                    <input
                                      type="radio"
                                      name="bep20token"
                                      value="1"
                                      onChange={handleChange}
                                      checked={formData.bep20token == "1"}
                                    />{" "}
                                    True
                                  </div>
                                  <div>
                                    <input
                                      type="radio"
                                      name="bep20token"
                                      value="2"
                                      onChange={handleChange}
                                      checked={formData.bep20token == "2"}
                                    />{" "}
                                    False
                                  </div>
                                </div>
                                <div className="help-block">
                                  {validationnErr.bep20token && (
                                    <div className="error">
                                      {validationnErr.bep20token}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {formData.bep20token == "1" && (
                              <>
                                <div className="form-group row">
                                  <label className="col-lg-6 col-form-label form-control-label">
                                    BEP20 Contract Address
                                  </label>
                                  <div className="col-lg-6">
                                    <input
                                      type="text"
                                      name="contractAddress_bep20"
                                      value={formData.contractAddress_bep20}
                                      onChange={handleChange}
                                      placeholder="BEP20 Contract Address"
                                      className="form-control"
                                    />
                                    <div className="help-block">
                                      {validationnErr.contractAddress_bep20 && (
                                        <div className="error">
                                          {validationnErr.contractAddress_bep20}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="form-group row">
                                  <label className="col-lg-6 col-form-label form-control-label">
                                    BEP20 Coin Decimal
                                  </label>
                                  <div className="col-lg-6">
                                    <input
                                      type="number"
                                      min={0}
                                      name="coinDecimal_bep20"
                                      value={formData.coinDecimal_bep20}
                                      onChange={handleChange}
                                      placeholder="BEP20 Coin Decimal"
                                      className="form-control"
                                    />
                                    <div className="help-block">
                                      {validationnErr.coinDecimal_bep20 && (
                                        <div className="error">
                                          {validationnErr.coinDecimal_bep20}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </>
                        )}

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Minimum Withdraw
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            name="minWithdrawLimit"
                            value={formData.minWithdrawLimit}
                            onChange={handleChange}
                            placeholder="Minimum Withdraw"
                            className="form-control"
                          />
                          <div className="help-block">
                            {validationnErr.minWithdrawLimit && (
                              <div className="error">
                                {validationnErr.minWithdrawLimit}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Maximum Withdraw
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            name="maxWithdrawLimit"
                            value={formData.maxWithdrawLimit}
                            onChange={handleChange}
                            placeholder="Maximum Withdraw"
                            className="form-control"
                          />
                          <div className="help-block">
                            {validationnErr.maxWithdrawLimit && (
                              <div className="error">
                                {validationnErr.maxWithdrawLimit}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                       {/* {formData.currencySymbol != "USDT" ? ( */}
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Withdraw Fees Fixed
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            name="withdrawFee"
                            value={formData.withdrawFee}
                            onChange={handleChange}
                            placeholder="Withdraw fees"
                            className="form-control"
                          />
                          <div className="help-block">
                            {validationnErr.withdrawFee && (
                              <div className="error">
                                {validationnErr.withdrawFee}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                       {/* ) : ("")} */}

                      {/* {formData.currencySymbol == "USDT" ? (
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Withdraw Fees for USDT (Fixed)
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            name="withdrawFee_usdt"
                            value={formData.withdrawFee_usdt}
                            onChange={handleChange}
                            placeholder="Withdraw fees"
                            className="form-control"
                          />
                          <div className="help-block">
                            {validationnErr.withdrawFee_usdt && (
                              <div className="error">
                                {validationnErr.withdrawFee_usdt}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      ) : ("")} */}

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Minimum Swap
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            name="minSwap"
                            value={formData.minSwap}
                            onChange={handleChange}
                            placeholder="Minimum Swap"
                            className="form-control"
                          />
                          <div className="help-block">
                            {validationnErr.minSwap && (
                              <div className="error">
                                {validationnErr.minSwap}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Maximum Swap
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            name="maxSwap"
                            value={formData.maxSwap}
                            onChange={handleChange}
                            placeholder="Maximum Swap"
                            className="form-control"
                          />
                          <div className="help-block">
                            {validationnErr.maxSwap && (
                              <div className="error">
                                {validationnErr.maxSwap}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Swap Fees
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            name="swapFee"
                            value={formData.swapFee}
                            onChange={handleChange}
                            placeholder="Swap fees"
                            className="form-control"
                          />
                          <div className="help-block">
                            {validationnErr.swapFee && (
                              <div className="error">
                                {validationnErr.swapFee}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Additional fields for depositStatus, withdrawStatus, etc. */}
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Deposit Status
                        </label>
                        <div className="col-lg-6">
                          <div className="radio">
                            <div>
                              <input
                                type="radio"
                                name="depositStatus"
                                value="Active"
                                onChange={handleChange}
                                checked={formData.depositStatus == "Active"}
                              />{" "}
                              Active
                            </div>
                            <div>
                              <input
                                type="radio"
                                name="depositStatus"
                                value="DeActive"
                                onChange={handleChange}
                                checked={formData.depositStatus == "DeActive"}
                              />{" "}
                              Deactive
                            </div>
                          </div>
                          <div className="help-block">
                            {validationnErr.depositStatus && (
                              <div className="error">
                                {validationnErr.depositStatus}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Withdraw Status
                        </label>
                        <div className="col-lg-6">
                          <div className="radio">
                            <div>
                              <input
                                type="radio"
                                name="withdrawStatus"
                                value="Active"
                                onChange={handleChange}
                                checked={formData.withdrawStatus == "Active"}
                              />{" "}
                              Active
                            </div>
                            <div>
                              <input
                                type="radio"
                                name="withdrawStatus"
                                value="DeActive"
                                onChange={handleChange}
                                checked={formData.withdrawStatus == "DeActive"}
                              />{" "}
                              Deactive
                            </div>
                          </div>
                          <div className="help-block">
                            {validationnErr.withdrawStatus && (
                              <div className="error">
                                {validationnErr.withdrawStatus}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Swap Status
                        </label>
                        <div className="col-lg-6">
                          <div className="radio">
                            <div>
                              <input
                                type="radio"
                                name="swapStatus"
                                value="1"
                                onChange={handleChange}
                                checked={formData.swapStatus == "1"}
                              />{" "}
                              Active
                            </div>
                            <div>
                              <input
                                type="radio"
                                name="swapStatus"
                                value="0"
                                onChange={handleChange}
                                checked={formData.swapStatus == "0"}
                              />{" "}
                              Deactive
                            </div>
                          </div>
                          <div className="help-block">
                            {validationnErr.swapStatus && (
                              <div className="error">
                                {validationnErr.swapStatus}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Status
                        </label>
                        <div className="col-lg-6">
                          <div className="radio">
                            <div>
                              <input
                                type="radio"
                                name="status"
                                value="Active"
                                onChange={handleChange}
                                checked={formData.status == "Active"}
                              />{" "}
                              Active
                            </div>
                            <div>
                              <input
                                type="radio"
                                name="status"
                                value="Deactive"
                                onChange={handleChange}
                                checked={formData.status == "Deactive"}
                              />{" "}
                              Deactive
                            </div>
                          </div>
                          <div className="help-block">
                            {validationnErr.status && (
                              <div className="error">
                                {validationnErr.status}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* {formData.coinType == "1" && (
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Launchpad Status
                          </label>
                          <div className="col-lg-6">
                            <div className="radio">
                              <div>
                                <input
                                  type="radio"
                                  name="launchpadStatus"
                                  value="Active"
                                  onChange={handleChange}
                                  checked={formData.launchpadStatus == "Active"}
                                />{" "}
                                Active
                              </div>
                              <div>
                                <input
                                  type="radio"
                                  name="launchpadStatus"
                                  value="DeActive"
                                  onChange={handleChange}
                                  checked={
                                    formData.launchpadStatus == "DeActive"
                                  }
                                />{" "}
                                Deactive
                              </div>
                            </div>
                            <div className="help-block">
                              {validationnErr.launchpadStatus && (
                                <div className="error">
                                  {validationnErr.launchpadStatus}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )} */}

                      {/* {formData.coinType == "2" && ( */}
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            P2P Status
                          </label>
                          <div className="col-lg-6">
                            <div className="radio">
                              <div>
                                <input
                                  type="radio"
                                  name="p2p_status"
                                  value="1"
                                  onChange={handleChange}
                                  checked={formData.p2p_status == "1"}
                                />{" "}
                                Active
                              </div>
                              <div>
                                <input
                                  type="radio"
                                  name="p2p_status"
                                  value="0"
                                  onChange={handleChange}
                                  checked={formData.p2p_status == "0"}
                                />{" "}
                                Deactive
                              </div>
                            </div>
                            <div className="help-block">
                              {validationnErr.p2p_status && (
                                <div className="error">
                                  {validationnErr.p2p_status}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      {/* )} */}

                      <div className="form-group row justify-content-center">
                        <div className="col-lg-4">
                          {buttonLoader == false ? (
                          <button
                          type="submit"
                          className="d-block w_100"
                          onClick={handleSubmit}
                        >
                          Submit
                        </button>
                          ) : (
                            <button
                            type="submit"
                            className="d-block w_100"
                          >
                            Loading ...
                          </button>
                          )}

                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="px-2 my-4 transaction_padding_top tops">
                  <div className="headerss">
                    <span className="dash-head">
                      {" "}
                      {stakeflex == false
                        ? "Fixed Staking Details"
                        : "Flexible Staking Details"}
                    </span>

                    <button onClick={() => sentback()}>Back</button>
                  </div>
                  {stakeflex == false ? (
                    <div className="currencyinput mt-5">
                      <form>
                        {/* Currency Name */}
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Currency Name
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              name="currencyName"
                              value={stakingdata.currencyName}
                              onChange={handlestakeChange}
                              placeholder="Currency Name"
                              className="form-control"
                            />
                            <div className="help-block">
                              {stakevalidationerr.currencyName && (
                                <div className="error">
                                  {stakevalidationerr.currencyName}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Currency Symbol */}
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Currency Symbol
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              name="currencySymbol"
                              value={stakingdata.currencySymbol}
                              onChange={handlestakeChange}
                              placeholder="Currency Symbol"
                              className="form-control"
                            />
                            <div className="help-block">
                              {stakevalidationerr.currencySymbol && (
                                <div className="error">
                                  {stakevalidationerr.currencySymbol}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Duration First */}
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Duration First
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="Number"
                              min={0}
                              name="firstDuration"
                              value={stakingdata.firstDuration}
                              onChange={handlestakeChange}
                              placeholder="Duration First"
                              className="form-control"
                            />
                            <div className="help-block">
                              {stakevalidationerr.firstDuration && (
                                <div className="error">
                                  {stakevalidationerr.firstDuration}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* First Duration APY */}
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            First Duration APY
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="Number"
                              min={0}
                              name="FistDurationAPY"
                              value={stakingdata.FistDurationAPY}
                              onChange={handlestakeChange}
                              placeholder="First Duration APY"
                              className="form-control"
                            />
                            <div className="help-block">
                              {stakevalidationerr.FistDurationAPY && (
                                <div className="error">
                                  {stakevalidationerr.FistDurationAPY}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Duration Second
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="Number"
                              min={0}
                              name="secondDuration"
                              value={stakingdata.secondDuration}
                              onChange={handlestakeChange}
                              placeholder="Duration Second"
                              className="form-control"
                            />
                            <div className="help-block">
                              {stakevalidationerr.secondDuration && (
                                <div className="error">
                                  {stakevalidationerr.secondDuration}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Second Duration APY */}
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Second Duration APY
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="Number"
                              min={0}
                              name="SecondDurationAPY"
                              value={stakingdata.SecondDurationAPY}
                              onChange={handlestakeChange}
                              placeholder="Second Duration APY"
                              className="form-control"
                            />
                            <div className="help-block">
                              {stakevalidationerr.SecondDurationAPY && (
                                <div className="error">
                                  {stakevalidationerr.SecondDurationAPY}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Duration Third
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="Number"
                              min={0}
                              name="thirdDuration"
                              value={stakingdata.thirdDuration}
                              onChange={handlestakeChange}
                              placeholder="Duration Third"
                              className="form-control"
                            />
                            <div className="help-block">
                              {stakevalidationerr.thirdDuration && (
                                <div className="error">
                                  {stakevalidationerr.thirdDuration}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Third Duration APY */}
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Third Duration APY
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="Number"
                              min={0}
                              name="ThirdDurationAPY"
                              value={stakingdata.ThirdDurationAPY}
                              onChange={handlestakeChange}
                              placeholder="Third Duration APY"
                              className="form-control"
                            />
                            <div className="help-block">
                              {stakevalidationerr.ThirdDurationAPY && (
                                <div className="error">
                                  {stakevalidationerr.ThirdDurationAPY}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Duration Fourth
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="Number"
                              min={0}
                              name="fourthDuration"
                              value={stakingdata.fourthDuration}
                              onChange={handlestakeChange}
                              placeholder="Duration Fourth"
                              className="form-control"
                            />
                            <div className="help-block">
                              {stakevalidationerr.fourthDuration && (
                                <div className="error">
                                  {stakevalidationerr.fourthDuration}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Fourth Duration APY */}
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Fourth Duration APY
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="Number"
                              min={0}
                              name="FourthDurationAPY"
                              value={stakingdata.FourthDurationAPY}
                              onChange={handlestakeChange}
                              placeholder="Fourth Duration APY"
                              className="form-control"
                            />
                            <div className="help-block">
                              {stakevalidationerr.FourthDurationAPY && (
                                <div className="error">
                                  {stakevalidationerr.FourthDurationAPY}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Minimum Staking
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="Number"
                              min={0}
                              name="minimumStaking"
                              value={stakingdata.minimumStaking}
                              onChange={handlestakeChange}
                              placeholder="Minimum Staking"
                              className="form-control"
                            />
                            <div className="help-block">
                              {stakevalidationerr.minimumStaking && (
                                <div className="error">
                                  {stakevalidationerr.minimumStaking}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Maximum Staking
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="Number"
                              min={0}
                              name="maximumStaking"
                              value={stakingdata.maximumStaking}
                              onChange={handlestakeChange}
                              placeholder="Maximum Staking"
                              className="form-control"
                            />
                            <div className="help-block">
                              {stakevalidationerr.maximumStaking && (
                                <div className="error">
                                  {stakevalidationerr.maximumStaking}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Status
                          </label>
                          <div className="col-lg-6">
                            <div className="radio">
                              <div>
                                <input
                                  type="radio"
                                  name="status"
                                  value="Active"
                                  onChange={handlestakeChange}
                                  checked={stakingdata.status === "Active"}
                                />{" "}
                                Active
                              </div>
                              <div>
                                <input
                                  type="radio"
                                  name="status"
                                  value="Deactive"
                                  onChange={handlestakeChange}
                                  checked={stakingdata.status === "Deactive"}
                                />{" "}
                                Deactive
                              </div>
                            </div>
                            <div className="help-block">
                              {stakevalidationerr.status && (
                                <div className="error">
                                  {stakevalidationerr.status}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </form>

                      <div className="form-group row justify-content-center">
                        <div className="col-lg-4">
                          {buttonLoaderStake == false ? (
                            <button
                            type="submit"
                            className="d-block w_100"
                            onClick={(e) => handlestakeSubmit(e, "Fixed")}
                            >
                            Submit
                            </button>
                          ):(
                            <button
                            type="submit"
                            className="d-block w_100"
                          >
                            Loading ...
                          </button>
                          )}
                         
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="currencyinput mt-5">
                      <form>
                        {/* Currency Name */}
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Currency Name
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              name="currencyName"
                              value={stakingdata.currencyName}
                              onChange={handleflexstakeChange}
                              placeholder="Currency Name"
                              className="form-control"
                            />

                            <div className="help-block">
                              {flexstakevalidation.currencyName && (
                                <div className="error">
                                  {flexstakevalidation.currencyName}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Currency Symbol */}
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Currency Symbol
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              name="currencySymbol"
                              value={stakingdata.currencySymbol}
                              onChange={handleflexstakeChange}
                              placeholder="Currency Symbol"
                              className="form-control"
                            />
                            <div className="help-block">
                              {flexstakevalidation.currencySymbol && (
                                <div className="error">
                                  {flexstakevalidation.currencySymbol}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Duration First */}
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            APR Interest
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="Number"
                              min={0}
                              name="APRinterest"
                              value={stakingdata.APRinterest}
                              onChange={handleflexstakeChange}
                              placeholder="APR Interest"
                              className="form-control"
                            />
                            <div className="help-block">
                              {flexstakevalidation.APRinterest && (
                                <div className="error">
                                  {flexstakevalidation.APRinterest}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Maximum Staking
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="Number"
                              min={0}
                              name="maximumStakingflex"
                              value={stakingdata.maximumStakingflex}
                              onChange={handleflexstakeChange}
                              placeholder="Minimum Staking"
                              className="form-control"
                            />
                            <div className="help-block">
                              {flexstakevalidation.maximumStakingflex && (
                                <div className="error">
                                  {flexstakevalidation.maximumStakingflex}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Minimum Staking
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="Number"
                              name="minimumStakingflex"
                              value={stakingdata.minimumStakingflex}
                              onChange={handleflexstakeChange}
                              placeholder="Maximum Staking"
                              className="form-control"
                            />
                            <div className="help-block">
                              {flexstakevalidation.minimumStakingflex && (
                                <div className="error">
                                  {flexstakevalidation.minimumStakingflex}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Status
                          </label>
                          <div className="col-lg-6">
                            <div className="radio">
                              <div>
                                <input
                                  type="radio"
                                  name="statusflex"
                                  value="Active"
                                  onChange={handleflexstakeChange}
                                  checked={stakingdata.statusflex === "Active"}
                                />{" "}
                                Active
                              </div>
                              <div>
                                <input
                                  type="radio"
                                  name="statusflex"
                                  value="Deactive"
                                  onChange={handleflexstakeChange}
                                  checked={stakingdata.statusflex === "Deactive"}
                                />{" "}
                                Deactive
                              </div>
                            </div>
                            <div className="help-block">
                              {flexstakevalidation.statusflex && (
                                <div className="error">
                                  {flexstakevalidation.statusflex}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Buttons */}
                      </form>

                      <div className="form-group row justify-content-center">
                        <div className="col-lg-4">
                          {buttonLoaderStake == false ? (
                            <button
                            type="submit"
                            className="d-block w_100"
                            onClick={(e) => handlestakeSubmit(e, "Flexible")}
                          >
                            Submit
                          </button>
                          ) : (
                          <button
                            type="submit"
                            className="d-block w_100"
                          >
                            Loading ...
                          </button>
                          )}
                          
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export default Dashboard;
