import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerUserThunk } from "../redux/features/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, status } = useSelector((state) => state.auth);

  const registerFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Password confirmation is required"),
    }),
    onSubmit: async (values) => {
      const { name, email, password } = values;
      const action = await dispatch(registerUserThunk({ name, email, password }));
      if (action.meta.requestStatus === "fulfilled") {
        navigate("/"); 
      }
    },
  });

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-1/2 flex flex-col justify-center items-center gap-2 px-4 py-2 bg-[#F8F8F8] rounded-md">
        <h1 className="font-bold">Register</h1>
        <form onSubmit={registerFormik.handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              onChange={registerFormik.handleChange}
              onBlur={registerFormik.handleBlur}
              value={registerFormik.values.name}
            />
            {registerFormik.touched.name && registerFormik.errors.name && (
              <div className="text-red-500">{registerFormik.errors.name}</div>
            )}
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              onChange={registerFormik.handleChange}
              onBlur={registerFormik.handleBlur}
              value={registerFormik.values.email}
            />
            {registerFormik.touched.email && registerFormik.errors.email && (
              <div className="text-red-500">{registerFormik.errors.email}</div>
            )}
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              onChange={registerFormik.handleChange}
              onBlur={registerFormik.handleBlur}
              value={registerFormik.values.password}
            />
            {registerFormik.touched.password && registerFormik.errors.password && (
              <div className="text-red-500">{registerFormik.errors.password}</div>
            )}
          </div>

          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              onChange={registerFormik.handleChange}
              onBlur={registerFormik.handleBlur}
              value={registerFormik.values.confirmPassword}
            />
            {registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword && (
              <div className="text-red-500">{registerFormik.errors.confirmPassword}</div>
            )}
          </div>

          <button type="submit" className="py-2 px-4 bg-black rounded-md text-white">
            Register
          </button>
        </form>

        <h3>
          Already have an account? <a href="/">Login</a>
        </h3>
      </div>

      {status === "loading" && (
        <div className="text-blue-500 mt-2">Registering...</div>
      )}
      {status === "failed" && (
        <div className="text-red-500 mt-2">Registration failed. Please try again.</div>
      )}
    </div>
  );
};

export default Register;
