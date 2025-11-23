import React, { useState, useEffect } from "react";
import axios from "../utils/axios";
import { useNavigate } from 'react-router-dom';


const ConnectPage = () => {

  const [students, setStudents] = useState([]); 
  const [searchName, setSearchName] = useState(""); 
  const [selectedSkills, setSelectedSkills] = useState([]); 
  const [skills, setSkills] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("/student/skills");
        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    fetchSkills();
  }, []);

  const fetchStudents = async () => {
    if (!searchName.trim() && selectedSkills.length === 0) {
      return;
    }  
  
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchName) queryParams.append("name", searchName);
      if (selectedSkills.length > 0) queryParams.append("skills", JSON.stringify(selectedSkills));
  
      const response = await axios.get(`/student/search?${queryParams.toString()}`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Failed to fetch students. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleConnect = async (receiverId) => {
    try {
      await axios.post('/student/send-connection-request', { receiverId });
      setStudents(students.map(student => {
        if (student.userId._id === receiverId) {
          return { ...student, connectionStatus: 'pending' };
        }
        return student;
      }));
      alert('Connection request sent successfully');
    } catch (error) {
      console.error("Error sending connection request:", error);
      alert('Failed to send connection request');
    }
  };

  const handleViewProfile = (studentId) => {
    navigate(`/students/${studentId}`);
  };

  const handleSkillChange = (e) => {
    const { value } = e.target;
    setSelectedSkills((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };
  const renderConnectionButton = (student) => {
    switch(student.connectionStatus) {
      case 'connected':
        return (
          <button
            onClick={() => handleViewProfile(student.userId._id)}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
          >
            👤 View Profile
          </button>
        );
      case 'pending':
        return (
          <button
            disabled
            className="mt-4 w-full bg-gray-200 text-gray-600 px-4 py-3 rounded-xl font-medium cursor-not-allowed flex items-center justify-center gap-2"
          >
            ⏳ Pending
          </button>
        );
      default:
        return (
          <button
            onClick={() => handleConnect(student.userId._id)}
            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
          >
            🤝 Connect
          </button>
        );
    }
  };

  

  // return (
  //   <div className="container mx-auto p-4">
  //     {/* Top Section - Search Bar */}
  //     <div className="flex justify-center mb-6">
  //       <div className="flex w-2/3 max-w-lg">
  //         <input
  //           type="text"
  //           value={searchName}
  //           onChange={(e) => setSearchName(e.target.value)}
  //           placeholder="Search student"
  //           className="border px-4 py-2 rounded-l-lg w-full"
  //         />
  //         <button
  //           onClick={() => {
  //             setSearchAttempted(true);
  //             fetchStudents();
  //           }}
  //           className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
  //         >
  //           Search
  //         </button>
  //       </div>
  //     </div>

  //     {/* Main Section */}
  //     <div className="flex gap-4">
  //       {/* Left Sidebar - Filters */}
  //       <div className="w-auto border rounded-lg p-4 h-fit bg-black text-white">
  //         <h2 className="text-lg font-bold mb-2 text-orange-500">Skills</h2>
  //         <div className="flex flex-col gap-2">
  //           {skills.map((skill, index) => (
  //             <label key={`${skill}-${index}`} className="flex items-center">
  //               <input
  //                 type="checkbox"
  //                 value={skill}
  //                 checked={selectedSkills.includes(skill)}
  //                 onChange={handleSkillChange}
  //                 className="mr-2"
  //               />
  //               {skill}
  //             </label>
  //           ))}
  //         </div>
  //         <button
  //           onClick={fetchStudents}
  //           className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition-colors"
  //         >
  //           Add
  //         </button>
  //       </div>

  //       {/* Students List */}
  //       <div className="w-3/4">
  //         {loading ? (
  //           <p className="text-center">Loading...</p>
  //         ) : students.length > 0 ? (
  //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  //             {students.map((student) => (
  //               <div
  //                 key={student._id}
  //                 className="border rounded-lg p-4 shadow hover:shadow-md bg-white"
  //               >
  //                 <div className="flex items-center gap-2 mb-2">
  //                   <img
  //                     src={student.profileLogo || "/profile.jpeg"}
  //                     alt="profile"
  //                     className="w-16 h-16 rounded-full object-cover"
  //                   />
  //                   <div>
  //                     <h2 className="font-bold text-lg">{student.userId?.name}</h2>
  //                     <p className="text-sm text-gray-600">{student.headline}</p>
  //                     <p className="text-sm text-gray-500">{student.location}</p>
  //                   </div>
  //                 </div>
  //                 <div className="flex flex-wrap gap-1">
  //                 {student.skills.map((skill, index) => (
  //                     <span
  //                       key={`${student._id}-${skill.skillName}-${index}`}
  //                       className="bg-gray-200 text-xs px-2 py-1 rounded-full"
  //                     >
  //                       {skill.skillName}
  //                     </span>
  //                   ))}
  //                 </div>
  //                 {renderConnectionButton(student)}
  //               </div>
  //             ))}
  //           </div>
  //         ) : (
  //           searchAttempted && <p className="text-center">No students found.</p>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="container mx-auto p-6">
      {/* Enhanced Search Section */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search students by name..."
              className="flex-1 border-0 px-6 py-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
            <button
              onClick={() => {
                setSearchAttempted(true);
                fetchStudents();
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              🔍 Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Enhanced Filters Sidebar */}
        <div className="lg:w-80 bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Filter by Skills</h2>
          <div className="grid grid-cols-1 gap-3 mb-6">
            {skills.map((skill, index) => (
              <label 
                key={`${skill}-${index}`} 
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={skill}
                  checked={selectedSkills.includes(skill)}
                  onChange={handleSkillChange}
                  className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">{skill}</span>
              </label>
            ))}
          </div>
          <button
            onClick={fetchStudents}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all"
          >
            ✅ Apply Filters
          </button>
        </div>

        {/* Enhanced Students Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching students...</p>
            </div>
          ) : students.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <div
                  key={student._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={student.profileLogo || "/profile.jpeg"}
                      alt="profile"
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-50"
                    />
                    <div className="flex-1">
                      <h2 className="font-bold text-lg text-gray-800">{student.userId?.name}</h2>
                      <p className="text-sm text-gray-600 mb-1">{student.headline}</p>
                      <p className="text-xs text-gray-500">{student.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {student.skills.map((skill, index) => (
                      <span
                        key={`${student._id}-${skill.skillName}-${index}`}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full hover:bg-blue-100 transition-colors"
                      >
                        {skill.skillName}
                      </span>
                    ))}
                  </div>

                  {renderConnectionButton(student)}
                </div>
              ))}
            </div>
          ) : (
            searchAttempted && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">😕</div>
                <h3 className="text-xl text-gray-800 mb-2">No students found</h3>
                <p className="text-gray-600">Try adjusting your search filters</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );

  // Keep renderConnectionButton function exactly the same, just update className
  
};

export default ConnectPage;

