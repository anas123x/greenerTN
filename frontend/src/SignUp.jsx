import React, { useState } from 'react';
import axios from 'axios';
import img from './images/signup.png';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validateForm = () => {
    let formErrors = {};

    // Validate first and last name
    if (!formData.firstName) formErrors.firstName = 'First name is required';
    if (!formData.lastName) formErrors.lastName = 'Last name is required';

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      formErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      formErrors.email = 'Email is not valid';
    }

    // Validate password
    if (!formData.password) {
      formErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      formErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.confirmPassword !== formData.password) {
      formErrors.confirmPassword = 'Passwords do not match';
    }

    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const response = await axios.post('http://localhost:3000/signup', {
        email: formData.email,
        password: formData.password,
        username: `${formData.firstName} ${formData.lastName}`,
        fullName: `${formData.firstName} ${formData.lastName}`,
      });

      setSuccessMessage(response.data.message);
      console.log('Form submitted:', response.data);
    } catch (error) {
      console.error('Error submitting form:', error.response.data);
      setErrors({ submit: error.response.data.error });
    }
  };

  const evaluatePasswordStrength = (password) => {
    if (password.length < 8) {
      setPasswordStrength('weak');
    } else if (/[A-Z]/.test(password) && /[0-9]/.test(password)) {
      setPasswordStrength('strong');
    } else {
      setPasswordStrength('medium');
    }
  };

  const handlePasswordChange = (e) => {
    handleChange(e);
    evaluatePasswordStrength(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col md:flex-row w-full">
        <div className="bg-white rounded-lg p-8 mx-36 flex-grow">
          <div className="flex justify-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              greener<span className="text-green-600">Tn</span>
            </h1>
          </div>
          <h2 className="text-5xl text-center font-bold text-gray-800 mb-6">
            Create an account
          </h2>
          <p className="text-gray-500 mb-4">
            Already have an account? <a href="signin" className="text-green-600">Log in</a>
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex space-x-4">
              <div className="w-1/2 relative">
                <label className="block mb-2 text-sm font-medium text-gray-600">First name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <i className="fa-solid fa-user text-gray-400"></i>
                  </span>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 ${
                      errors.firstName ? 'border-red-500' : ''
                    }`}
                    placeholder="First name"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>
              </div>
              <div className="w-1/2 relative">
                <label className="block mb-2 text-sm font-medium text-gray-600">Last name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <i className="fa-solid fa-user text-gray-400"></i>
                  </span>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 ${
                      errors.lastName ? 'border-red-500' : ''
                    }`}
                    placeholder="Last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
              </div>
            </div>

            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-gray-600">Email address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fa-solid fa-envelope text-gray-400"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  placeholder="example@gmail.com"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-1/2 relative">
                <label className="block mb-2 text-sm font-medium text-gray-600">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <i className="fa-solid fa-lock text-gray-400"></i>
                  </span>
                  <input
                    type={formData.showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    className={`w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                    placeholder="********"
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                  <p className={`mt-1 text-sm ${passwordStrength === 'strong' ? 'text-green-600' : passwordStrength === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                    Password strength: {passwordStrength}
                  </p>
                </div>
              </div>

              <div className="w-1/2 relative">
                <label className="block mb-2 text-sm font-medium text-gray-600">Confirm Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <i className="fa-solid fa-lock text-gray-400"></i>
                  </span>
                  <input
                    type={formData.showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                    placeholder="********"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="showPassword"
                checked={formData.showPassword}
                onChange={handleChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label className="ml-2 block text-sm text-gray-600">Show password</label>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
              disabled={Object.keys(errors).length > 0 || !formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword}
            >
              Sign up
            </button>
            {errors.submit && <p className="text-red-500 text-sm mt-4">{errors.submit}</p>}
            {successMessage && <p className="text-green-500 text-sm mt-4">{successMessage}</p>}
          </form>
        </div>

        <div className="hidden md:block h-screen">
          <img
            src={img}
            alt="People working on laptops"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;