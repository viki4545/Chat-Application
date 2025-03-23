import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUserThunk } from "../redux/features/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, status } = useSelector((state) => state.auth);

  

  const loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      const { email, password } = values;
      const action = await dispatch(loginUserThunk({ email, password }));
      if (action.meta.requestStatus === "fulfilled") {
        localStorage.setItem("token", action.payload.token);
        navigate("/message"); 
      }
    },
  });

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-1/2 flex flex-col justify-center items-center gap-2 px-4 py-2 bg-[#F8F8F8] rounded-md">
        <h1 className="font-bold">Login</h1>
        <form onSubmit={loginFormik.handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              onChange={loginFormik.handleChange}
              onBlur={loginFormik.handleBlur}
              value={loginFormik.values.email}
            />
            {loginFormik.touched.email && loginFormik.errors.email && (
              <div className="text-red-500">{loginFormik.errors.email}</div>
            )}
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              onChange={loginFormik.handleChange}
              onBlur={loginFormik.handleBlur}
              value={loginFormik.values.password}
            />
            {loginFormik.touched.password && loginFormik.errors.password && (
              <div className="text-red-500">{loginFormik.errors.password}</div>
            )}
          </div>

          <button type="submit" className="py-2 px-4 bg-black rounded-md text-white">
            Login
          </button>
        </form>

        <h3>
          Don't have an account? <a href="/register">Register</a>
        </h3>
      </div>

      {status === "loading" && (
        <div className="text-blue-500 mt-2">Login...</div>
      )}
      {status === "failed" && (
        <div className="text-red-500 mt-2">Login failed. Please try again.</div>
      )}
    </div>
  );
};

export default Register;
