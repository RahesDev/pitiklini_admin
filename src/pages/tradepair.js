import React, { useEffect } from "react";
import useState from "react-usestateref";
import Sidebar from "./Sidebar";
import Sidebar_2 from "./Nav_bar";
import * as Yup from "yup";
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
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currencylist, setcurrencylist, currencylistref] = useState([]);
  const [validationnErr, setvalidationnErr] = useState({});
  const [buttonLoader, setButtonLoader] = useState(false);
  const [loader, setLoader] = useState(false);

  const [nextpage, setnextpage] = useState(false);

  useEffect(() => {
    getUserDetails(currentPage);
  }, [currentPage, filterKeyword]);

  const getUserDetails = async (page = 1) => {
    const data = {
      apiUrl: apiService.tradepair_view,
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
      const changestate = currentStatus == 1 ? 0 : 1;

      const data = {
        apiUrl: apiService.changetradeStatus,
        payload: { _id: userId, status: changestate },
      };

      const response = await postMethod(data);

      if (response.status) {
        toast.success("Trade Pair Status Updated Successfully");
        // Refresh user data after status change
        getUserDetails(currentPage);
      } else {
        toast.error("Something Went Wrong. Please Try Again later");
      }
    } catch (error) {
      toast.error("Error updating status. Please try again later.");
    }
  };

  useEffect(() => {
    getcurrencylist();
  }, [0]);

  const getcurrencylist = async () => {
    try {
      const data = {
        apiUrl: apiService.tradecurrency,
      };

      const response = await getMethod(data);

      if (response.status) {
        const formattedData = Object.values(response.data).map((item) => {
          const [id, label] = item.split("_");
          return { id, label };
        });

        currencylistref.current = formattedData; // Assign formattedData to currencylistref.current

        setcurrencylist(formattedData); // If you're also using state

        // console.log(currencylistref.current, "ihnknknkn");
      } else {
        setcurrencylist({});
      }
    } catch (error) {
      // console.log("Error updating status. Please try again later.");
    }
  };

  const getTradepairOne = async (currentStatus) => {
    try {
      const data = {
        apiUrl: apiService.getTradepairOne,
        payload: { _id: currentStatus },
      };
      setLoader(true);
      const response = await postMethod(data);
      setLoader(false);
      if (response.status) {
        setnextpage(true);
        // console.log(response.data, "=-=-respons=-=-e=-");
        settradepair(response.data);
        getcurrencylist();
      } else {
        // console.log("Something Went Wrong. Please Try Again later");
      }
    } catch (error) {
      // console.log("Error updating status. Please try again later.");
    }
  };

  const deletecurrency = async (data) => {
    // console.log(data, "data");

    var obj = {
      _id: data,
    };
    var datas = {
      apiUrl: apiService.deletetradepair,
      payload: obj,
    };
    setLoader(true);
    var response = await postMethod(datas);
    setLoader(false);
    // console.log(response, "=-=-=-=response=-=-=");

    if (response.status) {
      toast.success(response.Message);
      getUserDetails(currentPage);

      // setAdd(true);
    } else {
      toast.error(response.Message);

      // setcmsdata({});
    }
  };

  const handleLiqiutyChange = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus == 0 ? 1 : 0;
      const data = {
        apiUrl: apiService.changeliqudityStatus,
        payload: { _id: userId, status: newStatus },
      };

      const response = await postMethod(data);

      if (response.status) {
        toast.success("Trade Pair Liquidity Status Updated Successfully");
        getUserDetails(currentPage);
        // Refresh user data after status change
      } else {
        toast.error("Something Went Wrong. Please Try Again later");
      }
    } catch (error) {
      toast.error("Error updating status. Please try again later.");
    }
  };

  const handleFilterChange = (e) => {
    setFilterKeyword(e.target.value);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };
  const sentback = async () => {
    setnextpage(false);
    settradepair({});
  };

  const [tradepair, settradepair] = useState({
    marketPrice: "",
    highest_24h: "",
    lowest_24h: "",
    changes_24h: "",
    volume_24h: "",
    makerFee: "",
    takerFee: "",
    min_trade_amount: "",
    max_trade_amount: "",
    price_decimal: "",
    amount_decimal: "",
    from_symbol: "",
    to_symbol: "",
    from_symbol_id: "",
    to_symbol_id: "",
    buyspread: "",
    sellspread: "",
    liquidity_status: "",
    liquidity_available: "",
    status: "",
  });

  const validateForm = (values) => {
    const errors = {};

    if (!values.from_symbol) {
      errors.from_symbol = "From Symbol is required";
    }

    if (!values.to_symbol) {
      errors.to_symbol = "To Symbol is required";
    }

    if (
      values.status == undefined ||
      values.status == "" ||
      values.status == null
    ) {
      errors.status = "Swap Status is required";
    }

    if (
      values.liquidity_status == undefined ||
      values.liquidity_status == "" ||
      values.liquidity_status == null
    ) {
      errors.liquidity_status = "Liquidity Swap Status is required";
    }

    if (!values.price_decimal) {
      errors.price_decimal = "Price Decimal is required";
    }
    if (!values.amount_decimal) {
      errors.amount_decimal = "Amount Decimal is required";
    }

    if (!values.makerFee) {
      errors.makerFee = "Maker Fee is required";
    }
    if (!values.takerFee) {
      errors.takerFee = "Taker Fee is required";
    }

    if (!values.min_trade_amount) {
      errors.min_trade_amount = "Minimum Trade Amount is required";
    }

    if (!values.max_trade_amount) {
      errors.max_trade_amount = "Maximum Trade Amount is required";
    }

    return errors;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...tradepair, [name]: value };
    settradepair(updatedFormData);
    const errors = validateForm(updatedFormData);
    setvalidationnErr(errors);
  };

  const handleSubmit = async (e) => {
    // console.log("knjkmkmkmkmk",e);
    e.preventDefault();
    const errors = validateForm(tradepair);
    if (Object.keys(errors).length > 0) {
      setvalidationnErr(errors);
      return;
    }
    setvalidationnErr({});
    // console.log("Form data submitted:", tradepair);
    var datas = {
      apiUrl: apiService.addTradePair,
      payload: tradepair,
    };
    setButtonLoader(true);
    var response = await postMethod(datas);
    setButtonLoader(false);
    // console.log(response, "=-=-=-=response=-=-=");

    if (response.status) {
      toast.success(response.Message);
      getUserDetails(currentPage);
      setnextpage(false);
      settradepair({});
    } else {
      toast.error(response.Message);
    }
    // getUserDetails();
    // setAdd(false);
    // setstakingpage(false);
    // setstakeflex(false);
    // setFormData({});
    // setStakingData({});
  };
  const handleCurrencyChange = (event, type) => {
    const selectedOption = event.target.options[event.target.selectedIndex];

    const id = selectedOption.value; // Gets the value (id) of the selected option
    const label = selectedOption.getAttribute("label"); // Gets the label of the selected option

    // console.log(`Selected ${type} ID:`, id);
    // console.log(`Selected ${type} Label:`, label);

    const updatedFormData = {
      ...tradepair,
      [`${type}_symbol`]: label,
      [`${type}_symbol_id`]: id,
    };

    settradepair(updatedFormData);
    validateForm(updatedFormData); // Pass the updated form data for validation
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
              <div className="px-4 transaction_padding_top">
                <div className="px-2 my-4 transaction_padding_top tops">
                  <div className="headerss">
                    <span className="dash-head">
                      {" "}
                      {nextpage == false
                        ? "Trade Pair Management"
                        : "Add / Edit Trade Pair"}{" "}
                    </span>
                    {nextpage == false ? (
                      <div className="top_filter">
                        <input
                          className="filters"
                          placeholder="Enter Tradepair to filter"
                          value={filterKeyword}
                          onChange={handleFilterChange}
                        />
                        <i
                          className="fa-solid fa-circle-plus adds cursor-pointer"
                          onClick={() => setnextpage(true)}
                        ></i>
                      </div>
                    ) : (
                      <button onClick={() => sentback()}>Back</button>
                    )}
                  </div>
                  {nextpage == false ? (
                    <div className="table-responsive my-5 trans-table">
                      <table className="w_100">
                        <thead className="trans-head">
                          <tr>
                            <th>S.No</th>
                            <th>Trade Pair</th>
                            <th>Market Price</th>
                            <th>Min Trade amount</th>
                            <th>Maker Fee</th>
                            <th>Taker Fee</th>
                            <th>Liqidity Status </th>
                            <th>Status </th>
                            <th>Action </th>
                            <th>Delete </th>
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
                                  <span className="plus_14_ff">{item.pair}</span>
                                </td>

                                <td>
                                  <span className="plus_14_ff">
                                    {item.marketPrice}
                                  </span>
                                </td>

                                <td>
                                  <span className="plus_14_ff">
                                    {item.min_trade_amount}
                                  </span>
                                </td>

                                <td>
                                  <span className="plus_14_ff">
                                    {item.makerFee}
                                  </span>
                                </td>

                                <td>
                                  <span className="plus_14_ff">
                                    {item.takerFee}
                                  </span>
                                </td>

                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={item.liquidity_status == 1}
                                      onChange={() =>
                                        handleLiqiutyChange(
                                          item._id,
                                          item.liquidity_status
                                        )
                                      }
                                    />
                                    <span className="slider round"></span>
                                  </label>
                                </td>

                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={item.status == 1}
                                      onChange={() =>
                                        handleStatusChange(item._id, item.status)
                                      }
                                    />
                                    <span className="slider round"></span>
                                  </label>
                                </td>

                                <td>
                                  <span className="plus_14_ff">
                                    <i
                                      className="fa-regular fa-pen-to-square cursor-pointer"
                                      onClick={() => getTradepairOne(item._id)}
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
                              <td colSpan={11}>
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
                              <td colSpan="11">
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
                          ) : ("")}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="trans-table my-5 currencyinput">
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          From Currency
                        </label>
                        <div className="col-lg-6">
                          <select
                            value={tradepair.from_symbol_id || ""}
                            className="inputselect"
                            onChange={(e) => handleCurrencyChange(e, "from")}
                          >
                            <option value="" className="form-control">
                              Select From Currency
                            </option>
                            {currencylistref.current &&
                              currencylistref.current.map((currency) => (
                                <option
                                  key={currency.id}
                                  value={currency.id}
                                  label={currency.label}
                                >
                                  {currency.label}
                                </option>
                              ))}
                          </select>

                          <div className="help-block">
                            {validationnErr.from_symbol && (
                              <div className="error">
                                {validationnErr.from_symbol}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          To Currency
                        </label>
                        <div className="col-lg-6">
                          <select
                            value={tradepair.to_symbol_id || ""}
                            className="inputselect"
                            onChange={(e) => handleCurrencyChange(e, "to")}
                          >
                            <option value="" className="form-control">
                              Select TO Currency
                            </option>
                            {currencylistref.current &&
                              currencylistref.current.map((currency) => (
                                <option
                                  key={currency.id}
                                  value={currency.id}
                                  label={currency.label}
                                >
                                  {currency.label}
                                </option>
                              ))}
                          </select>

                          <div className="help-block">
                            {validationnErr.to_symbol && (
                              <div className="error">
                                {validationnErr.to_symbol}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Market Price
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            name="marketPrice"
                            value={tradepair.marketPrice}
                            onChange={handleChange}
                            placeholder="Market Price"
                            className="form-control"
                            required
                          />
                          <div className="help-block">
                            {validationnErr.marketPrice && (
                              <div className="error">
                                {validationnErr.marketPrice}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Min Trade Amount
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="number"
                            name="min_trade_amount"
                            value={tradepair.min_trade_amount}
                            onChange={handleChange}
                            min={0}

                            onKeyDown={(evt) =>
                              ["e", "E", "+", "-"].includes(evt.key) &&
                              evt.preventDefault()
                            }
                            placeholder="Min Trade Amount"
                            className="form-control"
                            required
                          />
                          <div className="help-block">
                            {validationnErr.min_trade_amount && (
                              <div className="error">
                                {validationnErr.min_trade_amount}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Max Trade Amount
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="number"
                            min={0}
                            name="max_trade_amount"
                            value={tradepair.max_trade_amount}
                            onChange={handleChange}
                            onKeyDown={(evt) =>
                              ["e", "E", "+", "-"].includes(evt.key) &&
                              evt.preventDefault()
                            }
                            placeholder="Max Trade Amount"
                            className="form-control"
                            required
                          />
                          <div className="help-block">
                            {validationnErr.max_trade_amount && (
                              <div className="error">
                                {validationnErr.max_trade_amount}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Maker Fee %
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            name="makerFee"
                            value={tradepair.makerFee}
                            onChange={handleChange}
                            placeholder="Maker Fee"
                            className="form-control"
                            required
                          />
                          <div className="help-block">
                            {validationnErr.makerFee && (
                              <div className="error">
                                {validationnErr.makerFee}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Taker Fee %
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            name="takerFee"
                            value={tradepair.takerFee}
                            onChange={handleChange}
                            placeholder="Taker Fee"
                            className="form-control"
                            required
                          />
                          <div className="help-block">
                            {validationnErr.takerFee && (
                              <div className="error">
                                {validationnErr.takerFee}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Price Decimal
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            name="price_decimal"
                            value={tradepair.price_decimal}
                            onChange={handleChange}
                            placeholder="Price Decimal"
                            className="form-control"
                            required
                          />
                          <div className="help-block">
                            {validationnErr.price_decimal && (
                              <div className="error">
                                {validationnErr.price_decimal}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Amount Decimal
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            name="amount_decimal"
                            value={tradepair.amount_decimal}
                            onChange={handleChange}
                            placeholder="Amount Decimal"
                            className="form-control"
                            required
                          />
                          <div className="help-block">
                            {validationnErr.amount_decimal && (
                              <div className="error">
                                {validationnErr.amount_decimal}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Buy Spread
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            name="buyspread"
                            value={tradepair.buyspread}
                            onChange={handleChange}
                            placeholder="Buy Spread"
                            className="form-control"
                            required
                          />
                          <div className="help-block">
                            {validationnErr.buyspread && (
                              <div className="error">
                                {validationnErr.buyspread}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Sell Spread
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            name="sellspread"
                            value={tradepair.sellspread}
                            onChange={handleChange}
                            placeholder="Sell Spread"
                            className="form-control"
                            required
                          />
                          <div className="help-block">
                            {validationnErr.sellspread && (
                              <div className="error">
                                {validationnErr.sellspread}
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
                                value="1"
                                onChange={handleChange}
                                checked={tradepair.status == "1"}
                              />{" "}
                              Active
                            </div>
                            <div>
                              <input
                                type="radio"
                                name="status"
                                value="0"
                                onChange={handleChange}
                                checked={tradepair.status == "0"}
                              />{" "}
                              Deactive
                            </div>
                          </div>
                          <div className="help-block">
                            {validationnErr.status && (
                              <div className="error">{validationnErr.status}</div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Liquidity Status
                        </label>
                        <div className="col-lg-6">
                          <div className="radio">
                            <div>
                              <input
                                type="radio"
                                name="liquidity_status"
                                value="1"
                                onChange={handleChange}
                                checked={tradepair.liquidity_status == "1"}
                              />{" "}
                              Active
                            </div>
                            <div>
                              <input
                                type="radio"
                                name="liquidity_status"
                                value="0"
                                onChange={handleChange}
                                checked={tradepair.liquidity_status == "0"}
                              />{" "}
                              Deactive
                            </div>
                          </div>
                          <div className="help-block">
                            {validationnErr.liquidity_status && (
                              <div className="error">
                                {validationnErr.liquidity_status}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Dashboard;
