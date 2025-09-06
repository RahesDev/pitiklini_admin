import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Sidebar_2 from "./Nav_bar";
import Moment from "moment";
import ReactPaginate from "react-paginate";
import { getMethod, postMethod } from "../core/service/common.api";
import useState from "react-usestateref";
import apiService from "../core/service/detail";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { socket } from "../context/socket";


function P2Pdispute() {
  const [Nextstep, setNextstep] = useState(false);
  const [Chaton, setChaton] = useState(false);

  const [loader, setLoader] = useState(false);

  const [Usersdata, setUsersdata, Usersdataref] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [userDispute, setuserDispute, userDisputeref] = useState("");
  const [userDisputeOrder, setuserDisputeOrder, userDisputeOrderref] =
    useState("");
  const [buttonLoaderApprove, setButtonLoaderApprove] = useState(false);
  const [buttonLoaderReject, setButtonLoaderReject] = useState(false);
  const [loaderReject, setLoaderReject] = useState(false);
  const [chatdata, setchatdata, chatdataref] = useState("");

  const [p2pconfirmOrder, setp2pconfirmOrder, p2pconfirmOrderref] =
    useState("");

  useEffect(() => {
    getUserDetails(currentPage, filterKeyword);
  }, [currentPage, filterKeyword]);


  useEffect(() => {

    let socket_token = sessionStorage.getItem("socket_token");

    let socketsplit = socket_token?.split(`_`);

    console.log(socketsplit);
    socket.connect();


    socket.off("socketResponse");
    socket.on("socketResponse" + socketsplit[0], function (res) {
      console.log("socketResponse ressss-->>", res);
      if (res.Reason == "p2pchat") {

        if (userDisputeref.current._id) {
          getallchat(userDisputeref.current._id);

        }
      }
    });

    socket.emit("socketResponse");


  }, [0]);


  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);


  const getUserDetails = async (page = 1, keyword = "") => {
    var datas = {
      apiUrl: apiService.getP2Pdispute,
      payload: { page, limit: 5, filterKeyword: keyword },
    };
    var response = await postMethod(datas);
    if (response.status) {
      setUsersdata(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } else {
      setUsersdata([]);
    }
  };

  const handleFilterChange = (e) => {
    setFilterKeyword(e.target.value);
    setCurrentPage(1);
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  };

  const getdisputeDetail = async (userId) => {
    // console.log("yeah it comes -----id", userId);
    try {
      const data = {
        apiUrl: apiService.getdisputedetail,
        payload: { _id: userId },
      };
      setLoader(true);
      var response = await postMethod(data);
      // console.log(response, "---response---dispute---");
      setLoader(false);
      if (response.status) {
        setuserDispute(response.data.disputeDetails);
        setuserDisputeOrder(response.data.orderDetails);
        setp2pconfirmOrder(response.data.p2porderRecord);
        setNextstep(true); // Refresh user data after status change
      } else {
        toast.error("Something Went Wrong. Please Try Again later");
      }
    } catch (error) {
      toast.error("Error updating status. Please try again later.");
    }
  };

  const getallchat = async (userId) => {
    try {
      const data = {
        apiUrl: apiService.getdisputechat,
        payload: { p2porderId: userId },
      };
      setLoader(true);
      var response = await postMethod(data);

      if (response) {
        setchatdata(response.message);
        setChaton(true); // Refresh user data after status change
      }
      setLoader(false);
    } catch (error) {
      toast.error("Error updating status. Please try again later.");
    }
  };

  const activeStatus = async (value, secondvalue) => {
    try {
      const data = {
        apiUrl: apiService.changeActivedispute,
        payload: { userId1: value, userId2: secondvalue },
      };
      setButtonLoaderApprove(true);
      const response = await postMethod(data);
      setButtonLoaderApprove(false);
      if (response.status) {
        toast.success(response.message);
        setNextstep(false);
        getUserDetails(currentPage);
      } else {
        setNextstep(false);
      }
    } catch (error) { }
  };

  const freezeStatus = async (value, secondvalue) => {
    // console.log(value, "------_id------", secondvalue);
    try {
      const data = {
        apiUrl: apiService.changefreezedispute,
        payload: { userId1: value, userId2: secondvalue },
      };
      setButtonLoaderReject(true);
      const response = await postMethod(data);
      setButtonLoaderReject(false);
      if (response.status) {
        toast.success(response.message);
        setNextstep(false);
        getUserDetails(currentPage);
      } else {
        // toast.error("Something Went Wrong. Please Try Again later");
        setNextstep(false);
      }
    } catch (error) { }
  };

  const cancelOrder = async (value) => {
    // console.log(value, "------_id------", secondvalue);
    try {
      const data = {
        apiUrl: apiService.cancel_p2pOrder,
        payload: { orderId: value },
      };
      setLoaderReject(true);
      const response = await postMethod(data);
      setLoaderReject(false);
      if (response.status) {
        toast.success(response.message);
        setNextstep(false);
        getUserDetails(currentPage);
      } else {
        // toast.error("Something Went Wrong. Please Try Again later");
        setNextstep(false);
      }
    } catch (error) { }
  };

  const confirmOrder = async (value) => {
    // console.log(value, "------_id------", secondvalue);
    try {
      const data = {
        apiUrl: apiService.confirm_p2pOrder,
        payload: { orderId: value },
      };
      setButtonLoaderReject(true);
      const response = await postMethod(data);
      setButtonLoaderReject(false);
      if (response.status) {
        toast.success(response.message);
        setNextstep(false);
        getUserDetails(currentPage);
      } else {
        // toast.error("Something Went Wrong. Please Try Again later");
        setNextstep(false);
      }
    } catch (error) { }
  };

  const initialFormValue = {
    message: "",
    file: "",
  };
  const [chatloading, setchatloading] = useState(false);
  const [formValue, setFormValue, formValueref] = useState(initialFormValue);
  const { message, file } = formValue;

  const initialFormValue1 = {
    message1: "",
    file1: "",
  };
  const [formValue1, setFormValue1, formValue1ref] = useState(initialFormValue1);
  const { message1, file1 } = formValue1;


  const handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const santisedValue = value.replace(/^\s+/, "");
    let formData = { ...formValue, ...{ [name]: santisedValue } };
    setFormValue(formData);
  };

  const handleChange1 = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const santisedValue = value.replace(/^\s+/, "");
    let formData = { ...formValue1, ...{ [name]: santisedValue } };
    setFormValue1(formData);
  };

  const UploadImage = (type, val) => {
    setLoader(true);
    const fileExtension = val.name.split(".").at(-1);
    const fileSize = val.size;
    if (
      fileExtension != "png" &&
      fileExtension != "jpg" &&
      fileExtension != "jpeg" &&
      fileExtension != "pdf" &&
      fileExtension != "doc" &&
      fileExtension != "docx"
    ) {
      setLoader(false);
      showerrorToast(
        "File does not support. You must use .png, .jpg,  .jpeg,  .pdf,  .doc,  .docx "
      );
      return false;
    } else if (fileSize > 10000000) {
      setLoader(false);

      showerrorToast("Please upload a file smaller than 1 MB");
      return false;
    } else {
      const data = new FormData();
      data.append("file", val);
      data.append("upload_preset", "sztbiwly");
      data.append("cloud_name", "taikonz-com");
      console.log("formdata===", data);
      fetch("  https://api.cloudinary.com/v1_1/taikonz-com/auto/upload", {
        method: "post",
        body: data,
      })
        .then((resp) => resp.json())
        .then(async (data) => {


          // console.log(type);

          if (type == "from") {
            await submitChat(data.secure_url);
          } else {
            await submitChat1(data.secure_url);
          }
          setLoader(false);

        })
        .catch((err) => {
          setLoader(false);

          console.log(err);
        });
    }
  };




  const submitChat = async (file) => {


    try {
      if (formValue.message != "" || file != "") {
        setLoader(true);


        var obj = {
          "message": formValue.message,
          "file": file,
          "type": "admin",
          "orderId": userDisputeref.current.orderId,
          "p2porderId": p2pconfirmOrderref.current._id,
          "toUserId": chatdataref.current.from_user._id
        }

        var data = {
          apiUrl: apiService.p2pchat,
          payload: obj,
        };
        setchatloading(true);
        var resp = await postMethod(data);
        setLoader(false);

        if (resp.status) {
          setchatloading(false);
          getallchat(userDisputeref.current._id);
          setFormValue(initialFormValue);
        } else {
          showerrorToast(resp.Message);
        }
      } else {
        showerrorToast("Please enter message or attach file");
      }
    } catch (error) { }
  };



  const submitChat1 = async (file) => {

    try {
      if (formValue1.message1 != "" || file != "") {
        setLoader(true);


        var obj = {
          "message": formValue1.message1,
          "file": file,
          "type": "admin",
          "orderId": userDisputeref.current.orderId,
          "p2porderId": p2pconfirmOrderref.current._id,
          "toUserId": chatdataref.current.to_user._id
        }

        var data = {
          apiUrl: apiService.p2pchat,
          payload: obj,
        };
        setchatloading(true);
        var resp = await postMethod(data);
        setLoader(false);

        if (resp.status) {
          setchatloading(false);
          getallchat(userDisputeref.current._id);
          setFormValue1(initialFormValue1);
        } else {
          showerrorToast(resp.Message);
        }
      } else {
        showerrorToast("Please enter message or attach file");
      }
    } catch (error) { }
  };


  const Updatedispute = async () => {
    // setSiteLoader(true);

    console.log(p2pconfirmOrderref.current.orderId);

    const payload = {
      orderId: p2pconfirmOrderref.current.orderId,
      status: "resolved",
      userId: userDisputeref.current.userId,
    };

    const data = {
      apiUrl: apiService.updatedispute,
      payload,
    };

    try {
      const resp = await postMethod(data);
      // setSiteLoader(false);

      if (resp.status === true) {
        showsuccessToast(resp.Message);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error fetching dispute:", error);
      // setSiteLoader(false);
    }
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
                      <span className="dash-head">P2P Disputes</span>
                      <div>
                        <input
                          className="filters"
                          placeholder="Enter OrderId to filter"
                          value={filterKeyword}
                          onChange={handleFilterChange}
                        />
                      </div>
                    </div>
                    <div class="table-responsive my-5  trans-table ">
                      <table className="w_100">
                        <thead className="trans-head">
                          <tr>
                            <th>S.No</th>
                            <th>Username</th>
                            <th>OrderId</th>
                            <th>Type</th>
                            <th>Query</th>
                            <th>Details</th>
                            <th>Status</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Usersdataref.current.length > 0 ? (
                            Usersdataref.current.map((item, i) => (
                              <tr key={item._id}>
                                <td>
                                  <span className="plus_14_ff">{i + 1}</span>
                                </td>
                                <td>
                                  <span className="plus_14_ff">
                                    {item.username}
                                  </span>
                                </td>
                                <td>
                                  <span className="plus_14_ff">
                                    {item.orderId}
                                  </span>
                                </td>
                                <td>
                                  <span className="plus_14_ff">
                                    {item.type}
                                  </span>
                                </td>
                                <td>
                                  <label className="plus_14_ff width_scroll">
                                    {item.query}
                                  </label>
                                </td>
                                <td>
                                  <label className="plus_14_ff">
                                    view
                                    <i
                                      class="fa-regular fa-pen-to-square ml-2 cursor-pointer"
                                      onClick={() => getdisputeDetail(item._id)}
                                    ></i>
                                  </label>
                                </td>
                                <td>
                                  <span className="plus_14_ff">
                                    {item.status}
                                  </span>
                                </td>
                                <td>
                                  <span className="plus_14_ff">
                                    {Moment(item.createdAt).format("lll")}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7}>
                                <div className="empty_data my-4">
                                  <div className="plus_14_ff">
                                    No Records Found
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                          {Usersdataref.current.length > 0 ? (
                            <tr className="text-center">
                              <td colSpan="7">
                                <div className="paginationcss">
                                  <ReactPaginate
                                    previousLabel={"<"}
                                    nextLabel={">"}
                                    breakLabel={"..."}
                                    pageCount={totalPages}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={handlePageClick}
                                    containerClassName={
                                      "pagination pagination-md justify-content-center "
                                    }
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
              ) : Chaton ? (
                <>
                  <div className="px-4 transaction_padding_top">
                    <div className="px-2 my-4 transaction_padding_top tops">
                      <div className="headerss">
                        <span className="dash-head">Dispute chat</span>
                        <button onClick={() => setChaton(false)}>Back</button>
                      </div>
                      <div className="row ">
                        <div className="my-5 p-3 col-lg-6">
                          <div className="currencyinput1">
                            <div className="chat-header">
                              <img
                                src={require("../images/profile_icon.png")}
                                alt="logo image"
                                width="50px"
                              />
                              <h5>
                                {chatdataref.current.from_user.displayname}
                              </h5>
                            </div>
                            <div className="chat-body">
                              {chatdataref.current.from_chat != null
                                ? chatdataref.current.from_chat &&
                                chatdataref.current.from_chat.map(
                                  (chat, i) => {
                                    return chat.type == "admin" &&
                                      chat.default == 0 ? (
                                      <div className="char_recive w-100 d-flex justify-content-end">
                                        <div className=" char_send">
                                          <div className="chat_conent p_new_end">
                                            <p className="">
                                              you {"  "}
                                              {Moment(chat.createdAt).format(
                                                "LT"
                                              )}
                                            </p>

                                            {chat.admin_msg != "" &&
                                              chat.admin_msg != undefined ? (
                                              <div className="j-img-content-two">
                                                {chat.admin_msg}
                                              </div>
                                            ) : chat.user_msg != "" &&
                                              chat.user_msg != undefined ? (
                                              <div className="j-img-content-two">
                                                {chat.user_msg}
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                            {chat.admin_file != "" &&
                                              chat.admin_file != undefined ? (
                                              <img
                                                src={chat.admin_file}
                                                width="250px"
                                                className=""
                                              />
                                            ) : chat.user_file != "" &&
                                              chat.user_file != undefined ? (
                                              <img
                                                src={chat.user_file}
                                                width="250px"
                                                className=""
                                              />
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ) : chat.type != "admin" ? (
                                      <div className="char_recive">
                                        <div className="chat_conent">
                                          <p>
                                            {/* <span>{chat.adv_name}</span>{" "} */}
                                            {Moment(chat.createdAt).format(
                                              "LT"
                                            )}
                                          </p>

                                          {chat.user_msg != "" &&
                                            chat.user_msg != undefined ? (
                                            <div className="j-img-content-two">
                                              {chat.user_msg}
                                            </div>
                                          ) : chat.admin_msg != "" &&
                                            chat.admin_msg != undefined ? (
                                            <div className="j-img-content-two">
                                              {chat.admin_msg}
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                          {chat.user_file != "" &&
                                            chat.user_file != undefined ? (
                                            <img
                                              src={chat.user_file}
                                              className=""
                                              width="250px"
                                            />
                                          ) : chat.admin_file != "" &&
                                            chat.admin_file != undefined ? (
                                            <img
                                              src={chat.admin_file}
                                              width="250px"
                                              className=""
                                            />
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      ""
                                    );
                                  }
                                )
                                : ""}
                            </div>
                            <div className="chat-footer">
                              <div class="start-wrapper">
                                <input
                                  type="text"
                                  placeholder="Start chat here"
                                  value={message}
                                  name="message"
                                  onChange={handleChange}
                                  className="start-input"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      submitChat();
                                    }
                                  }}
                                />
                                <>
                                  <div className="start-icon1" onClick={() => document.getElementById("fileInput").click()}>
                                    <img src={require("../images/Attach.png")} alt="Attach" style={{ cursor: "pointer" }} />
                                  </div>

                                  <input
                                    type="file"
                                    id="fileInput"
                                    accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                      console.log("111");

                                      const file = e.target.files[0];
                                      if (file) {
                                        UploadImage("from", file);
                                      }
                                    }}
                                  />
                                  <div class="start-icon">
                                    {" "}
                                    <img
                                      src={require("../images/start-arrow.png")}
                                      alt=""
                                      onClick={
                                        () => submitChat()
                                      }
                                    />
                                  </div>
                                </>

                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="my-5 p-3 col-lg-6">
                          <div className="currencyinput1">
                            <div className="chat-header">
                              <img
                                src={require("../images/profile_icon.png")}
                                alt="logo image"
                                width="50px"
                              />
                              <h5>{chatdataref.current.to_user.displayname}</h5>
                            </div>
                            <div className="chat-body">
                              {chatdataref.current.from_chat != null
                                ? chatdataref.current.from_chat &&
                                chatdataref.current.to_chat.map((chat, i) => {
                                  return chat.type == "admin" &&
                                    chat.default == 0 ? (
                                    <div className="char_recive w-100 d-flex justify-content-end">
                                      <div className=" char_send">
                                        <div className="chat_conent p_new_end">
                                          <p className="">
                                            you {"  "}
                                            {Moment(chat.createdAt).format(
                                              "LT"
                                            )}
                                          </p>

                                          {chat.admin_msg != "" &&
                                            chat.admin_msg != undefined ? (
                                            <div className="j-img-content-two">
                                              {chat.admin_msg}
                                            </div>
                                          ) : chat.user_msg != "" &&
                                            chat.user_msg != undefined ? (
                                            <div className="j-img-content-two">
                                              {chat.user_msg}
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                          {chat.admin_file != "" &&
                                            chat.admin_file != undefined ? (
                                            <img
                                              src={chat.admin_file}
                                              width="250px"
                                              className=""
                                            />
                                          ) : chat.user_file != "" &&
                                            chat.user_file != undefined ? (
                                            <img
                                              src={chat.user_file}
                                              width="250px"
                                              className=""
                                            />
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ) : chat.type != "admin" ? (
                                    <div className="char_recive">
                                      <div className="chat_conent">
                                        <p>
                                          {/* <span>{chat.admin_name}</span>{" "} */}
                                          {Moment(chat.createdAt).format(
                                            "LT"
                                          )}
                                        </p>

                                        {chat.user_msg != "" &&
                                          chat.user_msg != undefined ? (
                                          <div className="j-img-content-two">
                                            {chat.user_msg}
                                          </div>
                                        ) : chat.admin_msg != "" &&
                                          chat.admin_msg != undefined ? (
                                          <div className="j-img-content-two">
                                            {chat.admin_msg}
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                        {chat.user_file != "" &&
                                          chat.user_file != undefined ? (
                                          <img
                                            src={chat.user_file}
                                            className=""
                                            width="250px"
                                          />
                                        ) : chat.admin_file != "" &&
                                          chat.admin_file != undefined ? (
                                          <img
                                            src={chat.admin_file}
                                            width="250px"
                                            className=""
                                          />
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  );
                                })
                                : ""}
                            </div>
                            <div className="chat-footer">
                              <div class="start-wrapper">
                                <input
                                  type="text"
                                  placeholder="Start chat here"
                                  value={message1}
                                  name="message1"
                                  onChange={handleChange1}
                                  className="start-input"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      submitChat1();
                                    }
                                  }}
                                />
                                <>
                                  <div className="start-icon1" onClick={() => document.getElementById("fileInput1").click()}>
                                    <img src={require("../images/Attach.png")} alt="Attach" style={{ cursor: "pointer" }} />
                                  </div>

                                  <input
                                    type="file"
                                    id="fileInput1"
                                    accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                      console.log("2222");
                                      const file = e.target.files[0];
                                      if (file) {
                                        UploadImage("to", file);
                                      }
                                    }}
                                  />
                                  <div class="start-icon">
                                    {" "}
                                    <img
                                      src={require("../images/start-arrow.png")}
                                      alt=""
                                      onClick={
                                        () => submitChat1()
                                      }
                                    />
                                  </div>
                                </>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="px-4 transaction_padding_top">
                  <div className="px-2 my-4 transaction_padding_top tops">
                    <div className="headerss">
                      <span className="dash-head">Dispute Details</span>
                      <button onClick={() => setNextstep(false)}>Back</button>
                    </div>
                    <div className="my-5 p-3">
                      <div className="currencyinput">
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Dispute Email
                          </label>
                          <div className="col-lg-6 text-center">
                            <span className="col-form-label form-control-label">
                              {userDisputeOrderref.current.email}
                            </span>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Dispute OrderId
                          </label>
                          <div className="col-lg-6 text-center">
                            <span className="col-form-label form-control-label">
                              {userDisputeOrderref.current.orderId}
                            </span>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Dispute Date
                          </label>
                          <div className="col-lg-6 text-center">
                            <span className="col-form-label form-control-label">
                              {Moment(
                                userDisputeOrderref.current.createdAt
                              ).format("lll")}
                              {/* {userDisputeOrderref.current.createdAt} */}
                            </span>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Query
                          </label>
                          <div className="col-lg-6 text-center">
                            <span className="col-form-label form-control-label">
                              {userDisputeref.current.query}
                              {/* {userDisputeOrderref.current.createdAt} */}
                            </span>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Status
                          </label>
                          <div className="col-lg-6 text-center">
                            <span className="col-form-label form-control-label">
                              {userDisputeref.current.status}
                              {/* {userDisputeOrderref.current.createdAt} */}
                            </span>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-lg-6 col-form-label form-control-label">
                            Attachment
                          </label>
                          {userDisputeref.current.attachment == "" ? (
                            <div className="col-lg-6 text-center">
                              <span className="col-form-label form-control-label">
                                No Attachments
                                {/* {userDisputeOrderref.current.createdAt} */}
                              </span>
                            </div>
                          ) : (
                            <div className="col-lg-6 text-center">
                              <img
                                src={userDisputeref.current.attachment}
                                className="imagebox"
                                width="100%"
                              />
                              <Link
                                to={userDisputeref.current.attachment}
                                className="kycbtn"
                                target="_blank"
                              >
                                View
                              </Link>
                            </div>
                          )}
                        </div>

                        {userDisputeref.current.status == "not_resolved" ? (
                          <div className="row justify-content-center">
                            <div className="col-lg-4 Approve">
                              {buttonLoaderApprove == false ? (
                                <button
                                  onClick={() =>
                                    activeStatus(
                                      userDisputeref.current.userId,
                                      userDisputeOrderref.current.userId
                                    )
                                  }
                                >
                                  Activate User Accounts
                                </button>
                              ) : (
                                <button> Loading ...</button>
                              )}
                              {p2pconfirmOrderref.current.status != 0 &&
                                p2pconfirmOrderref.current.status != 3 ? (
                                buttonLoaderApprove == false ? (
                                  <button
                                    onClick={() =>
                                      confirmOrder(
                                        p2pconfirmOrderref.current.orderId
                                      )
                                    }
                                  >
                                    Release Crypto
                                  </button>
                                ) : (
                                  <button> Loading ...</button>
                                )
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="col-lg-3 reject">
                              {p2pconfirmOrderref.current.status != 3 ? (
                                loaderReject == false ? (
                                  <button
                                    onClick={() =>
                                      cancelOrder(
                                        p2pconfirmOrderref.current.orderId
                                      )
                                    }
                                  >
                                    Cancel Order
                                  </button>
                                ) : (
                                  <button> Loading ...</button>
                                )
                              ) : (
                                ""
                              )}

                              {buttonLoaderReject == false ? (
                                <button
                                  onClick={() =>
                                    getallchat(userDisputeref.current._id)
                                  }
                                >
                                  Chat
                                </button>
                              ) : (
                                <button> Loading ...</button>
                              )}
                            </div>
                            <div className="col-lg-3 reject">
                              {buttonLoaderReject == false ? (
                                <button
                                  onClick={() =>
                                    freezeStatus(
                                      userDisputeref.current.userId,
                                      userDisputeOrderref.current.userId
                                    )
                                  }
                                >
                                  Freeze User Accounts
                                </button>
                              ) : (
                                <button> Loading ...</button>
                              )}

                              {buttonLoaderApprove == false ? (
                                <button
                                  onClick={() =>
                                    Updatedispute()
                                  }
                                >
                                  Issues Resolved
                                </button>
                              ) : (
                                <button> Loading ...</button>
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
}

export default P2Pdispute;
