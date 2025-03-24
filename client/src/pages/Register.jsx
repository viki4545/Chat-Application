import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerUserThunk } from "../redux/features/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);

  const registerFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
      confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Password confirmation is required"),
    }),
    onSubmit: async (values, {setFieldError}) => {
      const { name, email, password } = values;
      const action = await dispatch(registerUserThunk({ name, email, password }));
      if (action.meta.requestStatus === "fulfilled") {
        navigate("/");
      } else if (action.meta.requestStatus === "rejected") {
        const errorMessage = action.payload?.message || "Login failed. Please try again.";
        setFieldError("general", errorMessage);
      }
    },
  });

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#012647] p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-[#012647] text-center mb-4">Create an Account</h1>

        <form onSubmit={registerFormik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#012647] mb-1">Name:</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#012647]"
              onChange={registerFormik.handleChange}
              onBlur={registerFormik.handleBlur}
              value={registerFormik.values.name}
            />
            {registerFormik.touched.name && registerFormik.errors.name && (
              <p className="text-red-500 text-xs mt-1">{registerFormik.errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#012647] mb-1">Email:</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#012647]"
              onChange={registerFormik.handleChange}
              onBlur={registerFormik.handleBlur}
              value={registerFormik.values.email}
            />
            {registerFormik.touched.email && registerFormik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{registerFormik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#012647] mb-1">Password:</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#012647]"
              onChange={registerFormik.handleChange}
              onBlur={registerFormik.handleBlur}
              value={registerFormik.values.password}
            />
            {registerFormik.touched.password && registerFormik.errors.password && (
              <p className="text-red-500 text-xs mt-1">{registerFormik.errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#012647] mb-1">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#012647]"
              onChange={registerFormik.handleChange}
              onBlur={registerFormik.handleBlur}
              value={registerFormik.values.confirmPassword}
            />
            {registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{registerFormik.errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#75000e] text-white font-semibold rounded-md hover:bg-[#5b000c] transition duration-200"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Registering..." : "Register"}
          </button>
        </form>

        {registerFormik.errors.general && (
  <p className="text-red-500 text-sm text-center mt-2">
    {registerFormik.errors.general}
  </p>
)}

        <p className="text-center text-sm text-[#012647] mt-4">
          Already have an account? <a href="/" className="text-[#75000e] font-semibold hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;