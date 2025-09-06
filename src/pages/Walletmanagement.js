import React, { useEffect } from "react";
import useState from "react-usestateref";
import Sidebar from "./Sidebar";
import Sidebar_2 from "./Nav_bar";
import ReactPaginate from "react-paginate";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/material/Typography";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletData, setWalletData,walletDataref] = useState([]);
  const [walletBalance, setWalletBalance] = useState([]);
  const [walletAddress, setWalletAddress] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [filterKeyword, setFilterKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // useEffect(() => {
  //   fetchWalletList(1);
  // }, []);

    useEffect(() => {
    fetchWalletList(currentPage,filterKeyword);
  }, [currentPage,filterKeyword]);

  const fetchWalletList = async (page = 1, keyword = "") => {
    console.log(page);
    try {
      var datas = {
        apiUrl: apiService.activatedUserList,
        payload: { page, limit: 5,keyword: keyword },
      };
      var response = await postMethod(datas);
      setWalletData(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWalletBalance = async (userId) => {
    try {
      const obj = { userId: userId };
      var datas = {
        apiUrl: apiService.userbalance,
        payload: obj,
      };
      var response = await postMethod(datas);
      setWalletBalance(response.Message);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWalletAddress = async (userId) => {
    try {
      const obj = { userId: userId };
      var datas = {
        apiUrl: apiService.useraddress,
        payload: obj,
      };
      var response = await postMethod(datas);
      var datas1 = {
        apiUrl: apiService.allCurrencyListCrypto,
      };
      var currenciesResponse = await postMethod(datas1);
      setWalletAddress(response.Message);
      setCurrencies(currenciesResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDialog = (userId) => {
    console.log(userId,"=-=-userId=--");
    setSelectedUserId(userId);
    fetchWalletBalance(userId);
    setModalType("balance");
    setIsModalOpen(true);
  };

  const handleOpenAddressDialog = (userId) => {
    console.log(userId,"=-=-userId=--");
    setSelectedUserId(userId);
    fetchWalletAddress(userId);
    setModalType("address");
    setIsModalOpen(true);
  };

  const handleFilterChange = (e) => {
    setFilterKeyword(e.target.value);
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
    fetchWalletList(selectedPage);
  };

  // const filteredUsers = walletData.filter((user) =>
  //   user.email.toLowerCase().includes(filterKeyword.toLowerCase())
  // );

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
                  <span className="dash-head">Wallet Management</span>
                  <div>
                    <input
                      className="filters"
                      placeholder="Enter email to filter"
                      value={filterKeyword}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
                <div class="table-responsive my-5 trans-table">
                  <table className="w_100">
                    <thead className="trans-head">
                      <tr>
                        <th>S.No</th>
                        <th>Email</th>
                        <th>View Balance</th>
                        <th>View Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletDataref.current.length > 0 ? (
                        walletDataref.current.map((item, i) => (
                          <tr key={item._id}>
                            <td>
                              <span className="plus_14_ff">{i + 1}</span>
                            </td>
                            <td>
                              <span className="plus_14_ff">{item.email}</span>
                            </td>
                            <td>
                              <span className="plus_14_ff">
                                <i
                                  className="fa-solid fa-eye cursor-pointer"
                                  onClick={() => handleOpenDialog(item._id)}
                                ></i>
                              </span>
                            </td>
                            <td>
                              <span className="plus_14_ff">
                                <i
                                  className="fa-solid fa-eye cursor-pointer"
                                  onClick={() =>
                                    handleOpenAddressDialog(item._id)
                                  }
                                ></i>
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4}>
                            <div className="empty_data my-4">
                              <div className="plus_14_ff">No Records Found</div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {walletDataref.current.length > 0 ? (
                      <tr className="text-center">
                      <td colSpan="4">
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
            {modalType === "balance" ? (
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
                    Wallet Balance Details
                  </h3>
                  <div className="ycho_inner_model mt-4">
                    {walletBalance.length > 0 ? (
                      walletBalance.map((item, index) => (
                        <div
                          key={index}
                          className="d-flex my-2 justify-content-between align-items-center"
                        >
                          <img width="26px" src={item.image} alt={item.currencyname} />
                          <p className="text-white mb-0 ml-4">
                            {item.currencyname} : {item.balance}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-white mb-0 mt-2 mx-3">No data available</p>
                    )}
                  </div>
                </Typography>
              </Sheet>
            ) : (
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
                    Wallet Address Details
                  </h3>
                  <div className="ycho_inner_model mt-4">
                    {walletAddress.length > 0 ? (
                      walletAddress.map((item, index) => (
                        <div
                          key={index}
                          className="d-flex my-2 justify-content-between align-items-center"
                        >
                          <img
                            width="26px"
                            src={item.image}
                            alt={item.currencyname}
                          />
                          <p className="text-white mb-0 mx-3">
                            {item.currencyname} : {item.address}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-white mb-0 ml-4 mt-2">No data available</p>
                    )}
                  </div>
                </Typography>
              </Sheet>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
