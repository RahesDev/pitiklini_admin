import Header from "./Header";
import toast, { Toaster } from "react-hot-toast";
import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useState from "react-usestateref";
import { postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { setAuthorization } from "../core/service/axios";

function Landing() {
  const initialFormValue = {
    tfa: "",
  };

  const navigate = useNavigate();

  const [formValue, setFormValue] = useState(initialFormValue);
  const [tfaValidate, settfaValidate] = useState(false);
  const [validationnErr, setvalidationnErr] = useState("");
  const [buttonLoader, setbuttonLoader] = useState(false);

  const { tfa } = formValue;

  const validate = async (values) => {
    const errors = {};
    if (!values.tfa) {
      errors.tfa = "2FA is Required";
      settfaValidate(true);
    }
    setvalidationnErr(errors);
    return errors;
  };

  const formSubmit = async () => {
    validate(formValue);
    if (formValue.tfa !== "") {
      const usermail = sessionStorage.getItem("user_email");
      console.log(usermail, "usermail=====",tfa);
      var data = {
        apiUrl: apiService.verify_otp,
        payload: {
          userToken: tfa,
          userEmail: usermail,
        },
      };
      setbuttonLoader(true);
      var resp = await postMethod(data);
      setbuttonLoader(false);
      console.log("tfa login===", resp);
      if (resp.status) {
        toast.success(resp.data.Message);
        await setAuthorization(resp.data.token);
        sessionStorage.setItem("user_token", resp.data.token);
        sessionStorage.setItem("tfa_status", 1);
        sessionStorage.setItem("socket_token", resp.data.socketToken);
        sessionStorage.setItem("jwNkiKmttscotlox", resp.jwNkiKmttscotlox);
        navigate("/dashboard");
      } else {
        if (resp.issue == 1) {
          navigate("/");
          toast.error(resp.Message);
        } else {
          toast.error(resp.Message);
        }
      }
    }
  };

  const navigate_login = () => {
    navigate("/");
  };

  return (
    <div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
        }}
      />
      <Header />
      <div className="admin_login_card">
        <div className="container">
          <div className="row mark_pagi">
            <div className="col-lg-6">
              <div className="admin_login_main">
                <div className="hero_subhead">
                  <div className="hotpic_bot_sbhd">
                  <span className="hero_head text-align-center">
                    Verify 2FA
                  </span>
                  <h6 onClick={navigate_login} className="pls_20_ff cursor-pointer">
                  Login <i class="fa-solid fa-arrow-right-long ml-2"></i> 
              </h6>
              </div>
                  <div className="ycho_inner mt-4">
                    <div className="hotpic_bot_hd">
                      <span className="hero_sub_inner">2FA Code</span>
                      <input
                        className="admin_login_imput"
                        type="number"
                        placeholder="Enter the 2FA code "
                        min={100000}
                        name="tfa"
                         pattern="\S*"
                        onKeyDown={(evt) =>
                          ["e", "E", "+", "-"].includes(evt.key) &&
                          evt.preventDefault()
                        }
                        value={tfa}
                        onChange={(e) => {
                          settfaValidate(false);
                          const value = e.target.value;
                          if (value.length <= 6) {
                            setFormValue({ tfa: value });
                          }
                        }}
                      />

                      {tfaValidate == true ? (
                        <p className="text-danger"> {validationnErr.tfa} </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="d-flex justify-content-center w_100">
                      {!buttonLoader ? (
                        <div className="lan_had_con" onClick={formSubmit}>
                        <span className="con_lan_con">
                          Submit
                        </span>
                        </div>
                      ) : (
                        <div className="lan_had_con">
                        <span className="con_lan_con">Loading ...</span>
                        </div>
                      )}
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

export default Landing;
