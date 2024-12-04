import { useFormik } from 'formik';
import { loginSchema } from "../schemas";
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const initialValues = {
    username_or_email: "",
    password: "",
  }

  const {values, errors, touched, handleChange, handleSubmit, handleBlur} = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, action) => {
      try {
        const res = await axios.post("http://127.0.0.1:8000/login/", values);
        if(res.status === 200){
          localStorage.setItem("access token", res.data.access);
          localStorage.setItem("refresh token", res.data.refresh);
          messageApi.open({
            type: "success",
            content: res.data.message,
          })
          navigate("/dashboard");
        }
      } catch (error:any) {
        messageApi.open({
          type: "error",
          content: error.response.data.error,
        })
      }
      action.resetForm();
    }
  });

  return (
    <>
      {contextHolder}
      <div className="screenMiddleDiv">
        <div className="formDiv">
          <form onSubmit={handleSubmit}>
            <h2 className="text-center">Login</h2>

            <div>
              <label htmlFor="usernameOrEmail" className="formLabel">
                Username Or Email
              </label>
              <input
                type="text"
                name="username_or_email"
                value={values.username_or_email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.username_or_email && touched.username_or_email ? <span className="formError">{errors.username_or_email}</span> : null}
            </div>

            <div className="my-6">
              <label htmlFor="password" className="formLabel">
                Password
              </label>
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              {errors.password && touched.password ? <span className="formError">{errors.password}</span> : null}
              </div>

            <button type="submit" className="formButton">
              Login
            </button>

            <div className="text-center mt-4">
              <a href="#" className="text-sm hover:underline">
                Forgot your password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
