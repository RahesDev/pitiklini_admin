import React, { useEffect } from "react";
import useState from "react-usestateref";
import Sidebar from "./Sidebar";
import Sidebar_2 from "./Nav_bar";
import * as Yup from 'yup';
import ReactPaginate from "react-paginate";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import Modal from "@mui/joy/Modal";
import Moment from "moment";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ModalClose from "@mui/joy/ModalClose";

import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState('');

  const [ModalOpen, setModalOpen] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [userKYC, setuserKYC, userKYCref] = useState("");
  const [Nextstep, setNextstep] = useState(false); // Default to p2p_wallet

  const [loader,setLoader] = useState(false);
  const [buttonLoaderApprove,setButtonLoaderApprove] = useState(false);
  const [buttonLoaderReject,setButtonLoaderReject] = useState(false);


  useEffect(() => {
    getUserDetails(currentPage,filterKeyword);
  }, [currentPage, filterKeyword]);

  const getUserDetails = async (page = 1,filterKeyword = "") => {
    const data = {
      apiUrl: apiService.activatedUserList,
      payload: { page, limit: 5, keyword: filterKeyword }, // Include the keyword here
    };
    const response = await postMethod(data);
    // console.log(response, "=-=-=-=response=-=-=");
    if (response.status) {
      setTotalPages(response.totalPages);
      setFilteredUsers(response.data); // No need to filter here, since we're now getting all users with the keyword
    } else {
      setFilteredUsers([]);
    }
  };
  const handleStatusChange = async (userId, currentStatus) => {
    try {
      // const newStatus = currentStatus === 0 ? 1 : 0;
      const data = {
        apiUrl: apiService.changeUserAccountStatus,
        payload: { _id: userId, status: currentStatus },
      };

      const response = await postMethod(data);

      if (response.status) {
        toast.success('User Account Status Updated Successfully');
        getUserDetails(currentPage);
        // Refresh user data after status change
      } else {
        toast.error('Something Went Wrong. Please Try Again later');
      }
    } catch (error) {
      toast.error('Error updating status. Please try again later.');
    }
  };

  const kycAprove = async (userId, _id) => {
    try {
      const data = {
        apiUrl: apiService.kycAprove,
        payload: { userId: userId, _id: _id },
      };
      setButtonLoaderApprove(true);
      const response = await postMethod(data);
      setButtonLoaderApprove(false);
      if (response.status) {
        toast.success(response.Message);
        setNextstep(false);
        getUserDetails(currentPage); // Refresh user data after status change

      } else {
        toast.error('Something Went Wrong. Please Try Again later');
        setNextstep(false);
      }
    } catch (error) {
      toast.error('Error updating status. Please try again later.');
    }
  };

  const kycRejectSchema = Yup.object().shape({
    reason: Yup.string()
      .min(5, 'Reason must be at least 5 characters long')
      .max(250, 'Reason must be at most 250 characters long')
      .required('Reason is required'),
  });

  const kycReject = async (userId, _id) => {
    try {
      const reason = document.querySelector('input[name="reason"]').value;

      // Validate the input using the Yup schema
      await kycRejectSchema.validate({ reason });

      const data = {
        apiUrl: apiService.kycReject,
        payload: { userId: userId, _id: _id, reason: reason },
      };
      setButtonLoaderReject(true);
      const response = await postMethod(data);
      setButtonLoaderReject(false);
      if (response.status) {
        toast.success(response.Message);
        setNextstep(false);
        setIsModalOpen(false);
        getUserDetails(currentPage); // Refresh user data after status change
      } else {
        toast.error('Something Went Wrong. Please Try Again later');
        setNextstep(false);
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        toast.error(error.message);
      } else {
        toast.error('Error updating status. Please try again later.');
      }
    }
  };

  const getuserKYC = async (userId) => {

    // console.log(
    //   "hdcknckndknncdkeacsk"
    // )
    try {
      // const newStatus = currentStatus === 0 ? 1 : 0;
      const data = {
        apiUrl: apiService.getKyclist,
        payload: { _id: userId },
      };
      setLoader(true);
      const response = await postMethod(data);
      setLoader(false);
      if (response.status) {
        setuserKYC(response.data);
        setNextstep(true);// Refresh user data after status change
      } else {
        toast.error('Something Went Wrong. Please Try Again later');
      }
    } catch (error) {
      toast.error('Error updating status. Please try again later.');
    }
  };



  const handleFilterChange = (e) => {
    setFilterKeyword(e.target.value);
    setCurrentPage(1);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  return (
    <div>
      {loader == true ? (
          <div className="loadercss">
          <Bars
            height="80"
            width="80"
            color="#ffc630"
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
            {Nextstep == false ? (
              <div className="px-4 transaction_padding_top">
                <div className="px-2 my-4 transaction_padding_top tops">
                  <div className="headerss">
                    <span className="dash-head">User Management</span>
                    <div>
                      <input
                        className="filters"
                        placeholder="Enter Username to filter"
                        value={filterKeyword}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </div>
                  <div className="table-responsive my-5 trans-table">
                    <table className="w_100">
                      <thead className="trans-head">
                        <tr>
                          <th>S.No</th>
                          <th>Email</th>
                          {/* <th>User ID</th> */}
                          <th>Username</th>
                          <th>Date & Time</th>
                          <th>TFA Status</th>
                          <th>Kyc Status</th>
                          <th>Disable User</th>

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
                                <span className="plus_14_ff">{item.email}</span>
                              </td>

                              {/* <td>
                              <span className="plus_14_ff">{item.internalID}</span>
                            </td> */}
                              <td>
                                <span className="plus_14_ff">{item.displayname}</span>
                              </td>
                              <td>
                                <span className="plus_14_ff">
                                  {Moment(item.datetime).format("lll")}
                                </span>
                              </td>
                              <td>
                                {item.tfa_status == 0 ? (
                                  <span className="plus_14_ff text-danger">Disabled</span>

                                ) : (
                                  <span className="plus_14_ff text-success">Enabled</span>

                                )}

                              </td>

                              <td>
                                {item.kyc_status == 0 ? (
                                  <span className="plus_14_ff ">Not Upload</span>

                                ) : (
                                  item.kyc_status == 1 ? (
                                    <span className="plus_14_ff text-success">Verified <i class="fa-regular fa-pen-to-square ml-2 cursor-pointer" onClick={() => getuserKYC(item._id)}></i> </span>

                                  ) : (item.kyc_status == 2 ? (
                                    <span className="plus_14_ff text-warning ">Pending <i class="fa-regular fa-pen-to-square ml-2 cursor-pointer" onClick={() => getuserKYC(item._id)} ></i> </span>

                                  ) : (
                                    <span className="plus_14_ff text-danger">Rejected <i class="fa-regular fa-pen-to-square ml-2 cursor-pointer" onClick={() => getuserKYC(item._id)} ></i> </span>
                                  )
                                  )
                                )}

                              </td>

                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={item.loginStatus === 1}
                                    onChange={() => handleStatusChange(item._id, item.loginStatus)}
                                  />
                                  <span className="slider round"></span>
                                </label>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8}>
                              <div className="empty_data my-4">
                                <div className="plus_14_ff">No Records Found</div>
                              </div>
                            </td>
                          </tr>
                        )}

{filteredUsers.length > 0 ? (
                        <tr className="text-center">
                        <td colSpan="8">
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
                </div>
              </div>
            ) : (
              <div className="px-4 transaction_padding_top">
                <div className="px-2 my-4 transaction_padding_top tops">
                  <div className="headerss">
                    <span className="dash-head">User KYC Details</span>

                    <button onClick={() => setNextstep(false)}>Back</button>

                  </div>
                  <div className="my-4 currencyinput">

                  <span className="new_kyc_sidehead">Step - 1 :-</span>
                  <div className="form-group row mt-3">
                        <label className="col-lg-6 col-form-label form-control-label new_ky_rah">
                          Full name : 
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            value={userKYCref.current.fullName}
                            placeholder="Full Name"
                            className="form-control"
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Date Of Birth : 
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            value={userKYCref.current.dob}
                            placeholder="DOB"
                            className="form-control"
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                        Nationality : 
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            value={userKYCref.current.nationality}
                            placeholder="Nationality"
                            className="form-control"
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                        Residential : 
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            value={userKYCref.current.residential}
                            placeholder="Residential"
                            className="form-control"
                            readOnly
                          />
                        </div>
                      </div>

                      <span className="new_kyc_sidehead my-3">Step - 2 :-</span>
                      <div className="form-group row mt-3">
                        <label className="col-lg-6 col-form-label form-control-label">
                        Proof Type : 
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            value={userKYCref.current.verfiType}
                            placeholder="Residential"
                            className="form-control"
                            readOnly
                          />
                        </div>
                      </div>

                      <span className="new_kyc_sidehead my-3">Step - 3 :-</span>
                      <div className="form-group row mt-3">
                        <label className="col-lg-6 col-form-label form-control-label">
                        {userKYCref.current.verfiType} :
                        </label>
                        <div className="col-lg-6">
                          <div className="newky_man">
                              <div className="d-flex flex-column gap-2">
                                <span className="">Front</span>
                                <img src={userKYCref.current.proof1} className="imagebox" width="100%" />
                                {userKYCref.current.kycStatus == 2 ? (
                          <Link to={userKYCref.current.proof1} className="kycbtn" target="_blank">
                            View
                          </Link>
                        ) : ""}
                              </div>  
                              <div className="d-flex flex-column gap-2">
                                <span className="">Back</span>
                                <img src={userKYCref.current.proof2} className="imagebox" width="100%" />
                                {userKYCref.current.kycStatus == 2 ? (
                          <Link to={userKYCref.current.proof2} className="kycbtn" target="_blank">
                            View
                          </Link>
                        ) : ""}
                              </div>  
                           </div> 
                        </div>
                      </div>

                      <span className="new_kyc_sidehead my-3">Step - 4 :-</span>
                      <div className="form-group row mt-3">
                        <label className="col-lg-6 col-form-label form-control-label">
                        Selfie Proof :
                        </label>
                        <div className="col-lg-6">
                          <div className="d-flex">
                              <div className="">
                                <img src={userKYCref.current.proof3} className="imagebox" width="100%" />
                                {userKYCref.current.kycStatus == 2 ? (
                          <Link to={userKYCref.current.proof3} className="kycbtn" target="_blank">
                            View
                          </Link>
                        ) : ""}
                              </div>
                           </div> 
                        </div>
                      </div>

                    {/* <div className="headerss">
                      <span className="text-white h5"> Nationality : {userKYCref.current.nationality}</span>
                      <span className="text-white h5"> Verify Type : {userKYCref.current.verfiType} </span>

                    </div> */}


                    {/* <div className="row justify-content-around">
                      <div className="col-lg-3 ">
                        <img src={userKYCref.current.proof1} className="imagebox" width="100%" />

                        {userKYCref.current.kycStatus == 2 ? (
                          <Link to={userKYCref.current.proof1} className="kycbtn" target="_blank">
                            View
                          </Link>
                        ) : ""}
                      </div>
                      <div className="col-lg-3 ">
                        <img src={userKYCref.current.proof2} className="imagebox" width="100%" />


                        {userKYCref.current.kycStatus == 2 ? (
                          <Link to={userKYCref.current.proof2} className="kycbtn" target="_blank">
                            View
                          </Link>
                        ) : ""}

                      </div>
                      <div className="col-lg-3 ">
                        <img src={userKYCref.current.proof3} className="imagebox" width="100%" />


                        {userKYCref.current.kycStatus == 2 ? (
                          <Link to={userKYCref.current.proof3} className="kycbtn" target="_blank">
                            View
                          </Link>
                        ) : ""}
                      </div>
                    </div> */}


                    {userKYCref.current.kycStatus == 2 ? (

                      <div className="row justify-content-center">
                        <div className="col-lg-4 reject"><button onClick={() => setIsModalOpen(true)} >Reject</button></div>

                        <div className="col-lg-4 Approve">
                          {buttonLoaderApprove == false ? (
                          <button onClick={() => kycAprove(userKYCref.current.userId, userKYCref.current._id)} >Approve</button>
                          ) : (
                            <button >Loading ...</button>
                          )}
                          </div>
                      </div>

                    ) : ""}

                  </div>
                </div>
              </div>
            )

            }

          </div>
        </div>


        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Sheet
            variant="outlined"
            sx={{
              minWidth: 500,
              borderRadius: "md",
              p: 3,
              boxShadow: "lg",
            }}
          >
            <ModalClose variant="plain" sx={{ m: 1 }} />
            <Typography
              component="h2"
              id="modal-title"
              level="h4"
              textColor="inherit"
              fontWeight="lg"
              mb={1}
            ></Typography>
            <Typography id="modal-desc">
              <h3 className="connect_a_connect_text">
                KYC Reject Details
              </h3>
              <div className="ycho_inner mt-4">


                <input
                  type="text"
                  name="reason"
                  className="filters w_100"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter the reason for rejection"
                  minLength="5"
                  maxLength="250"
                />


                <div className="reject w_100">
                  {buttonLoaderReject == false ? (
                  <button className="my-3" onClick={() => kycReject(userKYCref.current.userId, userKYCref.current._id)} >Reject</button>
                  ) : (
                    <button className="my-3">Loading ...</button>
                  )}
                  </div>


              </div>
            </Typography>
          </Sheet>

        </Modal>


      </div>
      )}
    </div>
  );
}

export default Dashboard;
