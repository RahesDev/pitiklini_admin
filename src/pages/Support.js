import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import useState from "react-usestateref";
import { toast } from "react-toastify";
import Sidebar_2 from "./Nav_bar";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Moment from "moment";
import { env } from "../core/service/envconfig";
import { Bars } from "react-loader-spinner";

function Support() {
    const [add, setAdd] = useState(false);
    const [validationnErr, setvalidationnErr] = useState({});
    const [buttonLoader,setButtonLoader] = useState(false);
    const [image,setImage,imageref] = useState("");
    const [imageName, setimageName] = useState("");
    const [tag,setTag,tagref] = useState("");
    const [oneData, setOneData,oneDataref] = useState("");
    const [loader,setLoader] = useState(false);

    const [formData, setFormData, formDataref] = useState({
        message: "",
        image: ""
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
        console.log("Form data submitted:", formData);
        formData["_id"] = oneDataref.current._id ;
        formData["tag"] = tagref.current ;
        var datas = {
          apiUrl: apiService.support_save,
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
        setFormData({});
      };

      const [currentPage, setCurrentPage] = useState(1);
      const [supportDatas, setSupportDatas] = useState("");    
      const [totalPages, setTotalPages] = useState(0);

      const handlePageClick = (data) => {
        setCurrentPage(data.selected + 1);
      };

      useEffect(() => {
        getUserDetails(currentPage);
      }, [currentPage]);

      const getUserDetails = async (page = 1) => {
        const data = {
          apiUrl: apiService.support_list,
          payload: { page, limit: 5}, // Include the keyword here
        };
        const response = await postMethod(data);
        if (response.status) {
            setSupportDatas(response.data);
          setTotalPages(response.totalPages);
        } else {
        }
      };

      const getEditDetails = async (data) => {
        setAdd(true);
        console.log(data, "data");
    
        var obj = {
          _id: data,
        };
        var datas = {
          apiUrl: apiService.support_view,
          payload: obj,
        };
        setLoader(true);
        var response = await postMethod(datas);
        setLoader(false);
        if (response.status) {
        //   setFormData(response.data[0]._id);
        setOneData(response.data[0]);
        console.log(response.data[0]._id ,"response.data[0]._id" ); 
          setAdd(true);
          console.log(formDataref.current, "=-=-=-=response=-=-=");
        } else {
        }
      };

      const validateForm = (values) => {
        const errors = {};
    
        // Common validations
        if (!values.message) {
          errors.message = "Message is required";
        }
        if (!values.image) {
          errors.image = "Image is required";
        }
    
        return errors;
      };
    
      const sentback = async (data) => {
        setAdd(false);
        setFormData({});
        setimageName("");
      };

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
                  image: imageUrl,
                }));
    
                // Validate the form with the updated form data
                validateForm({
                  ...formData,
                  image: imageUrl,
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
                    <span className="dash-head">Support</span>
                    {add == false ? (
                     ""
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
                            <th>Date & Time</th>
                            <th>Email</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {supportDatas.length > 0 ? (
                            supportDatas.map((item, i) => (
                              <tr key={item._id}>
                                <td>
                                  <span className="plus_14_ff">{i + 1}</span>
                                </td>
                                <td>
                                  <span className="plus_14_ff">
                                  {Moment(item.created_at).format("lll")}
                                  </span>
                                </td>
                                <td>
                                  <span className="plus_14_ff">
                                  {item.email}
                                  </span>
                                </td>
                                <td>
                                  <span className="plus_14_ff">
                                  {item.category}
                                  </span>
                                </td>
                                <td>
                                  {item.status == 0 ? (
                                    <span className="plus_14_ff text-success">
                                     Open
                                    </span>
                                  ) : (
                                    <span className="plus_14_ff text-danger">
                                      Close
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

{supportDatas.length > 0 ? (
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
                          User Mail 
                        </label>
                        <div className="col-lg-6">
                            <span className="plus_14_ff">
                            {oneDataref.current.email}
                            </span>
                        </div>
                      </div>
                      
                <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          User Question
                        </label>
                        <div className="col-lg-6">
                        <span className="plus_14_ff">
                            {oneDataref.current.message}
                        </span>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Reply
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="enter a reply message"
                            className="form-control"
                          />
                          <div className="help-block">
                            {validationnErr.message && (
                              <div className="error">
                                {validationnErr.message}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Image
                        </label>
                        <div className="col-lg-6">
                          <div className="radio">
                            <div className="imagefile cursor-pointer">
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleFileChange(e.target.files[0])
                                }
                                className="cursor-pointer"
                              />
                               {imageName == ""
                                ? "Upload Image"
                                : imageName}
                            </div>
                            <img src={formData.image} width="80px"  />
                          </div>
                          <div className="help-block">
                            {validationnErr.image && (
                              <div className="error">
                                {validationnErr.image}
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

export default Support