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
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required"),
    }),
    onSubmit: async (values, { setFieldError }) => {
      const { email, password } = values;
      const action = await dispatch(loginUserThunk({ email, password }));
    
      if (action.meta.requestStatus === "fulfilled") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("userId", action.payload.user._id);
        navigate("/message");
      } else if (action.meta.requestStatus === "rejected") {
        const errorMessage = action.payload?.message || "Login failed. Please try again.";
        setFieldError("general", errorMessage);
      }
    },
  });

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#012647] p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-[#012647] text-center mb-4">
          Login to Your Account
        </h1>

        <form onSubmit={loginFormik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#012647] mb-1">
              Email:
            </label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#012647]"
              onChange={loginFormik.handleChange}
              onBlur={loginFormik.handleBlur}
              value={loginFormik.values.email}
            />
            {loginFormik.touched.email && loginFormik.errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {loginFormik.errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#012647] mb-1">
              Password:
            </label>
            <input
              type="password"
              name="password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#012647]"
              onChange={loginFormik.handleChange}
              onBlur={loginFormik.handleBlur}
              value={loginFormik.values.password}
            />
            {loginFormik.touched.password && loginFormik.errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {loginFormik.errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#75000e] text-white font-semibold rounded-md hover:bg-[#5b000c] transition duration-200"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Logging in..." : "Login"}
          </button>
        </form>

        {loginFormik.errors.general && (
  <p className="text-red-500 text-sm text-center mt-2">
    {loginFormik.errors.general}
  </p>
)}


        <p className="text-center text-sm text-[#012647] mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-[#75000e] font-semibold hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
