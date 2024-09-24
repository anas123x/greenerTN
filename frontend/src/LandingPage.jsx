import { useState } from 'react';
import img from './images/co2.png'; // Assuming the CO2 image is stored here

const LandingPage = () => {
  // State to manage the expansion of each section
  const [expanded, setExpanded] = useState({
    journey: false,
    vehicle: false,
    eco: false,
  });

  // Function to toggle expansion
  const toggleExpand = (section, e) => {
    e.preventDefault();
    setExpanded((prevState) => ({
      ...prevState,
      [section]: !prevState[section], // Toggle the specific section
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Section */}
      <header className="flex justify-between items-center p-6 bg-white shadow-xl">
        <h1 className="text-3xl font-extrabold text-gray-800">
          greener<span className="text-green-600">Tn</span>
        </h1>
        <nav className="space-x-6 text-lg text-gray-600">
          <a href="/home" className="hover:text-green-600 text-green-400 font-semibold">Home</a>
          <a href="/dashboard" className="hover:text-green-600">Dashboard</a>
        </nav>
        <div className="flex space-x-4 items-center">
          <a href="/signin" className="text-lg text-gray-600 hover:text-green-600">Sign in</a>
          <a href="/signup" className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">Create free account</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between py-16 px-8 md:px-32 bg-gradient-to-r from-green-50 to-white">
        <div className="space-y-6 md:w-1/2 text-center md:text-left">
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight">
            Reduce <span className="text-green-600">Your Carbon Footprint,</span> One Journey at a Time
          </h2>
          <p className="text-gray-600 text-xl leading-relaxed">
            Join us in making eco-friendly travel choices that benefit you and the planet.
          </p>
          <div className="flex justify-center md:justify-start">
            <a href="#" className="bg-green-600 text-white py-3 px-8 rounded-md hover:bg-green-700 text-lg font-semibold">Learn More</a>
          </div>
        </div>
        <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center md:justify-end">
          <img src={img} alt="Reduce CO2 vehicle" className="w-full md:w-3/4 h-auto rounded-lg shadow-lg" />
        </div>
      </section>

      {/* Key Features Section */}
      <section className="text-center py-16 bg-white mx-12 rounded-lg shadow-md">
        <h3 className="text-4xl font-extrabold text-gray-800">Key Features</h3>
        <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
          Our platform empowers you to track your journeys, manage your vehicles, and receive personalized eco-friendly suggestions. 
          Whether you're a daily commuter or an occasional traveler, we help you make smarter, greener choices.
        </p>
        <div className="mt-10 flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-8">
          
          {/* Journey Management Section */}
          <div className={`p-6 rounded-md shadow-md w-full md:w-1/3 ${expanded.journey ? 'bg-green-50' : 'bg-white'}`}>
            <h4 className="text-2xl font-bold text-green-600">Journey Management</h4>
            <p className="text-gray-600 mt-4 text-lg">Track your journeys and reduce your environmental impact.</p>
            <a 
              href="#" 
              onClick={(e) => toggleExpand('journey', e)} 
              className="inline-flex items-center text-green-600 mt-4 hover:underline text-lg">
              {expanded.journey ? 'Show Less' : 'Learn More'} <i className="fa-solid fa-arrow-right ml-2"></i>
            </a>
            {expanded.journey && (
              <p className="text-gray-600 mt-4 text-lg">
                Detailed journey management features include real-time tracking, carbon footprint analysis, and suggestions for eco-friendly alternatives.
              </p>
            )}
          </div>

          {/* Vehicle Management Section */}
          <div className={`p-6 rounded-md shadow-md w-full md:w-1/3 ${expanded.vehicle ? 'bg-green-50' : 'bg-white'}`}>
            <h4 className="text-2xl font-bold text-green-600">Vehicle Management</h4>
            <p className="text-gray-600 mt-4 text-lg">Optimize your vehicle's eco-performance.</p>
            <a 
              href="#" 
              onClick={(e) => toggleExpand('vehicle', e)} 
              className="inline-flex items-center text-green-600 mt-4 hover:underline text-lg">
              {expanded.vehicle ? 'Show Less' : 'Learn More'} <i className="fa-solid fa-arrow-right ml-2"></i>
            </a>
            {expanded.vehicle && (
              <p className="text-gray-600 mt-4 text-lg">
                Vehicle management helps you monitor fuel efficiency, schedule maintenance, and receive tips on reducing emissions.
              </p>
            )}
          </div>

          {/* Eco Suggestions Section */}
          <div className={`p-6 rounded-md shadow-md w-full md:w-1/3 ${expanded.eco ? 'bg-green-50' : 'bg-white'}`}>
            <h4 className="text-2xl font-bold text-green-600">Eco Suggestions</h4>
            <p className="text-gray-600 mt-4 text-lg">Receive personalized tips for greener travel.</p>
            <a 
              href="#" 
              onClick={(e) => toggleExpand('eco', e)} 
              className="inline-flex items-center text-green-600 mt-4 hover:underline text-lg">
              {expanded.eco ? 'Show Less' : 'Learn More'} <i className="fa-solid fa-arrow-right ml-2"></i>
            </a>
            {expanded.eco && (
              <p className="text-gray-600 mt-4 text-lg">
                Get suggestions tailored to your travel patterns, including alternative routes, public transport options, and eco-friendly habits.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 flex flex-col items-center bg-gray-50">
        <div className="text-left max-w-4xl mx-auto">
          <h3 className="text-4xl font-extrabold text-gray-800">Benefits Section</h3>
          <p className="text-gray-600 mt-4 text-lg leading-relaxed">
            Let’s join our famous class, the knowledge provided will definitely be useful for you.
          </p>
          <ul className="mt-8 font-bold space-y-4 text-gray-600 list-disc list-inside text-lg">
            <li>Stay informed about your carbon emissions.</li>
            <li>Discover sustainable travel practices.</li>
            <li>Contribute to a greener future while enjoying a seamless user experience.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
