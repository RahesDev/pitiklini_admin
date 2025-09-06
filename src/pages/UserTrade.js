import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Sidebar_2 from "./Nav_bar";
import Moment from "moment";
import ReactPaginate from "react-paginate";
import { getMethod, postMethod } from "../core/service/common.api";
import useState from "react-usestateref";
import apiService from "../core/service/detail";

function UserTrade() {
  const [historyState, setHistoryState, historyStateref] =
    useState("OrderHistory");

  const [Usersdata, setUsersdata, Usersdataref] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [UsersdataOrders, setUsersdataOrders, UsersdataOrdersref] = useState(
    []
  );
  const [filterKeywordOrders, setFilterKeywordOrders] = useState("");
  const [currentPageOrders, setCurrentPageOrders] = useState(1);
  const [totalPagesOrders, setTotalPagesOrders] = useState(0);

  const [UsersdataCancel, setUsersdataCancel, UsersdataCancelref] = useState(
    []
  );
  const [filterKeywordCancel, setFilterKeywordCancel] = useState("");
  const [currentPageCancel, setCurrentPageCancel] = useState(1);
  const [totalPagesCancel, setTotalPagesCancel] = useState(0);

  const handleHistory = async (value) => {
    setHistoryState(value);
  };

  useEffect(() => {
    getActiveOrders(currentPage);
  }, [currentPage]);

  useEffect(() => {
    getOrdersHistory(currentPageOrders);
  }, [currentPageOrders]);

  useEffect(() => {
    getCancelOrders(currentPageCancel);
  }, [currentPageCancel]);

  const getActiveOrders = async (page = 1) => {
    var datas = {
      apiUrl: apiService.getActiveOrders,
      payload: { page, limit: 5 },
    };
    var response = await postMethod(datas);
    if (response.status) {
      setUsersdata(response.data);
      // setTotalPages(response.data.length/5);
      // setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } else {
      setUsersdata([]);
    }
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  };

  const getOrdersHistory = async (page = 1) => {
    var datas = {
      apiUrl: apiService.getOrdersHistory,
      payload: { page, limit: 5 },
    };
    var response = await postMethod(datas);
    if (response.status) {
      setUsersdataOrders(response.data);
      // setTotalPages(response.data.length/5);
      // setCurrentPage(response.currentPage);
      setTotalPagesOrders(response.totalPages);
      setCurrentPageOrders(response.currentPage);
    } else {
      setUsersdataOrders([]);
    }
  };

  const handlePageClickOrders = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPageOrders(selectedPage);
  };

  const getCancelOrders = async (page) => {
    var datas = {
      apiUrl: apiService.getCancelOrdersHistory,
      payload: { page, limit: 5 },
    };
    var response = await postMethod(datas);
    if (response.status) {
      setUsersdataCancel(response.result);
      // setTotalPages(response.data.length/5);
      // setCurrentPage(response.currentPage);
      setTotalPagesCancel(response.totalPages);
      setCurrentPageCancel(response.currentPage);
    } else {
      setUsersdataCancel([]);
    }
  };

  const handlePageClickCancel = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPageCancel(selectedPage);
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
                  <span className="dash-head">Users Trade History </span>
                </div>
                <div className="">
                  <nav>
                    <div
                      class="nav nav-tabs history_main_nav"
                      id="nav-tab"
                      role="tablist"
                    >
                      <span
                        // class="nav-link active"
                        class={
                          historyStateref.current == "OrderHistory"
                            ? "nav-link active"
                            : "nav-link"
                        }
                        id="nav-home-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-home"
                        role="tab"
                        aria-controls="nav-home"
                        aria-selected="true"
                        onClick={() => handleHistory("OrderHistory")}
                      >
                        Order History
                      </span>
                      <span
                        class={
                          historyStateref.current == "OpenHistory"
                            ? "nav-link active"
                            : "nav-link"
                        }
                        id="nav-profile-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-profile"
                        role="tab"
                        aria-controls="nav-profile"
                        aria-selected="false"
                        onClick={() => handleHistory("OpenHistory")}
                      >
                        Open Orders
                      </span>
                      <span
                        class={
                          historyStateref.current == "CancelHistory"
                            ? "nav-link active"
                            : "nav-link"
                        }
                        id="nav-contact-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-contact"
                        role="tab"
                        aria-controls="nav-contact"
                        aria-selected="false"
                        onClick={() => handleHistory("CancelHistory")}
                      >
                        Cancel Orders
                      </span>
                    </div>
                  </nav>
                  <div class="tab-content" id="nav-tabContent">
                    <div
                      class={`${
                        historyStateref.current === "OrderHistory"
                          ? "show active"
                          : ""
                      } tab-pane fade`}
                      id="nav-home"
                      role="tabpanel"
                      aria-labelledby="nav-home-tab"
                    >
                      {" "}
                      <div class="table-responsive my-5 trans-table">
                        <table className="w_100">
                          <thead className="trans-head">
                            <tr>
                              <th>orderId</th>
                              <th>UserName</th>
                              <th>Pair</th>
                              <th>Type</th>
                              <th>price</th>
                              <th>Amount</th>
                              <th>Total</th>
                              <th>Fee</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {UsersdataOrdersref.current.length > 0 ? (
                              UsersdataOrdersref.current.map((item, i) => (
                                <tr key={item._id}>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.orderId}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.type == "buy"
                                        ? item.buyername
                                        : item.sellername}
                                      {/* {item.sellername} */}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.pair}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.type}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.askPrice}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.askAmount}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.total}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {parseFloat(item.sell_fee).toFixed(4)}
                                      {/* {item.sell_fee} */}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {Moment(item.created_at).format("lll")}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={9}>
                                  <div className="empty_data">
                                    <div className="plus_14_ff">
                                      No Records Found
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                            {UsersdataOrdersref.current.length > 0 ? (
                              <tr className="text-center">
                                <td colSpan="9">
                                  <div className="paginationcss">
                                    <ReactPaginate
                                      previousLabel={"<"}
                                      nextLabel={">"}
                                      breakLabel={"..."}
                                      pageCount={totalPagesOrders}
                                      marginPagesDisplayed={1}
                                      pageRangeDisplayed={2}
                                      onPageChange={handlePageClickOrders}
                                      containerClassName={
                                        "pagination pagination-md justify-content-center"
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
                    <div
                      class={`${
                        historyStateref.current === "OpenHistory"
                          ? "show active"
                          : ""
                      } tab-pane fade`}
                      id="nav-profile"
                      role="tabpanel"
                      aria-labelledby="nav-profile-tab"
                    >
                      <div class="table-responsive my-5 trans-table">
                        <table className="w_100">
                          <thead className="trans-head">
                            <tr>
                              <th>orderId</th>
                              <th>UserName</th>
                              <th>Pair</th>
                              <th>Type</th>
                              <th>Side</th>
                              <th>Amount</th>
                              <th>Price</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Usersdataref.current.length > 0 ? (
                              Usersdataref.current.map((item, i) => (
                                <tr key={item._id}>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.orderId}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.username}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.pairName}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.ordertype}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.tradeType}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.amount}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.price}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {Moment(item.createddate).format("lll")}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={8}>
                                  <div className="empty_data">
                                    <div className="plus_14_ff">
                                      No Records Found
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                            {Usersdataref.current.length > 0 ? (
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
                                      containerClassName={
                                        "pagination pagination-md justify-content-center"
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
                    <div
                      class={`${
                        historyStateref.current === "CancelHistory"
                          ? "show active"
                          : ""
                      } tab-pane fade`}
                      id="nav-contact"
                      role="tabpanel"
                      aria-labelledby="nav-contact-tab"
                    >
                      <div class="table-responsive my-5 trans-table">
                        <table className="w_100">
                          <thead className="trans-head">
                            <tr>
                              <th>orderId</th>
                              <th>UserName</th>
                              <th>Pair</th>
                              <th>Type</th>
                              <th>Side</th>
                              <th>Amount</th>
                              <th>Price</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {UsersdataCancelref.current.length > 0 ? (
                              UsersdataCancelref.current.map((item, i) => (
                                <tr>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.orderId}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.username}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.pairName}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.ordertype}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.tradeType}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.amount}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {item.price}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="plus_14_ff">
                                      {Moment(item.createddate).format("lll")}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={8}>
                                  <div className="empty_data">
                                    <div className="plus_14_ff">
                                      No Records Found
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                            {UsersdataCancelref.current.length > 0 ? (
                              <tr className="text-center">
                                <td colSpan="8">
                                  <div className="paginationcss">
                                    <ReactPaginate
                                      previousLabel={"<"}
                                      nextLabel={">"}
                                      breakLabel={"..."}
                                      pageCount={totalPagesCancel}
                                      marginPagesDisplayed={1}
                                      pageRangeDisplayed={2}
                                      onPageChange={handlePageClickCancel}
                                      containerClassName={
                                        "pagination pagination-md justify-content-center"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserTrade;
