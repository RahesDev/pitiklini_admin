import Header from "./Header";
import toast, { Toaster } from "react-hot-toast";
import React, { useEffect } from "react";
import { Link , useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { setAuthorization } from "../core/service/axios";
import * as Yup from "yup"; // Import Yup

// Define Yup validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .min(4, "Email username must be above 4 characters long")
    .required("Email is a required field!"),
  password: Yup.string()
    .trim()
    .min(5, "Password should not be below 5 letters!")
    .max(25, "Password should not exceed 25 letters!")
    .required("Password is required!"),
});


function Landing() {
  const initialFormValue = {
    email: "",
    password: "",
  };

  const navigate = useNavigate();
  const [formValue, setFormValue] = useState(initialFormValue);
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [validationnErr, setvalidationnErr] = useState({});

  // useEffect(() => {
  //   const token = sessionStorage.getItem("Pitiklini_token");
  //   if (token) {
  //     navigate("/dashboard");
  //   }
  // }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.replace(/\s/g, "");
    setFormValue({
      ...formValue,
      [name]: value.replace(/\s/g, ""),
    });
    try {
      await validationSchema.validateAt(name, { [name]: trimmedValue });
      setvalidationnErr((prev) => ({
        ...prev,
        [name]: "", // Clear the error for the current field
      }));
    } catch (validationError) {
      if (validationError instanceof Yup.ValidationError) {
        setvalidationnErr((prev) => ({
          ...prev,
          [name]: validationError.message, // Set the error message for the current field
        }));
      }
    }
  };

  const formSubmit = async () => {
    try {
      await validationSchema.validate(formValue, { abortEarly: false });
      setvalidationnErr({});
      
      setbuttonLoader(true);
      const data = {
        apiUrl: apiService.adminlogin,
        payload: formValue,
      };
      const resp = await postMethod(data);
      setbuttonLoader(false);
      
      if (resp?.tfa === 1) {
        sessionStorage.setItem("user_email", formValue.email);
        navigate("/verify-2fa");
      } else {
        if (resp.status === true) {
          toast.success(resp.Message);
          await setAuthorization(resp.token);
          sessionStorage.setItem("user_token", resp.token);
          sessionStorage.setItem("tfa_status", resp.tfa);
          sessionStorage.setItem("socket_token", resp.socketToken);
          sessionStorage.setItem("jwNkiKmttscotlox", resp.jwNkiKmttscotlox);
          // localStorage.setItem("Pitiklini_token", resp.token);
          // localStorage.setItem("tfa_status", resp.tfa);
          // localStorage.setItem("socket_token", resp.socketToken);
          // localStorage.setItem("jwNkiKmttscotlox", resp.jwNkiKmttscotlox);
          navigate("/dashboard");
        } else {
          toast.error(resp.Message);
        }
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = err.inner.reduce((acc, current) => {
          acc[current.path] = current.message;
          return acc;
        }, {});
        setvalidationnErr(errors);
      }
    }
  };

  return (
    <div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 4000 }}
      />
      <Header />
      <div className="admin_login_card">
        <div className="container">
          <div className="row mark_pagi">
            <div className="col-lg-6">
              <div className="admin_login_main">
                <div className="hero_subhead">
                  <span className="hero_head text-align-center">Log In</span>
                  <div className="ycho_inner">
                    <div className="hotpic_bot_hd">
                      <span className="hero_sub_inner">Email</span>
                      <input
                        className="admin_login_imput"
                        placeholder="Enter email"
                        type="text"
                        name="email"
                        maxLength="250"
                        value={formValue.email}
                        onChange={handleChange}
                      />
                      {validationnErr.email && (
                        <p className="errorcss">{validationnErr.email}</p>
                      )}
                    </div>
                    <div className="hotpic_bot_hd mb-0">
                      <span className="hero_sub_inner">Password</span>
                      <input
                        className="admin_login_imput"
                        placeholder="Enter password"
                        type="password"
                        name="password"
                        maxLength={25}
                        value={formValue.password}
                        onChange={handleChange}
                      />
                      {validationnErr.password && (
                        <p className="errorcss">{validationnErr.password}</p>
                      )}
                    </div>
                  </div>
                  <div className="d-flex flex-column justify-content-center w_100">
                  <div className="terms my-2">
                    <p>
                      <Link to="/forgotpassword">Forget password?</Link>
                    </p>
                  </div>
                      {!buttonLoader ? (
                        <div className="lan_had_con" onClick={formSubmit}>
                        <span className="con_lan_con f16">
                          Submit
                        </span>
                        </div>
                      ) : (
                        <div className="lan_had_con">
                        <span className="con_lan_con f16">Loading ...</span>
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
