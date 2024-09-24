import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({
    brand: '',
    model: '',
    yearsInUsage: '',
    uniqueId: '',
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newJourney, setNewJourney] = useState({ distance: '', vehicleId: '' });
  const [isAddJourneyModalOpen, setIsAddJourneyModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`
    }
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axiosInstance.get('/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const toggleAddVehicleForm = () => {
    setShowAddVehicleForm(!showAddVehicleForm);
  };

  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle({
      ...newVehicle,
      [name]: value,
    });
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/vehicle', newVehicle);
      setVehicles([...vehicles, response.data]);
      setNewVehicle({ brand: '', model: '', yearsInUsage: '', uniqueId: '' });
      setShowAddVehicleForm(false);
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  const openUpdateVehicleModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateVehicleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedVehicle({
      ...selectedVehicle,
      [name]: value,
    });
  };

  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/vehicle/${selectedVehicle._id}`, selectedVehicle);
      const updatedVehicles = vehicles.map(vehicle =>
        vehicle._id === selectedVehicle._id ? response.data : vehicle
      );
      setVehicles(updatedVehicles);
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error('Error updating vehicle:', error);
    }
  };

  const openAddJourneyModal = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setIsAddJourneyModalOpen(true);
  };

  const handleJourneyInputChange = (e) => {
    const { name, value } = e.target;
    setNewJourney({
      ...newJourney,
      [name]: value,
    });
  };

  const handleAddJourney = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      const response = await axiosInstance.post('/journey', {
        ...newJourney,
        vehicleId: selectedVehicleId,
        date: formattedDate, 

      });
      const updatedVehicles = vehicles.map(vehicle => {
        if (vehicle._id === selectedVehicleId) {
          return {
            ...vehicle,
            journeys: [...(vehicle.journeys || []), response.data],
          };
        }
        return vehicle;
      });
      setVehicles(updatedVehicles);
      setNewJourney({ distance: '', vehicleId: '' });
      setIsAddJourneyModalOpen(false);
    } catch (error) {
      console.error('Error adding journey:', error);
    }
  };

  return (
    <div className="dashboard-container bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center p-6 bg-white shadow">
        <h1 className="text-3xl font-extrabold text-gray-800">
          greener<span className="text-green-600">Tn</span>
        </h1>
        <nav className="space-x-6 text-lg text-gray-600">
          <a href="#" className="hover:text-green-600">Home</a>
          <a href="#" className="hover:text-green-600 text-green-400 font-semibold">Dashboard</a>
        </nav>
        <div className="flex space-x-4 items-center">
          <a href="/signin" className="text-lg text-gray-600 hover:text-green-600">Sign in</a>
          <a href="/signup" className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">Create free account</a>
        </div>
      </header>

      {/* Add Vehicle Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={toggleAddVehicleForm}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
        >
          {showAddVehicleForm ? 'Cancel' : 'Add Vehicle'}
        </button>
      </div>

      {/* Conditionally render the Add Vehicle Form */}
      {showAddVehicleForm && (
        <div className="form-container p-8 bg-white shadow-md mt-8 mx-auto max-w-lg rounded-lg">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">Add a New Vehicle</h2>
          <form onSubmit={handleAddVehicle} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="form-group relative">
                <label htmlFor="brand" className="block text-gray-700 font-bold">Brand</label>
                <i className="fa-solid fa-car-side absolute top-10 left-3 text-gray-400"></i>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={newVehicle.brand}
                  onChange={handleVehicleInputChange}
                  className="w-full pl-10 p-2 border rounded"
                  required
                />
              </div>
              <div className="form-group relative">
                <label htmlFor="model" className="block text-gray-700 font-bold">Model</label>
                <i className="fa-solid fa-car absolute top-10 left-3 text-gray-400"></i>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={newVehicle.model}
                  onChange={handleVehicleInputChange}
                  className="w-full pl-10 p-2 border rounded"
                  required
                />
              </div>
              <div className="form-group relative">
                <label htmlFor="yearsInUsage" className="block text-gray-700 font-bold">Years in Usage</label>
                <i className="fa-solid fa-calendar-alt absolute top-10 left-3 text-gray-400"></i>
                <input
                  type="number"
                  id="yearsInUsage"
                  name="yearsInUsage"
                  value={newVehicle.yearsInUsage}
                  onChange={handleVehicleInputChange}
                  className="w-full pl-10 p-2 border rounded"
                  required
                />
              </div>
              <div className="form-group relative">
                <label htmlFor="uniqueId" className="block text-gray-700 font-bold">Unique ID</label>
                <i className="fa-solid fa-id-card absolute top-10 left-3 text-gray-400"></i>
                <input
                  type="text"
                  id="uniqueId"
                  name="uniqueId"
                  value={newVehicle.uniqueId}
                  onChange={handleVehicleInputChange}
                  className="w-full pl-10 p-2 border rounded"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition duration-300"
            >
              Add Vehicle
            </button>
          </form>
        </div>
      )}

      {/* Vehicle List */}
      <div className="vehicle-list p-8 mt-8 mx-4 md:mx-32">
        <h2 className="text-2xl font-bold text-emerald-900 mb-6">Vehicles List</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vehicles.map(vehicle => (
            <div key={vehicle._id} className="vehicle-card bg-white p-6 rounded shadow-md relative">
              {/* Update Vehicle Button */}
              <button
                onClick={() => openUpdateVehicleModal(vehicle)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              >
                <i className="fa-solid fa-pen"></i>
              </button>
              <h3 className="text-lg font-bold text-gray-700">{vehicle.brand} {vehicle.model}</h3>
              <p className="text-gray-600">Years in Use: {vehicle.yearsInUsage}</p>

              {/* Display Journeys */}
               { vehicles && vehicle.journeys   ? (
                <div className="mt-4">
                  <h4 className="text-md font-bold text-gray-700">Journeys:</h4>
                  <ul className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                    {vehicle.journeys.map(journey => (
                      <li key={journey._id} className="bg-gray-100 p-2 rounded shadow-sm">
                        <span className="block text-gray-600">Distance: {journey.distance} km</span>
                        <span className="block text-gray-500 text-sm">Date: {journey.date}</span>
                        <span className="block text-gray-500 text-sm">Carbon Emission: {journey.carbonEmission}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-600 mt-4">No journeys available.</p>
              )}

              {/* Add Journey Button */}
              <button
                onClick={() => openAddJourneyModal(vehicle._id)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600 transition"
              >
                <i className="fa-solid fa-road mr-2"></i>Add Journey
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Update Vehicle Modal */}
      {isUpdateModalOpen && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="modal-content bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Update Vehicle</h2>
            <form onSubmit={handleUpdateVehicle} className="space-y-4">
              <div className="form-group">
                <label htmlFor="brand" className="block text-gray-700 font-bold">Brand</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={selectedVehicle.brand}
                  onChange={handleUpdateVehicleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="model" className="block text-gray-700 font-bold">Model</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={selectedVehicle.model}
                  onChange={handleUpdateVehicleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="yearsInUsage" className="block text-gray-700 font-bold">Years in Usage</label>
                <input
                  type="number"
                  id="yearsInUsage"
                  name="yearsInUsage"
                  value={selectedVehicle.yearsInUsage}
                  onChange={handleUpdateVehicleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="uniqueId" className="block text-gray-700 font-bold">Unique ID</label>
                <input
                  type="text"
                  id="uniqueId"
                  name="uniqueId"
                  value={selectedVehicle.uniqueId}
                  onChange={handleUpdateVehicleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded shadow-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded shadow-lg hover:bg-emerald-700 transition"
                >
                  Update Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Journey Modal */}
      {isAddJourneyModalOpen && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="modal-content bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Add a New Journey</h2>
            <form onSubmit={handleAddJourney} className="space-y-4">
              <div className="form-group">
                <label htmlFor="distance" className="block text-gray-700 font-bold">Distance (km)</label>
                <input
                  type="number"
                  id="distance"
                  name="distance"
                  value={newJourney.distance}
                  onChange={handleJourneyInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddJourneyModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded shadow-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600 transition"
                >
                  Add Journey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tips and Tricks Section */}
      <div className="flex flex-col items-center p-8 mt-8 mx-4 md:mx-32 bg-white shadow-lg">
        <h2 className="text-2xl font-bold text-emerald-900 mb-4">Tips and Tricks to Limit Your Carbon Emissions</h2>
        <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
          <li>Maintain your vehicle regularly to ensure it runs efficiently.</li>
          <li>Consider carpooling or using public transportation whenever possible.</li>
          <li>Plan your trips to avoid unnecessary driving.</li>
          <li>Switch off your engine when idling for long periods.</li>
          <li>Choose eco-friendly driving habits, like gradual acceleration and braking.</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;