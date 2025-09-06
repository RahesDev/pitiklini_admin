import React, { useEffect } from "react";
import moment from "moment";
import axios from "axios";
import Sidebar from "./Sidebar";
import Sidebar_2 from "./Nav_bar";
import { toast, ToastContainer } from "react-toastify";
import { env } from "../core/service/envconfig";
import "react-toastify/dist/ReactToastify.css";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import useState from "react-usestateref";
import { Bars } from "react-loader-spinner";

const ProfileComponent = () => {
  useEffect(() => {
    getSitedatas();
  }, []);

  const [siteLoader, setSiteLoader] = useState(false);

  const getSitedatas = async () => {
    var data = {
      apiUrl: apiService.getSitedata,
    };
    setSiteLoader(true);  
    var resp = await getMethod(data);
    setSiteLoader(false);
    if (resp.status == true) {
      // console.log(resp, "=-=-=get site datas =-=-");
      setFormValue(resp.data);
    }
  };

  const initialFormValue = {
    facebook: "",
    twitter: "",
    linkedIn: "",
    instagram: "",
    reddit: "",
    youtube: "",
    bitcointalk: "",
    telegram: "",
    coinGecko: "",
    copyrightText: "",
    coinMarketCap: "",
    email: "",
    whatsappNumber: "",
    depositMaintenance: "",
    withdrawalMaintenance: "",
    siteMaintenance: "",
    footerContent: "",
    kycMaintenance: "",
    depositStatus: "",
    withdrawalStatus: "",
    siteStatus: "",
    kycStatus: "",
    tradeStatus: 1,
    tradeContent: ""
  };

  const [formValue, setFormValue] = useState(initialFormValue);

  const {
    facebook,
    twitter,
    linkedIn,
    instagram,
    reddit,
    youtube,
    bitcointalk,
    telegram,
    coinGecko,
    copyrightText,
    coinMarketCap,
    email,
    whatsappNumber,
    depositMaintenance,
    withdrawalMaintenance,
    siteMaintenance,
    footerContent,
    kycMaintenance,
    withdrawalStatus,
    depositStatus,
    siteStatus,
    kycStatus,
    tradeStatus,
    tradeContent
  } = formValue;

  const [imagePath, setImagePath] = useState("");
  const [url, setUrl] = useState("");
  const [url1, setUrl1] = useState("");
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [fileImage, setFileImage] = useState(true);

  const handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    // const sanitizedValue = value.replace(/\s/g, "");
    const sanitizedValue = value;
    let formData = { ...formValue, ...{ [name]: sanitizedValue } };
    setFormValue(formData);
  };

  const handleTextChange = async (e) => {
    let addrressData = { ...formValue, depositMaintenance: e.target.value };
    setFormValue(addrressData);
  };

  const handleTextChangewithdrawalMaintenance = async (e) => {
    let addrressData = { ...formValue, withdrawalMaintenance: e.target.value };
    setFormValue(addrressData);
  };

  const handleTextChangesite = async (e) => {
    let addrressData = { ...formValue, siteMaintenance: e.target.value };
    setFormValue(addrressData);
  };

  const handleTextChangefooter = async (e) => {
    let addrressData = { ...formValue, footerContent: e.target.value };
    setFormValue(addrressData);
  };

  const handleTextChangeKyc = async (e) => {
    let addrressData = { ...formValue, kycMaintenance: e.target.value };
    setFormValue(addrressData);
  };

  const handleTextChangeTrade = async (e) => {
    let addrressData = { ...formValue, tradeContent: e.target.value };
    setFormValue(addrressData);
  }

  const [depositstatus, setdepositstatus] = useState("");
  const [withdrawstatus, setwithdrawstatus] = useState("");
  const [sitestatus, setsitestatus] = useState("");
  const [kycstatus, setkycstatus] = useState("");
  const [logo, setlogo] = useState("");
  const [favIcon, setfavIcon] = useState("");
  const [siteLogo, setsiteLogo, siteLogoref] = useState("");
  const [siteLogoname, setsiteLogoname, siteLogonameref] = useState("");
  const [siteLogoLoad, setsiteLogoLoad] = useState(false);
  const [favicon, setFavicon, favIconref] = useState("");
  const [faviconName, setFaviconname, favIconnameref] = useState("");
  const [faviconLoad, setfaviconLoad] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [validLogoproof, setvalidLogoproof] = useState(0);
  const [validFaviconProof, setvalidFaviconProof] = useState(0);

  const handledepositStatusChange = (e) => {
    setdepositstatus(e.target.value);
  };
  const handlewithdrawStatusChange = (e) => {
    setwithdrawstatus(e.target.value);
  };
  const handlesiteStatusChange = (e) => {
    setsitestatus(e.target.value);
  };
  const handleKycStatusChange = (e) => {
    setkycstatus(e.target.value);
  }
  function handleFileChange(type, event) {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split(".").at(-1);
      const fileSize = file.size;
      const fileName = file.name;
      if (
        fileExtension != "png" &&
        fileExtension != "webp" &&
        fileExtension != "jpeg"
      ) {
        toast.error(
          "File does not support. You must use .png or .jpg or .jpeg "
        );
      } else if (fileSize > 10000000) {
        toast.error("Please upload a file smaller than 1 MB");
      } else {
        type == "siteLogo" ? setsiteLogoLoad(true) : setfaviconLoad(true);
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", env.upload_preset);
        data.append("cloud_name", env.cloud_name);
        fetch(
          "https://api.cloudinary.com/v1_1/" + env.cloud_name + "/auto/upload",
          { method: "post", body: data }
        )
          .then((resp) => resp.json())
          .then((data) => {
            // console.log(type, "type");
            if (type == "siteLogo") {
              setsiteLogoLoad(false);
              setvalidLogoproof(1);
              setsiteLogo(data.secure_url);
              setsiteLogoname(file.name);
            }
            if (type == "favicon") {
              setfaviconLoad(false);
              setvalidFaviconProof(1);
              setFavicon(data.secure_url);
              setFaviconname(file.name);
            }
          })
          .catch((err) => {
            // console.log(err);
            toast.error("Please try again later");
          });
      }
    }
  }

  const formSubmit = async () => {
    // formValue["depositStatus"] = depositstatus;
    // formValue["withdrawalStatus"] = withdrawstatus;
    // formValue["siteStatus"] = sitestatus;
    // formValue["kycStatus"] = kycstatus;
    formValue["siteLogo"] = siteLogoref.current;
    formValue["favicon"] = favIconref.current;
    // console.log(formValue, "=-=-formValue");
    var data = {
      apiUrl: apiService.sitesetting,
      payload: formValue,
    };
    setButtonLoader(true);
    var resp = await postMethod(data);
    setButtonLoader(false);
    if (resp.status == true) {
      toast.success(resp.message);
      setsiteLogo("");
      setvalidLogoproof(0);
      setFavicon("");
      setvalidFaviconProof(0);
      setsiteLogoname("");
      setFaviconname("");
      getSitedatas();
    } else {
      toast.error(resp.message);
    }
  };

  return (
    <div>
      {siteLoader == true ? (
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
      )
       : (
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
                  <span className="dash-head">Site Setting</span>
                </div>

                <div className="row justify-content-center mt-5">
                  <div className="col-lg-11">
                    <div className="currencyinput pt-0 pl-5">
                      <div className="main_div">
                        <div className="input-groups">
                          <h6 className="input-label">Facebook Link</h6>
                          <input
                            type="text"
                            name="facebook"
                            value={facebook}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Please enter facebook link"
                          />
                        </div>
                        <div className="input-groups">
                          <h6 className="input-label">Twitter Link</h6>
                          <input
                            type="text"
                            name="twitter"
                            value={twitter}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Please enter twitter link"
                          />
                        </div>
                      </div>
                      <div className="main_div">
                        <div className="input-groups">
                          <h6 className="input-label">LinkedIn Link</h6>
                          <input
                            type="text"
                            name="linkedIn"
                            value={linkedIn}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Please enter linkedin link"
                          />
                        </div>
                        <div className="input-groups">
                          <h6 className="input-label">Instagram Link</h6>
                          <input
                            type="text"
                            name="instagram"
                            value={instagram}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Please enter instagram link"
                          />
                        </div>
                      </div>
                      <div className="main_div">
                        <div className="input-groups">
                          <h6 className="input-label">Reddit Link</h6>
                          <input
                            type="text"
                            name="reddit"
                            value={reddit}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Please enter reddit link"
                          />
                        </div>
                        <div className="input-groups">
                          <h6 className="input-label">Youtube Link</h6>
                          <input
                            type="text"
                            name="youtube"
                            value={youtube}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Please enter youtube link"
                          />
                        </div>
                        {/* <div className="input-groups">
                          <h6 className="input-label">Bitcointalk Link</h6>
                          <input
                            type="text"
                            name="bitcointalk"
                            value={bitcointalk}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Please enter bitcointalk link"
                          />
                        </div> */}
                      </div>
                      <div className="main_div">
                        <div className="input-groups">
                          <h6 className="input-label">Telegram Link</h6>
                          <input
                            type="text"
                            name="telegram"
                            value={telegram}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Please enter telegram link"
                          />
                        </div>
                        <div className="input-groups">
                          <h6 className="input-label">Coingecko Link</h6>
                          <input
                            type="text"
                            name="coinGecko"
                            value={coinGecko}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Please enter coingecko link"
                          />
                        </div>
                      </div>
                      <div className="main_div">
                        <div className="input-groups">
                          <h6 className="input-label">Copyright Text</h6>
                          <input
                            type="text"
                            name="copyrightText"
                            value={copyrightText}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Please enter copyright text"
                          />
                        </div>
                        <div className="input-groups">
                          <h6 className="input-label">Coinmarketcap Link</h6>
                          <input
                            type="text"
                            name="coinMarketCap"
                            value={coinMarketCap}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Please enter coinmarketcap link"
                          />
                        </div>
                      </div>
                      <div className="main_div">
                        <div className="input-groups">
                          <h6 className="input-label">email</h6>
                          <input
                            type="text"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Please enter email address"
                          />
                        </div>
                        <div className="input-groups">
                          <h6 className="input-label">Whatsapp Number</h6>
                          <input
                            type="number"
                            min={0}
                            name="whatsappNumber"
                            value={whatsappNumber}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Please enter whatsapp number"
                          />
                        </div>
                      </div>
                      <div className="main_div">
                        <div className="input-groups">
                          <h6 className="input-label">Logo Upload</h6>
                          <div className="logo_upload">
                            {siteLogoLoad == false ? (
                              validLogoproof == 0 ? (
                                <>
                                  <div className="inner_frst_display">
                                    <i class="fa-solid fa-cloud-arrow-up fn-24"></i>
                                    <p>Upload the site logo</p>
                                  </div>
                                </>
                              ) : (
                                <img
                                  src={siteLogoref.current}
                                  className="up_im_past"
                                  alt="siteLogo"
                                />
                              )
                            ) : (
                              <div className="inner_frst_display">
                                <i class="fa-solid fa-spinner fa-spin fa-lg"></i>
                              </div>
                            )}

                            <input
                              type="file"
                              name="image"
                              accept="image/*"
                              className="input-field file-input"
                              onChange={(e) => handleFileChange("siteLogo", e)}
                            />

                            {siteLogonameref.current == "" ? (
                              ""
                            ) : (
                              <div className="mt-2">
                                <input
                                  className="proofs_name w-100"
                                  disabled
                                  value={siteLogonameref.current}
                                ></input>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="input-groups">
                          <h6 className="input-label">Favicon Upload</h6>
                          <div className="logo_upload">
                            {faviconLoad == false ? (
                              validFaviconProof == 0 ? (
                                <>
                                  <div className="inner_frst_display">
                                    <i class="fa-solid fa-cloud-arrow-up fn-24"></i>
                                    <p>Upload the site favicon</p>
                                  </div>
                                </>
                              ) : (
                                <img
                                  src={favIconref.current}
                                  className="up_im_past"
                                  alt="siteLogo"
                                />
                              )
                            ) : (
                              <div className="inner_frst_display">
                                <i class="fa-solid fa-spinner fa-spin fa-lg"></i>
                              </div>
                            )}

                            <input
                              type="file"
                              name="image"
                              accept="image/*"
                              className="input-field file-input"
                              onChange={(e) => handleFileChange("favicon", e)}
                            />

                            {favIconnameref.current == "" ? (
                              ""
                            ) : (
                              <div className="mt-2">
                                <input
                                  className="proofs_name w-100"
                                  disabled
                                  value={favIconnameref.current}
                                ></input>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="main_div">
                        <div className="input-groups">
                          <h6 className="input-label">Deposit Status</h6>
                          <div className="radio-group mt-3">
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="depositStatus"
                                value="Active"
                                className="radio-input"
                                checked={formValue.depositStatus === "Active"}
                                onChange={(e) =>
                                  setFormValue({ ...formValue, depositStatus: e.target.value })
                                }
                              />
                              Active
                            </label>
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="depositStatus"
                                value="Deactive"
                                className="radio-input"
                                checked={formValue.depositStatus === "Deactive"}
                                onChange={(e) =>
                                  setFormValue({ ...formValue, depositStatus: e.target.value })
                                }
                              />
                              Deactive
                            </label>
                          </div>
                        </div>
                        <div className="input-groups">
                          <h6 className="input-label">
                            Deposit Maintenance Content
                          </h6>
                          <textarea
                            maxLength="250"
                            name="depositMaintenance"
                            value={depositMaintenance}
                            onChange={handleTextChange}
                            placeholder="Enter the deposit maintenance content"
                            fluid
                            rows="2"
                            className="input-field fixed-textarea"
                          />
                        </div>
                      </div>
                      <div className="main_div">
                        <div className="input-groups">
                          <h6 className="input-label">Withdrawal Status</h6>
                          <div className="radio-group mt-3">
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="withdrawalStatus"
                                value="Active"
                                className="radio-input"
                                checked={formValue.withdrawalStatus === "Active"}
                                onChange={(e) =>
                                  setFormValue({ ...formValue, withdrawalStatus: e.target.value })
                                }
                              />
                              Active
                            </label>
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="withdrawalStatus"
                                value="Deactive"
                                className="radio-input"
                                checked={formValue.withdrawalStatus === "Deactive"}
                                onChange={(e) =>
                                  setFormValue({ ...formValue, withdrawalStatus: e.target.value })
                                }
                              />
                              Deactive
                            </label>
                          </div>
                        </div>
                        <div className="input-groups">
                          <h6 className="input-label">
                            Withdrawal Maintenance Content
                          </h6>
                          <textarea
                            maxLength="250"
                            name="withdrawalMaintenance"
                            value={withdrawalMaintenance}
                            onChange={handleTextChangewithdrawalMaintenance}
                            placeholder="Enter the withdrawal maintenance content"
                            fluid
                            rows="2"
                            className="input-field fixed-textarea"
                          />
                        </div>
                      </div>
                      <div className="main_div">
                        <div className="input-groups">
                          <h6 className="input-label">
                            Site Maintenance Status
                          </h6>
                          <div className="radio-group mt-3">
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="siteStatus"
                                value="Active"
                                className="radio-input"
                                checked={formValue.siteStatus === "Active"}
                                onChange={(e) =>
                                  setFormValue({ ...formValue, siteStatus: e.target.value })
                                }
                              />
                              Active
                            </label>
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="siteStatus"
                                value="Deactive"
                                className="radio-input"
                                checked={formValue.siteStatus === "Deactive"}
                                onChange={(e) =>
                                  setFormValue({ ...formValue, siteStatus: e.target.value })
                                }
                              />
                              Deactive
                            </label>
                          </div>
                        </div>
                        <div className="input-groups">
                          <h6 className="input-label">
                            Site Maintenance Content
                          </h6>
                          <textarea
                            maxLength="250"
                            name="siteMaintenance"
                            value={siteMaintenance}
                            onChange={handleTextChangesite}
                            placeholder="Enter the site maintenance content"
                            fluid
                            rows="2"
                            className="input-field fixed-textarea"
                          />
                        </div>
                      </div>
                      <div className="main_div">
                      <div className="input-groups">
                          <h6 className="input-label">
                            KYC Status
                          </h6>
                          <div className="radio-group mt-3">
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="kycStatus"
                                value="Active"
                                className="radio-input"
                                checked={formValue.kycStatus === "Active"}
                                onChange={(e) =>
                                  setFormValue({ ...formValue, kycStatus: e.target.value })
                                }
                              />
                              Active
                            </label>
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="kycStatus"
                                value="Deactive"
                                className="radio-input"
                                checked={formValue.kycStatus === "Deactive"}
                                onChange={(e) =>
                                  setFormValue({ ...formValue, kycStatus: e.target.value })
                                }
                              />
                              Deactive
                            </label>
                          </div>
                        </div>
                        <div className="input-groups">
                          <h6 className="input-label">KYC Maintenance Content</h6>
                          <textarea
                            maxLength="250"
                            name="kycMaintenance"
                            value={kycMaintenance}
                            onChange={handleTextChangeKyc}
                            placeholder="Enter the KYC maintenance content"
                            fluid
                            rows="2"
                            className="input-field fixed-textarea"
                          />
                        </div>
                      </div>
                      <div className="main_div">
                      <div className="input-groups">
                          <h6 className="input-label">
                            Trade Status
                          </h6>
                          <div className="radio-group mt-3">
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="tradeStatus"
                                value="1"
                                className="radio-input"
                                checked={formValue.tradeStatus === 1}
                                onChange={(e) =>
                                  setFormValue({ ...formValue, tradeStatus: Number(e.target.value) })
                                }
                              />
                              Active
                            </label>
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="tradeStatus"
                                value="0"
                                className="radio-input"
                                checked={formValue.tradeStatus === 0}
                                onChange={(e) =>
                                  setFormValue({ ...formValue, tradeStatus: Number(e.target.value) }) 
                                }
                              />
                              Deactive
                            </label>
                          </div>
                        </div>
                        <div className="input-groups">
                          <h6 className="input-label">Trade Content</h6>
                          <textarea
                            maxLength="250"
                            name="tradeContent"
                            value={tradeContent}
                            onChange={handleTextChangeTrade}
                            placeholder="Enter the trade content"
                            fluid
                            rows="2"
                            className="input-field fixed-textarea"
                          />
                        </div>
                      </div>
                      <div className="main_div">
                      {/* <div className="input-groups">
                          <h6 className="input-label">
                            KYC Status
                          </h6>
                          <div className="radio-group mt-3">
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="kycstatus"
                                value="Active"
                                className="radio-input"
                                onChange={handleKycStatusChange}
                              />
                              Active
                            </label>
                            <label className="radio-label">
                              <input
                                type="radio"
                                name="kycstatus"
                                value="Deactive"
                                className="radio-input"
                                onChange={handleKycStatusChange}
                              />
                              Deactive
                            </label>
                          </div>
                        </div> */}
                        <div className="input-groups">
                          <h6 className="input-label">Footer Content</h6>
                          <textarea
                            maxLength="250"
                            name="footerContent"
                            value={footerContent}
                            onChange={handleTextChangefooter}
                            placeholder="Enter the footer content"
                            fluid
                            rows="2"
                            className="input-field fixed-textarea"
                          />
                        </div>
                      </div>
                      <div className="main_submit mt-5">
                        <div className="site_submain" onClick={formSubmit}>
                          {buttonLoader == false ? (
                            <span className="submit_site">Submit</span>
                          ) : (
                            <span className="submit_site">Loading ...</span>
                          )}
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
       )}

    </div>
  );
};

export default ProfileComponent;
