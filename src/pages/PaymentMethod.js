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
import { Bars } from "react-loader-spinner";

function PaymentMethod() {

    const [add, setAdd] = useState(false);
    const [validationnErr, setvalidationnErr] = useState({});
    const [buttonLoader,setButtonLoader] = useState(false);
    const [loader,setLoader] = useState(false);

    const [formData, setFormData, formDataref] = useState({
        _id: "",
        payment_name: "",
        status: ""
      });

      const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);
        const errors = validateForm(updatedFormData);
        setvalidationnErr(errors);
      };

      const handleSubmit = async (e) => {
        // console.log("knjkmkmkmkmk",e);
        e.preventDefault();
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
          setvalidationnErr(errors);
          return;
        }
        setvalidationnErr({});
        console.log("Form data submitted:", formDataref.current);
    
        var datas = {
          apiUrl: apiService.payment_method_update,
          payload: formDataref.current,
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
        getpaymentmethodDetails();
        setAdd(false);
        setFormData({});
      };

      const [currentPage, setCurrentPage] = useState(1);
      const [paymentDatas, setpaymentDatas] = useState("");
      const [totalPages, setTotalPages] = useState(0);

      const handlePageClick = (data) => {
        setCurrentPage(data.selected + 1);
      };

      useEffect(() => {
        getpaymentmethodDetails(currentPage);
      }, [currentPage]);

      const getpaymentmethodDetails = async (page = 1) => {

        const data = {
          apiUrl: apiService.payment_method_list,
          payload: { page, limit: 5}, // Include the keyword here
        };
        const response = await postMethod(data);
        if (response.status) {
            setpaymentDatas(response.data);
          setTotalPages(response.totalPages);
        } else {
        }
      };

      
  const getEditDetails = async (data) => {
    console.log(data, "data");

    var obj = {
      _id: data,
    };
    var datas = {
      apiUrl: apiService.payment_method_get,
      payload: obj,
    };
    setLoader(true);
    var response = await postMethod(datas);
    setLoader(false);
    if (response.status) {
      setFormData(response.data);
      setAdd(true);
      console.log(formDataref.current, "=-=-=-=response=-=-=");

    } else {
    }
  };

  const deletepaymentmethod = async (data) => {
    console.log(data, "data");

    var obj = {
      _id: data,
    };
    var datas = {
      apiUrl: apiService.payment_method_delete,
      payload: obj,
    };
    setLoader(true);
    var response = await postMethod(datas);
    console.log(response, "=-=-=-=response=-=-=");
    setLoader(false);
    if (response.status) {
      toast.success(response.Message);
      getpaymentmethodDetails();

      // setAdd(true);
    } else {
      toast.error(response.Message);

      // setcmsdata({});
    }
  };

  const validateForm = (values) => {
    const errors = {};

    // Common validations
    if (!values.payment_name) {
      errors.payment_name = "Payment Method is required";
    } else if (values.payment_name.length > 100) {
      errors.payment_name = "Max 100 characters allowed";
    }

    if (
        values.status == undefined ||
        values.status == "" ||
        values.status == null
      ) {
        errors.status = "Status is required";
      }

    return errors;
  };

  const sentback = async (data) => {
    setAdd(false);

    setFormData({});
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

                <div className="px-2 my-4 transaction_padding_top tops">
                  <div className="headerss">
                    <span className="dash-head">P2P Payment Methods</span>
                    {add == false ? (
                      <div className="top_filter">
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
                            <th>Payment Method</th>
                            <th>Status</th>
                            <th>Action</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentDatas.length > 0 ? (
                            paymentDatas.map((item, i) => (
                              <tr key={item._id}>
                                <td>
                                  <span className="plus_14_ff">{i + 1}</span>
                                </td>
                                <td>
                                  <span className="plus_14_ff">
                                    {item.payment_name}
                                  </span>
                                </td>
                                <td>
                                  {item.status == 1 ? (
                                    <span className="plus_14_ff text-success">
                                     Active
                                    </span>
                                  ) : (
                                    <span className="plus_14_ff text-danger">
                                      Deactive
                                    </span>
                                  )}
                                </td>
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
                                      onClick={() => deletepaymentmethod(item._id)}
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

{paymentDatas.length > 0 ? (
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
                          Payment method name
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            name="payment_name"
                            value={formData.payment_name}
                            onChange={handleChange}
                            placeholder="enter a payment method name"
                            className="form-control"
                          />
                          <div className="help-block">
                            {validationnErr.payment_name && (
                              <div className="error">
                                {validationnErr.payment_name}
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
                                value= "1"
                                checked={formData.status == "1"}
                                onChange={handleChange}
                              />{" "}
                              Active
                            </div>
                            <div>
                              <input
                                type="radio"
                                name="status"
                                value="0"
                                checked={formData.status == "0"}
                                onChange={handleChange}
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
  )
}

export default PaymentMethod