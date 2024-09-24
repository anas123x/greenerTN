import { useState } from 'react';
import axios from 'axios';
import img from './images/car-co2.jpg'; // Assuming the image is stored here
import { useNavigate } from 'react-router-dom';
const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    showPassword: false,
  });
  const navigate = useNavigate()
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email: formData.email,
        password: formData.password,
      });

      setSuccessMessage(response.data.message);
      console.log('Form submitted:', response.data);
      localStorage.setItem('token', response.data.token);
      navigate("/dashboard")
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.response.data.error });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="flex w-full max-w-6xl">
        {/* Left side with image */}
        <div className="hidden lg:flex items-center justify-center w-1/2 bg-white">
          <img src={img} alt="CO2 car" className="h-3/4" />
        </div>

        {/* Right side with login form */}
        <div className="flex flex-col w-full lg:w-1/2 bg-white rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
            Welcome to <span className="text-green-600">greenerTn</span>
          </h1>

          {/* Social Login Buttons */}
          <div className="space-y-4">
            <button className="flex items-center justify-center w-full py-3 border rounded-md hover:bg-gray-100 transition">
              <i className="fa-brands fa-google mr-3 text-red-500"></i>
              Login with Google
            </button>
            <button className="flex items-center justify-center w-full py-3 border rounded-md hover:bg-gray-100 transition">
              <i className="fa-brands fa-facebook-f mr-3 text-blue-600"></i>
              Login with Facebook
            </button>
          </div>

          <div className="flex items-center justify-center my-6">
            <span className="border-b w-1/4 lg:w-1/5"></span>
            <span className="text-gray-500 mx-2">OR</span>
            <span className="border-b w-1/4 lg:w-1/5"></span>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative">
              <i className="fa-solid fa-envelope absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"></i>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="example@gmail.com"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <i className="fa-solid fa-lock absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"></i>
              <input
                type={formData.showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Password"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label className="ml-2 text-sm text-gray-600">Remember me</label>
              </div>
              <a href="#" className="text-sm text-green-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition"
            >
              Login
            </button>
            {errors.submit && <p className="text-red-500 text-sm mt-4">{errors.submit}</p>}
            {successMessage && <p className="text-green-500 text-sm mt-4">{successMessage}</p>}
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-green-600 hover:underline">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;