"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  FiHome,
  FiCalendar,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiUser,
  FiMapPin,
  FiPhone,
  FiSearch,
  FiFilter,
  FiPlus,
} from "react-icons/fi";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AdminPanel() {

  const [newDog, setNewDog] = useState({
    name: "",
    breed: "",
    age: "",
    gender: "",
    location: "",
    contactNumber: "",
    ownerName: "",
    status: "AVAILABLE",
    imageUrl: "/images/dog-placeholder.jpg",
  });
  const [isAddingDog, setIsAddingDog] = useState(false);
  const [dogImage, setDogImage] = useState(null);
  const [dogImagePreview, setDogImagePreview] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [actionSuccess, setActionSuccess] = useState(false);

  const handleDogImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDogImage(file);
      setDogImagePreview(URL.createObjectURL(file));
    }
  };
 
  const handleDogInputChange = (e) => {
    const { name, value } = e.target;
    setNewDog((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDog = async (e) => {
    e.preventDefault();
    setIsAddingDog(true);

    try {
  
      const formData = new FormData();
      formData.append("name", newDog.name);
      formData.append("breed", newDog.breed);
      formData.append("age", newDog.age);
      formData.append("gender", newDog.gender);
      formData.append("location", newDog.location);
      formData.append("contactNumber", newDog.contactNumber);
      formData.append("ownerName", newDog.ownerName);
      formData.append("status", newDog.status);

      if (dogImage) {
        formData.append("dogImage", dogImage);
      } else {
        formData.append("imageUrl", "/images/dog-placeholder.jpg");
      }

      const response = await fetch("/api/admin/dogs", {
        method: "POST",
        body: formData, 
      });

      if (!response.ok) {
        throw new Error("Failed to add dog");
      }

      
      setNewDog({
        name: "",
        breed: "",
        age: "",
        gender: "",
        location: "",
        contactNumber: "",
        ownerName: "",
        status: "AVAILABLE",
        imageUrl: "/images/dog-placeholder.jpg",
      });
      setDogImage(null);
      setDogImagePreview("");

      

      setSuccessMessage("Dog added successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAddingDog(false);
    }
  };
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/login");
    },
  });

  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("view");
  const [modalFormData, setModalFormData] = useState({
    status: "",
    homeVisitDate: "",
    finalVisitDate: "",
  });

  useEffect(() => {
    const checkAdmin = async () => {
      if (status === "loading") return;

      console.log("Admin page - session:", session);

      
      const isAdmin =
        session?.user?.role === "ADMIN" ||
        session?.user?.email === "admin@adoptapaw.com";

      if (!isAdmin) {
        router.push("/home");
      } else {
        await fetchApplications();
      }
    };

    checkAdmin();
  }, [session, status, router]);

  const showSuccessMessage = (action) => {
    setActionSuccess(true);
    setSuccessMessage(`Successfully ${action} application`);

    setTimeout(() => {
      setActionSuccess(false);
      closeModal();
    }, 1500);
  };

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
     
      const response = await fetch(`/api/admin/applications?t=${Date.now()}`, {
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      console.log("Applications response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch applications");
      }

      const data = await response.json();
      console.log(`Fetched ${data.length} applications`);
      setApplications(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching applications:", err);
      
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  
  const handleStatusChange = async (id, newStatus, visitDate = null) => {
    try {
      console.log(`Updating application ${id} to status ${newStatus}`);
      setError(null);

      
      const requestBody = {
        status: newStatus,
      };

     
      if (newStatus === "HOME_VISIT_SCHEDULED" && visitDate) {
        requestBody.homeVisitDate = visitDate;
      } else if (newStatus === "FINAL_VISIT_SCHEDULED" && visitDate) {
        requestBody.finalVisitDate = visitDate;
      }

      console.log("Request body:", requestBody);

      const response = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error response:", responseData);
        throw new Error(
          responseData.message || "Failed to update application status"
        );
      } else {
        successMessage && (
          <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md">
            {successMessage}
          </div>
        );
      }

      console.log("Success response:", responseData);

      
      setSuccessMessage(`Application status updated to ${newStatus}`);
      setTimeout(() => setSuccessMessage(""), 3000);

     
      await fetchApplications();
      closeModal();
    } catch (err) {
      setError(err.message);
      console.error("Error updating status:", err);
    }
  };

  const handleView = (application) => {
    setSelectedApplication(application);
    setModalType("view");
    setShowModal(true);
  };

  const handleScheduleHomeVisit = (application) => {
    setSelectedApplication(application);
    setModalType("homeVisit");
    setModalFormData({
      ...modalFormData,
      status: "HOME_VISIT_SCHEDULED",
      homeVisitDate: "",
    });
    setShowModal(true);
  };

  const handleCompleteHomeVisit = async (id) => {
    console.log("Completing home visit for application:", id);
    await handleStatusChange(id, "HOME_VISIT_COMPLETED");
  };

  const handleScheduleFinalVisit = (application) => {
    setSelectedApplication(application);
    setModalType("finalVisit");
    setModalFormData({
      ...modalFormData,
      status: "FINAL_VISIT_SCHEDULED",
      finalVisitDate: "",
    });
    setShowModal(true);
  };

  const handleCompleteAdoption = async (id) => {
    console.log("Completing adoption for application:", id);
    await handleStatusChange(id, "COMPLETED");
  };
  const handleRejectApplication = async (id) => {
    console.log("Rejecting application:", id);
    await handleStatusChange(id, "REJECTED");
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (modalType === "homeVisit") {
        await handleStatusChange(
          selectedApplication.id,
          "HOME_VISIT_SCHEDULED",
          modalFormData.homeVisitDate
        );
      } else if (modalType === "finalVisit") {
        await handleStatusChange(
          selectedApplication.id,
          "FINAL_VISIT_SCHEDULED",
          modalFormData.finalVisitDate
        );
      }
    } catch (error) {
      setError(`Failed to update application: ${error.message}`);
     
      return;
    }

   
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
    setModalFormData({
      status: "",
      homeVisitDate: "",
      finalVisitDate: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const filteredApplications =
    applications && applications.length > 0
      ? applications.filter((app) => {
          const matchesSearch =
            app.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.user.phone.includes(searchTerm) ||
            app.user.address.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesStatus =
            statusFilter === "all" || app.status === statusFilter;

          return matchesSearch && matchesStatus;
        })
      : [];

  const getStatusBadge = (status) => {
    const statusMap = {
      SUBMITTED: {
        color: "bg-blue-100 text-blue-800",
        text: "Submitted",
      },
      HOME_VISIT_SCHEDULED: {
        color: "bg-yellow-100 text-yellow-800",
        text: "Home Visit Scheduled",
      },
      HOME_VISIT_COMPLETED: {
        color: "bg-indigo-100 text-indigo-800",
        text: "Home Visit Completed",
      },
      FINAL_VISIT_SCHEDULED: {
        color: "bg-purple-100 text-purple-800",
        text: "Final Visit Scheduled",
      },
      COMPLETED: {
        color: "bg-green-100 text-green-800",
        text: "Completed",
      },
      REJECTED: {
        color: "bg-red-100 text-red-800",
        text: "Rejected",
      },
    };

    const { color, text } = statusMap[status] || {
      color: "bg-gray-100 text-gray-800",
      text: status,
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${color}`}>
        {text}
      </span>
    );
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary-500 rounded-full border-t-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (session?.user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-20">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Admin Dashboard
          </h1>

          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Add New Dog
              </h2>

              <form onSubmit={handleAddDog} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="input-label">
                      Dog Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newDog.name}
                      onChange={handleDogInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="breed" className="input-label">
                      Breed
                    </label>
                    <input
                      type="text"
                      id="breed"
                      name="breed"
                      value={newDog.breed}
                      onChange={handleDogInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="age" className="input-label">
                      Age
                    </label>
                    <input
                      type="text"
                      id="age"
                      name="age"
                      value={newDog.age}
                      onChange={handleDogInputChange}
                      className="input-field"
                      placeholder="e.g. 2 years"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="input-label">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={newDog.gender}
                      onChange={handleDogInputChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="location" className="input-label">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={newDog.location}
                      onChange={handleDogInputChange}
                      className="input-field"
                      placeholder="e.g. Bangalore"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contactNumber" className="input-label">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      id="contactNumber"
                      name="contactNumber"
                      value={newDog.contactNumber}
                      onChange={handleDogInputChange}
                      className="input-field"
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="ownerName" className="input-label">
                      Shelter/Owner Name
                    </label>
                    <input
                      type="text"
                      id="ownerName"
                      name="ownerName"
                      value={newDog.ownerName}
                      onChange={handleDogInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="input-label">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={newDog.status}
                      onChange={handleDogInputChange}
                      className="input-field"
                      required
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="ADOPTED">Adopted</option>
                    </select>
                  </div>

                  <div className="flex justify-center">
                    <div className="col-span-2">
                      <label htmlFor="dogImage" className="input-label">
                        Dog Image
                      </label>
                      <div className="mt-1 flex items-center space-x-5">
                        <div className="flex-shrink-0 h-20 w-20 bg-gray-100 rounded-md overflow-hidden">
                          {dogImagePreview ? (
                            <img
                              src={dogImagePreview}
                              alt="Dog preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="40"
                                height="40"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M3 4.5a.5.5 0 0 1 1 0v9a.5.5 0 0 1-1 0v-9zm1-.5a1 1 0 0 0-1 1v9a1 1 0 0 0 2 0v-9a1 1 0 0 0-1-1zm10.336 0a.5.5 0 0 0-.5.5v1.293l-.647-.647a.5.5 0 1 0-.707.707l.647.647-9.393 9.393a.5.5 0 1 0 .707.707l9.393-9.393.647.647a.5.5 0 1 0 .707-.707l-.647-.647V4.5a.5.5 0 0 0-.5-.5H4.334a.5.5 0 0 0 0 1h6.086v6H5.5a.5.5 0 0 0 0 1h5.086V13a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V5.5a.5.5 0 0 0-.5-.5h-2.751z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          id="dogImage"
                          name="dogImage"
                          accept="image/*"
                          onChange={handleDogImageChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="dogImage"
                          className="btn-secondary cursor-pointer"
                        >
                          {dogImage ? "Change Image" : "Upload Image"}
                        </label>
                        <span className="text-xs text-gray-500">
                          {!dogImage &&
                            "If no image is uploaded, a placeholder will be used."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary mt-4"
                  disabled={isAddingDog}
                >
                  {isAddingDog ? "Adding..." : "Add Dog"}
                </button>
              </form>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Adoption Applications
              </h2>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-grow relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, dog, phone, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10 w-full"
                  />
                </div>

                <div className="md:w-64">
                  <div className="flex items-center h-full">
                    <FiFilter className="mr-2 text-gray-500" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="input-field w-full"
                    >
                      <option value="all">All Statuses</option>
                      <option value="SUBMITTED">Submitted</option>
                      <option value="HOME_VISIT_SCHEDULED">
                        Home Visit Scheduled
                      </option>
                      <option value="HOME_VISIT_COMPLETED">
                        Home Visit Completed
                      </option>
                      <option value="FINAL_VISIT_SCHEDULED">
                        Final Visit Scheduled
                      </option>
                      <option value="COMPLETED">Completed</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Applicant
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Dog
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Verification
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No applications found
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {application.user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {application.user.phone}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {application.dog.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.dog.breed}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(application.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {application.user.verified ? (
                              <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                                Verified
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                                Not Verified
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(application.createdAt).toLocaleDateString(
                              "en-IN"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleView(application)}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                View
                              </button>

                              {application.status === "SUBMITTED" && (
                                <button
                                  onClick={() =>
                                    handleScheduleHomeVisit(application)
                                  }
                                  className="text-yellow-600 hover:text-yellow-900"
                                >
                                  Schedule Visit
                                </button>
                              )}

                              {application.status ===
                                "HOME_VISIT_SCHEDULED" && (
                                <button
                                  onClick={() =>
                                    handleCompleteHomeVisit(application.id)
                                  }
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Mark Completed
                                </button>
                              )}

                              {application.status ===
                                "HOME_VISIT_COMPLETED" && (
                                <button
                                  onClick={() =>
                                    handleScheduleFinalVisit(application)
                                  }
                                  className="text-purple-600 hover:text-purple-900"
                                >
                                  Schedule Final
                                </button>
                              )}

                              {application.status ===
                                "FINAL_VISIT_SCHEDULED" && (
                                <button
                                  onClick={() =>
                                    handleCompleteAdoption(application.id)
                                  }
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Complete
                                </button>
                              )}

                              {[
                                "SUBMITTED",
                                "HOME_VISIT_SCHEDULED",
                                "HOME_VISIT_COMPLETED",
                                "FINAL_VISIT_SCHEDULED",
                              ].includes(application.status) && (
                                <button
                                  onClick={() =>
                                    handleRejectApplication(application.id)
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Reject
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Scheduled Home Visits
                </h2>

                <ul className="divide-y divide-gray-200">
                  {filteredApplications
                    .filter((app) => app.status === "HOME_VISIT_SCHEDULED")
                    .map((app) => (
                      <li key={`home-${app.id}`} className="py-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{app.user.name}</p>
                            <p className="text-sm text-gray-500">
                              {app.dog.name} ({app.dog.breed})
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {new Date(app.homeVisitDate).toLocaleDateString(
                                "en-IN"
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(app.homeVisitDate).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-start">
                            <FiMapPin className="mt-1 h-4 w-4 text-gray-400 mr-2" />
                            <p className="text-sm text-gray-600">
                              {app.user.address}
                            </p>
                          </div>
                          <div className="flex items-center mt-1">
                            <FiPhone className="h-4 w-4 text-gray-400 mr-2" />
                            <p className="text-sm text-gray-600">
                              {app.user.phone}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => handleCompleteHomeVisit(app.id)}
                            className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200"
                          >
                            Mark Completed
                          </button>
                          <button
                            onClick={() => handleRejectApplication(app.id)}
                            className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                          >
                            Reject
                          </button>
                        </div>
                      </li>
                    ))}

                  {filteredApplications.filter(
                    (app) => app.status === "HOME_VISIT_SCHEDULED"
                  ).length === 0 && (
                    <li className="py-4 text-center text-gray-500">
                      No scheduled home visits
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Scheduled Final Visits
                </h2>

                <ul className="divide-y divide-gray-200">
                  {filteredApplications
                    .filter((app) => app.status === "FINAL_VISIT_SCHEDULED")
                    .map((app) => (
                      <li key={`final-${app.id}`} className="py-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{app.user.name}</p>
                            <p className="text-sm text-gray-500">
                              {app.dog.name} ({app.dog.breed})
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {new Date(app.finalVisitDate).toLocaleDateString(
                                "en-IN"
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(app.finalVisitDate).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center">
                            <FiPhone className="h-4 w-4 text-gray-400 mr-2" />
                            <p className="text-sm text-gray-600">
                              {app.user.phone}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => handleCompleteAdoption(app.id)}
                            className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
                          >
                            Complete Adoption
                          </button>
                          <button
                            onClick={() => handleRejectApplication(app.id)}
                            className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                          >
                            Reject
                          </button>
                        </div>
                      </li>
                    ))}

                  {filteredApplications.filter(
                    (app) => app.status === "FINAL_VISIT_SCHEDULED"
                  ).length === 0 && (
                    <li className="py-4 text-center text-gray-500">
                      No scheduled final visits
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {modalType === "view" && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Application Details
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Dog Information
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p>
                          <span className="font-medium">Name:</span>{" "}
                          {selectedApplication.dog.name}
                        </p>
                        <p>
                          <span className="font-medium">Breed:</span>{" "}
                          {selectedApplication.dog.breed}
                        </p>
                        <p>
                          <span className="font-medium">Age:</span>{" "}
                          {selectedApplication.dog.age}
                        </p>
                        <p>
                          <span className="font-medium">Gender:</span>{" "}
                          {selectedApplication.dog.gender === "MALE"
                            ? "Male"
                            : "Female"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Applicant Information
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p>
                          <span className="font-medium">Name:</span>{" "}
                          {selectedApplication.user.name}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span>{" "}
                          {selectedApplication.user.email}
                        </p>
                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          {selectedApplication.user.phone}
                        </p>
                        <p>
                          <span className="font-medium">Address:</span>{" "}
                          {selectedApplication.user.address}
                        </p>
                        <p className="mt-2">
                          <span className="font-medium">
                            Verification Status:
                          </span>{" "}
                          {selectedApplication.user.verified ? (
                            <span className="text-green-600">Verified</span>
                          ) : (
                            <span className="text-red-600">Not Verified</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Application Status
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p>
                          <span className="font-medium">Current Status:</span>{" "}
                          {getStatusBadge(selectedApplication.status)}
                        </p>
                        <p>
                          <span className="font-medium">Applied On:</span>{" "}
                          {new Date(
                            selectedApplication.createdAt
                          ).toLocaleString("en-IN")}
                        </p>

                        {selectedApplication.homeVisitDate && (
                          <p>
                            <span className="font-medium">
                              Home Visit Scheduled For:
                            </span>{" "}
                            {new Date(
                              selectedApplication.homeVisitDate
                            ).toLocaleString("en-IN")}
                          </p>
                        )}

                        {selectedApplication.finalVisitDate && (
                          <p>
                            <span className="font-medium">
                              Final Visit Scheduled For:
                            </span>{" "}
                            {new Date(
                              selectedApplication.finalVisitDate
                            ).toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.status === "SUBMITTED" && (
                        <button
                          onClick={() => {
                            closeModal();
                            handleScheduleHomeVisit(selectedApplication);
                          }}
                          className="btn-primary text-sm"
                        >
                          Schedule Home Visit
                        </button>
                      )}

                      {selectedApplication.status ===
                        "HOME_VISIT_SCHEDULED" && (
                        <button
                          onClick={() => {
                            closeModal();
                            handleCompleteHomeVisit(selectedApplication.id);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 text-sm"
                        >
                          Mark Home Visit Complete
                        </button>
                      )}

                      {selectedApplication.status ===
                        "HOME_VISIT_COMPLETED" && (
                        <button
                          onClick={() => {
                            closeModal();
                            handleScheduleFinalVisit(selectedApplication);
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 text-sm"
                        >
                          Schedule Final Visit
                        </button>
                      )}

                      {selectedApplication.status ===
                        "FINAL_VISIT_SCHEDULED" && (
                        <button
                          onClick={() => {
                            closeModal();
                            handleCompleteAdoption(selectedApplication.id);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 text-sm"
                        >
                          Complete Adoption
                        </button>
                      )}

                      {[
                        "SUBMITTED",
                        "HOME_VISIT_SCHEDULED",
                        "HOME_VISIT_COMPLETED",
                        "FINAL_VISIT_SCHEDULED",
                      ].includes(selectedApplication.status) && (
                        <button
                          onClick={() => {
                            closeModal();
                            handleRejectApplication(selectedApplication.id);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 text-sm"
                        >
                          Reject Application
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}

              {modalType === "homeVisit" && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Schedule Home Visit
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>

                  <form onSubmit={handleModalSubmit} className="space-y-6">
                    <div>
                      <p className="mb-2">
                        <span className="font-medium">Applicant:</span>{" "}
                        {selectedApplication.user.name}
                      </p>
                      <p className="mb-2">
                        <span className="font-medium">Dog:</span>{" "}
                        {selectedApplication.dog.name} (
                        {selectedApplication.dog.breed})
                      </p>
                      <p className="mb-4">
                        <span className="font-medium">Address:</span>{" "}
                        {selectedApplication.user.address}
                      </p>
                    </div>

                    <div>
                      <label htmlFor="homeVisitDate" className="input-label">
                        Home Visit Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        id="homeVisitDate"
                        name="homeVisitDate"
                        value={modalFormData.homeVisitDate}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        Schedule Visit
                      </button>
                    </div>
                  </form>
                </>
              )}

              {modalType === "finalVisit" && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Schedule Final Visit
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>

                  <form onSubmit={handleModalSubmit} className="space-y-6">
                    <div>
                      <p className="mb-2">
                        <span className="font-medium">Applicant:</span>{" "}
                        {selectedApplication.user.name}
                      </p>
                      <p className="mb-2">
                        <span className="font-medium">Dog:</span>{" "}
                        {selectedApplication.dog.name} (
                        {selectedApplication.dog.breed})
                      </p>
                      <p className="mb-4">
                        <span className="font-medium">Phone:</span>{" "}
                        {selectedApplication.user.phone}
                      </p>
                    </div>

                    <div>
                      <label htmlFor="finalVisitDate" className="input-label">
                        Final Visit Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        id="finalVisitDate"
                        name="finalVisitDate"
                        value={modalFormData.finalVisitDate}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        Schedule Final Visit
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
