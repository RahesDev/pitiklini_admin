import React, { useEffect } from "react";
import useState from "react-usestateref";
import Sidebar from "./Sidebar";
import Sidebar_2 from "./Nav_bar";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import Modal from "@mui/joy/Modal";
import Moment from "moment";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";

function VipManagement() {
  const [loader, setLoader] = useState(false);
  const [vipDatas, setVipDatas, vipDatasref] = useState([]);
  const [USDT, setUSDT] = useState("");
  const [PTK, setPTK] = useState("");
  const [buttonLoader, setButtonLoader, buttonLoaderref] = useState(false);

  useEffect(() => {
    getVipDetails();
  }, []);

  const getVipDetails = async () => {
    var datas = {
      apiUrl: apiService.getVipDatas,
    };
    // setLoader(true);
    var response = await getMethod(datas);
    // setLoader(false);
    console.log(response, "=-=-=-=response=-=-=");
    if (response.status) {
      setUSDT(response.vipDatas.USDT);
      setPTK(response.vipDatas.PTK);
    } else {
      setUSDT("");
      setPTK("");
    }
  };

  const convertUSDTtoPTK = async (value) => {
    if (!value || value <= 0) {
      setPTK("");
      return;
    }
   
    let datas = {
      apiUrl: apiService.getUSDTtoPTK,
      payload: {},
    };

    let response = await postMethod(datas);

    if (response.status) {
      let rate = Number(response.rate);
      let convertedAmount = Number(value) * rate;
      console.log("convertedAmount ptk---", convertedAmount);
      setPTK(convertedAmount.toFixed(6)); // set value in PTK field
    }
  };

  const saveVipDetails = async () => {
    if (USDT === "" || PTK === "") {
      toast.error("Please fill both amounts");
      return;
    }
    setButtonLoader(true);
    let payload = {
      apiUrl: apiService.saveVipDatas,
      payload: {
        USDT: Number(USDT),
        PTK: Number(PTK),
      },
    };

    let response = await postMethod(payload);
    // setButtonLoader(false);

    if (response.status) {
      toast.success("VIP settings saved");
      getVipDetails();
      setButtonLoader(false);
    } else {
      toast.error("Error saving data");
      setButtonLoader(false);
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
                    <span className="dash-head">VIP Management</span>
                  </div>
                  <div className="currencyinput mt-5">
                    <form>
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Currency
                        </label>
                        <div className="col-lg-6">
                          <label className="col-lg-6 col-form-label form-control-label">
                            USDT
                          </label>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Amount
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="number"
                            min={0}
                            name="USDT"
                            value={USDT}
                            onChange={(e) => {
                              let val = e.target.value;
                              setUSDT(val);
                              convertUSDTtoPTK(val);
                            }}
                            placeholder="USDT amount"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Currency
                        </label>
                        <div className="col-lg-6">
                          <label className="col-lg-6 col-form-label form-control-label">
                            PTK
                          </label>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-6 col-form-label form-control-label">
                          Amount
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="number"
                            min={0}
                            // name="PTK"
                            value={PTK}
                            // onChange={(e) => setPTK(e.target.value)}
                            readOnly
                            placeholder="PTK amount"
                            className="form-control"
                          />
                        </div>
                      </div>
                    </form>
                    <div className="form-group row justify-content-center">
                      <div className="col-lg-4 mt-4">
                        {buttonLoaderref.current == true ? (
                          <button type="submit" className="d-block w_100">
                            Loading...
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="d-block w_100"
                            onClick={saveVipDetails}
                          >
                            Submit
                          </button>
                        )}
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
}

export default VipManagement;
