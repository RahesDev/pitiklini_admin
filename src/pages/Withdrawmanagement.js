import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Sidebar_2 from "./Nav_bar";
import Moment from "moment";
import ReactPaginate from "react-paginate";
import { postMethod } from "../core/service/common.api";
import useState from "react-usestateref";
import apiService from "../core/service/detail";
import toast from "react-hot-toast";

function Dashboard() {

  const [add, setadd] = useState(false);
  const [Usersdata, setUsersdata, Usersdataref] = useState([]);
  const [selected, setselected, selectedref] = useState({});
  const [filterKeyword, setFilterKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 5; // Define how many items per page
  const [buttonLoaderReject,setButtonLoaderReject] = useState(false);
  const [buttonLoaderApprove,setButtonLoaderApprove] = useState(false);

  useEffect(() => {
    getUserDetails(currentPage);
  }, [currentPage,filterKeyword]);

  const getUserDetails = async (page) => {
    var datas = {
      apiUrl: apiService.get_all_user_withdraw,
      payload: {
        currentPage: page,
        pageSize: pageSize,
        filterKeyword: filterKeyword
      }
    };
    var response = await postMethod(datas);
    if (response.status) {
      setUsersdata(response.data);
      setPageCount(response.totalPages);
      setCurrentPage(response.currentPage)
    } else {
      setUsersdata([]);
    }
  };

  const Reject = async () => {
    var obj = {
      _id: selectedref.current._id,
      currency: selectedref.current.currency_symbol,
      amount: selectedref.current.receiveamount,
      reason: "invalid transaction",
      uname: selectedref.current.user_name,
      email: selectedref.current.email,
      status: 'cancel',
    }

    var datas = {
      apiUrl: apiService.admin_withdraw_approve,
      payload: obj
    }
    setButtonLoaderReject(true);
    var response = await postMethod(datas);
    setButtonLoaderReject(false);
    if (response.status) {
      toast.success(response.message);
      getUserDetails(1);
      setadd(false);
    } else {
      toast.error(response.message);
      getUserDetails(1);
      setadd(false);
    }
  };

  const Approvewithdraw = async () => {
    var obj = {
      _id: selectedref.current._id,
      currency: selectedref.current.currency_symbol,
      amount: selectedref.current.receiveamount,
      uname: selectedref.current.user_name,
      email: selectedref.current.email,
      status: 'confirm',
    }

    var datas = {
      apiUrl: apiService.admin_withdraw_approve,
      payload: obj
    }
    setButtonLoaderApprove(true);
    var response = await postMethod(datas);
    setButtonLoaderApprove(false);
    if (response.status) {
      toast.success(response.message);
      getUserDetails(1);
      setadd(false);
    } else {
      toast.error(response.message);
      getUserDetails(1);
      setadd(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilterKeyword(e.target.value);
  };

  const filteredUsers = Usersdata.filter((user) =>
    user.user_name.toLowerCase().includes(filterKeyword.toLowerCase())
  );

  const edit = async (data) => {
    setselected(data);
    setadd(true);
  };

  const handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/\s/g, "");
    let formData = { ...selectedref.current, ...{ [name]: sanitizedValue } };
    setselected(formData);
  };

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage + 1);
    // getUserDetails(selectedPage + 1);

  };

  return (
    <div>
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
              <div className="px-2 my-4 transaction_padding_top tops">
                <div className="headerss">
                  <span className="dash-head">Crypto Withdraw History</span>
                  <div>
                    {add === false ? (
                      <input className="filters"  
                        placeholder="Enter Username to filter"
                        value={filterKeyword}
                        onChange={handleFilterChange} />
                    ) : (
                      <button onClick={() => setadd(false)}>Back</button>
                    )}
                  </div>
                </div>
                {add === false ? (
                  <div className="table-responsive my-5 trans-table">
                    <table className="w_100">
                      <thead className="trans-head">
                        <tr>
                          <th>S.No</th>
                          <th>Username</th>
                          <th>Currency</th>
                          <th>Amount</th>
                          <th>Transfer Amount</th>
                          <th>Fees</th>
                          <th>Pending</th>
                          <th>Date</th>
                          {/* <th>Action</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((item, i) => (
                            <tr key={item._id}>
                              <td><span className="plus_14_ff">{i + 1}</span></td>
                              <td><span className="plus_14_ff">{item.user_name}</span></td>
                              <td><span className="plus_14_ff">{item.currency_symbol}</span></td>
                              <td><span className="plus_14_ff">{item.amount}</span></td>
                              <td><label className="plus_14_ff">{item.receiveamount}</label></td>
                              <td><label className="plus_14_ff">{item.fees}</label></td>
                              <td><label className="plus_14_ff">{item.status == 1 ? "Pending" : item.status == 2 ? "Completed" : "Cancelled"}</label></td>
                              <td><span className="plus_14_ff">{Moment(item.created_at).format("lll")}</span></td>
                              {/* <td><span className="plus_14_ff"><i className="fa-regular fa-pen-to-square cursor-pointer" onClick={() => edit(item)}></i></span></td> */}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={9}>
                              <div className="empty_data my-4">
                                <div className="plus_14_ff">No Records Found</div>
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
                      pageCount={pageCount}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
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
                  <div className="row justify-content-center mt-5">
                    <div className="currencyinput col-lg-9">
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">User Name</label>
                        <div className="col-lg-6">
                          <input className="form-control" disabled type="text" value={selectedref.current.user_name} placeholder="Currency Name" required />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">Currency</label>
                        <div className="col-lg-6">
                          <input type="text" placeholder="Currency Symbol" value={selectedref.current.currency_symbol} disabled className="form-control" required />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">Withdraw Amount</label>
                        <div className="col-lg-6">
                          <input type="text" placeholder="Contract Address" disabled className="form-control" value={selectedref.current.amount} />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">Receive Amount</label>
                        <div className="col-lg-6">
                          <input type="text" value={selectedref.current.receiveamount} disabled placeholder="Currency Decimal" className="form-control" />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">Fees</label>
                        <div className="col-lg-6">
                          <input type="text" value={selectedref.current.fees} disabled placeholder="Contract Address" className="form-control" />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">To Address</label>
                        <div className="col-lg-6">
                          <input type="text" value={selectedref.current.withdraw_address} disabled placeholder="Currency Decimal" className="form-control" />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">Transaction Id</label>
                        <div className="col-lg-6">
                          <input type="text" disabled className="form-control" value={selectedref.current.txn_id} />
                        </div>
                      </div>
                      <div className="form-group row justify-content-around mt-4">
                        <label className="col-lg-4 d-flex align-items-center w_100">
                          {buttonLoaderReject == false ? (
                          <button className="btn btn-primary btn-lg float-right w_100" onClick={() => Reject()}>Reject</button>
                          ) : (
                            <button className="btn btn-primary btn-lg float-right w_100">Loading ...</button>
                          )}
                        </label>
                        <div className="col-lg-4 d-flex align-items-center">
                          {buttonLoaderApprove == false ? (
                          <button className="btn btn-lg btn-primary float-left w_100" onClick={() => Approvewithdraw()} >Approve</button>
                          ) : (
                            <button className="btn btn-lg btn-primary float-left w_100">Loading ...</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
