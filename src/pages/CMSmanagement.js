import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Sidebar_2 from "./Nav_bar";
import ReactPaginate from "react-paginate";

import { toast } from "react-toastify";
import Moment from "moment";
import { getMethod, postMethod } from "../core/service/common.api";
import useState from "react-usestateref";
import apiService from "../core/service/detail";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Bars } from "react-loader-spinner";

function CmsManagement() {
  const [add, setadd] = useState(false);
  const [editorData, setEditorData] = useState("");
  const [Usersdata, setUsersdata, Usersdataref] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loader,setLoader] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [validationnErr, setvalidationnErr] = useState({});

  const [cmsdata, setcmsdata, cmsdataref] = useState({
    heading: "",
    title: "",
    content_description: "",
    status: "", // 0 for Deactive, 1 for Active
  });

  useEffect(() => {
    getUserDetails(currentPage);
  }, [currentPage, filterKeyword]);

  const getUserDetails = async (page = 1, limit = 5) => {
    const data = {
      apiUrl: apiService.cms_list,
      payload: { page, limit, keyword: filterKeyword },
    };

    const response = await postMethod(data);
    if (response.status) {
      setFilteredUsers(response.data);
      // setUsersdata(response.data);
      setTotalPages(response.totalPages); // Update the total pages for pagination
    } else {
      setUsersdata([]);
    }
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
    // getUserDetails(selectedPage); // Fetch data for the selected page
  };

  const handleFilterChange = (e) => {
    setFilterKeyword(e.target.value);
  };

  // const filteredUsers = Usersdata.filter((user) =>
  //   user.heading.toLowerCase().includes(filterKeyword.toLowerCase())
  // );

  const getEditDetails = async (data) => {
    var obj = {
      _id: data,
    };
    var datas = {
      apiUrl: apiService.cms_get,
      payload: obj,
    };
    setLoader(true);
    var response = await postMethod(datas);
    // console.log(response, "=-=-=-=response=-=-=");
    setLoader(false);
    if (response.status) {
      setcmsdata(response.data);
      setadd(true);
    } else {
      setcmsdata({});
    }
  };

  const deleteDetail = async (data) => {
    // console.log(data, "data");
    var obj = {
      _id: data,
    };
    var datas = {
      apiUrl: apiService.deletecmsdetail,
      payload: obj,
    };
    setLoader(true);
    var response = await postMethod(datas);
    // console.log(response, "=-=-=-=response=-=-=");
    setLoader(false);
    if (response.status) {
      toast.success(response.Message);
      getUserDetails();

      // setAdd(true);
    } else {
      toast.error(response.Message);

      // setcmsdata({});
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = currentStatus === 0 ? 1 : 0;
    // console.log(newStatus, "ijuiewhuiewhiwefhwefi")

    let formData = { ...cmsdataref.current, ...{ ["status"]: newStatus } };
    setcmsdata(formData);
  };

  const handleChange = async (e) => {
    // e.preventDefault();
    const { name, value } = e.target;
    const formData = { ...cmsdata, [name]: value };
    setcmsdata(formData);
    const errors = validateForm(formData);
    setvalidationnErr(errors);
  };

  const formSubmit = async (e) => {
    try {
      e.preventDefault();
      const errors = validateForm(cmsdata);
      if (Object.keys(errors).length > 0) {
        setvalidationnErr(errors);
        return;
      }
      setvalidationnErr({});
      // console.log("Form data submitted:", cmsdata);
      // validate(cmsdataref.current);
      // if (emailValidateref.current === false) {
      // cmsdataref.current.content_description = editorData == "" ? cmsdataref.current.content_description : editorData  ;
      var data = {
        apiUrl: apiService.cms_update,
        payload: cmsdata,
      };
      setButtonLoader(true);
      var resp = await postMethod(data);
      setButtonLoader(false);
      if (resp.status) {
        toast.success(resp.Message);
        setadd(false);
        getUserDetails();
      } else {
        toast.error(resp.Message);
        setadd(false);
        getUserDetails();
      }
      // } else {
      //   console.log("Required all fields");
      // }
    } catch (error) {
      // console.log(error,"=-=--catch error=-=-=-=-");
    }
  };

  const sentback = async (data) => {
    setadd(false);
    setcmsdata({});
  };

  const validateForm = (values) => {
    const errors = {};

    // Common validations
    if (!values.heading) {
      errors.heading = "heading is required";
    } else if (values.heading.length > 50) {
      errors.heading = "Max 50 characters allowed";
    }

    if (!values.title) {
      errors.title = "title is required";
    } else if (values.title.length > 50) {
      errors.title = "Max 50 characters allowed";
    }

    if (
      values.status == undefined ||
      values.status == "" ||
      values.status == null
    ) {
      errors.status = "Status is required";
    }

    if (!values.content_description) {
      errors.body = "content description is required";
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
              <div className="px-2 my-4 transaction_padding_top tops">
                <div className="headerss">
                  <span className="dash-head">CMS Setting</span>
                  <div>
                    {add == false ? (
                      <div className="top_filter">
                        <input
                          className="filters"
                          placeholder="Enter Heading to filter"
                          value={filterKeyword}
                          onChange={handleFilterChange}
                        />
                        <i
                          className="fa-solid fa-circle-plus adds cursor-pointer"
                          onClick={() => setadd(true)}
                        ></i>
                      </div>
                    ) : (
                      <button onClick={() => sentback()}>Back</button>
                    )}
                  </div>
                </div>
                {add == false ? (
                  <div class="table-responsive my-5  trans-table ">
                    <table className="w_100">
                      <thead className="trans-head">
                        <th>S.No</th>
                        <th>Heading</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Action</th>
                        <th>Delete</th>
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
                                  {item.heading}
                                </span>
                              </td>
                              <td>
                                <span className="plus_14_ff">{item.title}</span>
                              </td>
                              <td>
                                <span className="plus_14_ff">
                                  {item.status == "1" ? (
                                    <span className="plus_14_ff text-success">
                                      Active
                                    </span>
                                  ) : (
                                    <span className="plus_14_ff text-danger">
                                      Deactive
                                    </span>
                                  )}
                                </span>
                              </td>
                              <td>
                                <label className="plus_14_ff">
                                  <i
                                    class="fa-regular fa-pen-to-square cursor-pointer"
                                    onClick={() => getEditDetails(item._id)}
                                  ></i>
                                </label>
                              </td>
                              <td>
                                <span className="plus_14_ff">
                                  <i
                                    className="fa-regular fa-trash-can text-danger cursor-pointer"
                                    onClick={() => deleteDetail(item._id)}
                                  ></i>
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6}>
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
                            <td colSpan="6">
                              <div className="paginationcss">
                                <ReactPaginate
                                  previousLabel={"<"}
                                  nextLabel={">"}
                                  breakLabel={"**"}
                                  pageCount={totalPages}
                                  marginPagesDisplayed={1}
                                  pageRangeDisplayed={0}
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
                ) : (
                  <div className="row justify-content-center mt-5">
                    <div className="currencyinput  col-lg-9">
                      <div class="form-group row">
                        <label class=" col-lg-6 col-form-label form-control-label">
                          Heading
                        </label>
                        <div class=" col-lg-6">
                          <input
                            class="form-control"
                            type="text"
                            onChange={handleChange}
                            name="heading"
                            value={cmsdata.heading}
                            placeholder="enter a heading"
                          />
                          <div className="help-block">
                            {validationnErr.heading && (
                              <div className="error">
                                {validationnErr.heading}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div class="form-group row">
                        <label class=" col-lg-6 col-form-label form-control-label">
                          Title
                        </label>
                        <div class=" col-lg-6">
                          <input
                            type="text"
                            value={cmsdata.title}
                            onChange={handleChange}
                            name="title"
                            placeholder="enter a title"
                            class="form-control"
                          />
                          <div className="help-block">
                            {validationnErr.title && (
                              <div className="error">
                                {validationnErr.title}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* <div class="form-group row">
                        <label class=" col-lg-6 col-form-label form-control-label">
                          Link
                        </label>
                        <div class=" col-lg-6">
                          <input
                            type="text"
                            value={cmsdataref.current.link}
                            placeholder="Contract Address"
                            onChange={handleChange}
                            name="link"
                            class="form-control"
                          />

                        </div>
                      </div>
                      <div class="form-group row">
                        <label class=" col-lg-6 col-form-label form-control-label">
                          Meta-Keyword
                        </label>
                        <div class=" col-lg-6">
                          <input
                            type="text"
                            placeholder="Currency Decimal"
                            value={cmsdataref.current.meta_keyword}

                            onChange={handleChange}
                            name="meta_keyword"
                            class="form-control"
                          />

                        </div>
                      </div>
                      <div class="form-group row">
                        <label class=" col-lg-6 col-form-label form-control-label">
                          Meta-Description
                        </label>
                        <div class=" col-lg-6">
                          <input
                            type="text"
                            value={cmsdataref.current.meta_description}
                            onChange={handleChange}
                            name="meta_description"
                            placeholder="Contract Address"
                            class="form-control"
                          />

                        </div>
                      </div> */}

                      <div class="form-group row">
                        <label class=" col-lg-6 col-form-label form-control-label">
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
                                checked={cmsdata.status == "1"}
                              />{" "}
                              Active
                            </div>
                            <div>
                              <input
                                type="radio"
                                name="status"
                                value="0"
                                onChange={handleChange}
                                checked={cmsdata.status == "0"}
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
                      <div class="form-group row">
                        <label class=" col-lg-6 col-form-label form-control-label">
                          Content-Description
                        </label>
                      </div>

                      <div class="form-group row">
                        <label class=" col-lg-12 col-form-label form-control-label">
                          <CKEditor
                            editor={ClassicEditor}
                            data={cmsdata.content_description}
                            onReady={(editor) => {
                              console.log("Editor is ready to use!", editor);
                            }}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              setcmsdata((prevState) => ({
                                ...prevState, // Keep the existing values
                                content_description: data, // Update the content_description
                              }));
                            }}
                            config={{
                              allowedContent: true,
                              // toolbar: [
                              //   'heading', '|', 'bold', 'italic', 'underline', '|',
                              //   'link', 'bulletedList', 'numberedList', '|',
                              //   'blockQuote', 'undo', 'redo' , 'source'
                              // ],
                              placeholder: 'Enter the content',
                            }}
                          />
                        </label>
                        <div className="help-block">
                          {validationnErr.content_description && (
                            <div className="error">
                              {validationnErr.content_description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div class="form-group row justify-content-center">
                        <div class=" col-lg-4">
                          {buttonLoader == false ? (
                            <button
                              type="submit"
                              className="d-block w_100"
                              onClick={formSubmit}
                            >
                              Submit
                            </button>
                          ) : (
                            <button type="submit" className="d-block w_100">
                              Loading ...
                            </button>
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
      )}
    </div>
  );
}

export default CmsManagement;
