import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

const UserHomepage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Welcome to FriendSkill Exchange, <span className="text-blue-200">{user?.name}</span>!
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Connect, Learn, and Grow with Fellow Students
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => navigate('/connect')}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Find Students 🌟
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Update Profile ✨
              </button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/always-grey.png')]"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
            Why Choose FriendSkill?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🤝"
              title="Connect"
              description="Build meaningful connections with peers sharing your academic interests and career goals"
              color="from-purple-500 to-blue-500"
            />
            <FeatureCard
              icon="📚"
              title="Learn"
              description="Exchange knowledge and gain new perspectives through collaborative learning experiences"
              color="from-green-500 to-cyan-500"
            />
            <FeatureCard
              icon="🚀"
              title="Grow"
              description="Enhance your skills and accelerate your personal and professional development"
              color="from-orange-500 to-pink-500"
            />
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
            Get Started Quickly
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ActionCard
              title="Search Students"
              description="Find students based on skills, courses, or interests"
              buttonText="Explore Now →"
              onClick={() => navigate('/connect')}
              icon="🔍"
            />
            {user.role === 'student' && (
              <ActionCard
                title="View Requests"
                description="Manage your incoming connection requests"
                buttonText="Check Now →"
                onClick={() => navigate('/connections')}
                icon="📨"
              />
            )}
            {user.role === 'student' && (
              <ActionCard
                title="View Projects"
                description="Showcase and explore academic projects"
                buttonText="Discover →"
                onClick={() => navigate('/projects')}
                icon="📁"
              />
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number="1000+" label="Active Students" icon="👩🎓" />
            <StatCard number="50+" label="Skill Categories" icon="📚" />
            <StatCard number="500+" label="Connections" icon="🤝" />
            <StatCard number="100+" label="Projects" icon="💼" />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2023 FriendSkill Exchange. Empowering student connections worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Enhanced Feature Card
const FeatureCard = ({ icon, title, description, color }) => (
  <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
    <div className={`mb-6 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-r ${color} text-white`}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4 text-gray-800">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// Enhanced Action Card
const ActionCard = ({ title, description, buttonText, onClick, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="flex items-start mb-4">
      <span className="text-3xl mr-4">{icon}</span>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
    <button
      onClick={onClick}
      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
    >
      {buttonText}
    </button>
  </div>
);

// Enhanced Stat Card
const StatCard = ({ number, label, icon }) => (
  <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-md">
    <div className="text-4xl mb-4">{icon}</div>
    <div className="text-3xl font-bold text-blue-600 mb-2">{number}</div>
    <div className="text-gray-600 uppercase text-sm tracking-wide font-medium">{label}</div>
  </div>
);

export default UserHomepage;