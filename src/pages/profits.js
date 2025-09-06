import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Sidebar_2 from "./Nav_bar";
import ReactPaginate from "react-paginate";
import useState from "react-usestateref";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/material/Typography";
import { TextField, MenuItem, Button } from "@mui/material";
import Moment from "moment";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import * as XLSX from 'xlsx';

function Profits() {
  const [currency, setCurrency, currencyref] = useState("USDT"); // Default value
  const [fromDate, setFromDate, fromDateref] = useState(""); // To store From date
  const [toDate, setToDate, toDateref] = useState(""); // To store To date

  const [Usersdata, setUsersdata, Usersdataref] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [totalProfitUSDT, setTotalProfitUSDT] = useState(0);
  const [totalProfitINR, setTotalProfitINR] = useState(0);
  const [todayProfitUsdt, setTodayProfitUsdt] = useState(0);
  const [todayProfitInr, setTodayProfitInr] = useState(0);
  const [customProfitUSDT, setCustomProfitUSDT] = useState(0);
  const [customProfitINR, setCustomProfitINR] = useState(0);

  const[userDownloaddata,setUserDownloaddata,userDownloaddataref] = useState([]);
  const [loader,setLoader] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
    // console.log(event.target.value, "---------event.target.value---------");
  };

  useEffect(() => {
    getProfitDetails(currentPage);
  }, []);

  useEffect(() => {
    getProfitDatas(currentPage);
  }, [currentPage]);

  const getProfitDetails = async (page = 1) => {
    var data = {
      apiUrl: apiService.getadminProfitDetails,
      payload: {
        page,
        limit: 5,
        from: fromDateref.current,
        to: toDateref.current,
      },
    };
    setLoader(true);
    var resp = await postMethod(data);
    setLoader(false);
    // console.log(resp, "----=--=-=-=resp-=-=-=-=");
    if (resp.status) {
      setTotalProfitUSDT(resp.totalFeesInUSDT);
      setTotalProfitINR(resp.totalFeesInINR);
      setTodayProfitUsdt(resp.todayProfitInUSDT);
      setTodayProfitInr(resp.todayProfitInINR);
      setCustomProfitUSDT(resp.customProfitInUSDT);
      setCustomProfitINR(resp.customProfitInINR);
    }
  };

  const handleDate = async (e,type) => {
    if(type == "From"){
    setFromDate(e.target.value);
    }else{
    setToDate(e.target.value);
    }
    getProfitDetails(1);
  };

  const getProfitDatas = async (page = 1) => {
    try {
      var datas = {
        apiUrl: apiService.getProfit,
        payload: { page, limit: 5 },
      };
      var response = await postMethod(datas);
      // console.log(response, "=-=-=-=response=-=-=");
      if (response.status) {
        setUsersdata(response.value);
        // setTotalPages(response.data.length/5);
        // setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
      } else {
        setUsersdata([]);
      }
    } catch (error) {}
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  };

  const downloadData = async() => {
    try {
      console.log("download clcicked");
      var data = {
        apiUrl: apiService.downloadProfits,
      };
      var resp = await getMethod(data);
      // console.log(resp,"-----download resp-----");
      setUserDownloaddata(resp.value);
      if(resp.status == true){
        const fieldsToExport = ['email', 'currency', 'currencyname','orderid','type','fees','profit_amount','date'];
        const filteredData = userDownloaddataref.current.map(item => {
          const filteredItem = {};
          fieldsToExport.forEach(field => {
            // filteredItem[field] = item[field];
            if (field === 'date') {
              filteredItem[field] = Moment(item[field]).format("lll");
            } else {
              filteredItem[field] = item[field];
            }
          });
            return filteredItem;
        })
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'profitdetails.xlsx');
        toast.success("Profits File Downloaded");
      }
    } catch (error) {
      
    }
  }

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
            {loader == true ? (
          <div className="loadercss_profit">
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
              <div className="px-2 my-4 transaction_padding_top tops">
                <div className="headerss">
                  <span className="dash-head"> Profits </span>
                </div>

                <div className="table-responsive my-4 trans-table">
                  <table className="w_100">
                    <thead className="trans-head">
                      <tr>
                        <th>Currency</th>
                        <th>Total Profit</th>
                        <th>Today Profit</th>
                        <th>
                          <div className="custo_head">
                            Customize Date
                            <div className="custo_head_inside">
                              From :{" "}
                              <input
                                name="fromDate"
                                type="date"
                                max={today}
                                value={fromDate}
                                onChange={(e) => handleDate(e,"From")}
                                className="custo_inp_date"
                              />
                              To :{" "}
                              <input
                                name="toDate"
                                type="date"
                                max={today}
                                value={toDate}
                                onChange={(e) => handleDate(e,"To")}
                                className="custo_inp_date"
                              />
                            </div>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <TextField
                            select
                            value={currency}
                            onChange={handleCurrencyChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                          >
                            <MenuItem value="USDT">USDT</MenuItem>
                            <MenuItem value="INR">INR</MenuItem>
                          </TextField>
                        </td>
                        <td>
                          {currencyref.current == "USDT" ? (
                            <span className="plus_14_ff plus_21_ff">
                              {parseFloat(totalProfitUSDT).toFixed(4)}
                            </span>
                          ) : (
                            <span className="plus_14_ff plus_21_ff">
                              {parseFloat(totalProfitINR).toFixed(4)}
                            </span>
                          )}
                        </td>
                        <td>
                          {currencyref.current == "USDT" ? (
                            <span className="plus_14_ff plus_21_ff">
                              {parseFloat(todayProfitUsdt).toFixed(4)}
                            </span>
                          ) : (
                            <span className="plus_14_ff plus_21_ff">
                              {parseFloat(todayProfitInr).toFixed(4)}
                            </span>
                          )}
                        </td>
                        <td>
                          {currencyref.current == "USDT" ? (
                            <span className="plus_14_ff plus_21_ff">
                              {parseFloat(customProfitUSDT).toFixed(4)}
                            </span>
                          ) : (
                            <span className="plus_14_ff plus_21_ff">
                              {parseFloat(customProfitINR).toFixed(4)}
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="d-flex flex-column gap-2 my-5">
                  <div className=" d-flex justify-content-end w_100">
                  <div className="profit_top_down mb-3 px-2" onClick={()=>downloadData()}>
                    <span className="lf14_nrml_ff">Click here to download</span>
                    <i class="fa-regular fa-circle-down"></i>
                  </div>
                  </div>
                <div class="table-responsive trans-table">
                  <table className="w_100">
                    <thead className="trans-head">
                      <tr>
                        <th>SI.NO</th>
                        <th>Email</th>
                        <th>Currency</th>
                        <th>Type</th>
                        <th>Profit</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Usersdataref.current.length > 0 ? (
                        Usersdataref.current.map((item, i) => (
                          <tr>
                            <td>
                              <span className="plus_14_ff">{i + 1}</span>
                            </td>
                            <td>
                              <span className="plus_14_ff">{item.email}</span>
                            </td>
                            <td>
                              <span className="plus_14_ff">
                                {item.currency}
                              </span>
                            </td>
                            <td>
                              <span className="plus_14_ff">{item.type}</span>
                            </td>
                            <td>
                              <span className="plus_14_ff">
                                {parseFloat(item.profit_amount).toFixed(8)}
                              </span>
                            </td>
                            <td>
                              <span className="plus_14_ff">
                              {Moment(item.date).format("lll")}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6}>
                            <div className="empty_data">
                              <div className="plus_14_ff">No Records Found</div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {Usersdataref.current.length > 0 ? (
                        <tr className="text-center">
                          <td colSpan="6">
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
      )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profits;
