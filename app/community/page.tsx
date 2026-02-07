"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Moon, Sun, MessageCircle, UserPlus, GraduationCap, Briefcase } from "lucide-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdClose } from "react-icons/md";

interface Post {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  badge: string;
  title: string;
  content: string;
  comments: number;
}

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: "student" | "professional";
  school: string;
}

interface SignInData {
  email: string;
  password: string;
}

export default function CommunityHub() {
  const [activeTab, setActiveTab] = useState<"latest" | "most_discussed">("latest");
  const [isDark, setIsDark] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userType: "student",
    school: "",
  });
  const [signInData, setSignInData] = useState<SignInData>({
    email: "",
    password: "",
  });

  // Theme toggle logic
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      window.location.reload();
    }, 500);
  };

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignInInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserTypeChange = (type: "student" | "professional") => {
    setRegistrationData(prev => ({
      ...prev,
      userType: type
    }));
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log("Registration data:", registrationData);
    // Close modal after submission
    setShowRegisterModal(false);
    // Reset form
    setRegistrationData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      userType: "student",
      school: "",
    });
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log("Sign in data:", signInData);
    // Close modal after submission
    setShowSignInModal(false);
    // Reset form
    setSignInData({
      email: "",
      password: "",
    });
  };

  const posts: Post[] = [
    {
      id: "1",
      author: "Emmanuel Dela Pena",
      avatar: "🔵",
      timeAgo: "1 day ago",
      badge: "STI College Baliuag",
      title: "We're officially live!",
      content:
        "Currently preparing my portfolio for deployment after completing local development. Final refinements and testing are underway.",
      comments: 0,
    },
  ];

  return (
    <div className="community-hub-page">
      {/* Header */}
      <header className="community-header">
        <div className="container">
          <div className="community-header-content">
            <Link href="/" className="back-link">
              <ArrowLeft size={20} />
              Back to Home
            </Link>

            <h1>Community Hub</h1>

            <div className="header-actions">
              <button 
                className={`icon-btn ${isRefreshing ? 'refreshing' : ''}`}
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Refresh"
              >
                <RefreshCw size={20} />
              </button>
              <button 
                className="icon-btn" 
                onClick={toggleTheme}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container">
        <div className="community-grid">
          {/* Sidebar */}
          <aside className="community-sidebar">
            {/* Join Card */}
            <div className="card">
              <h3 className="sidebar-title">Join the Community</h3>
              <p className="sidebar-description">
                Sign up to join discussions, ask questions, and share knowledge.
              </p>
              <button 
                className="btn-primary"
                onClick={() => setShowRegisterModal(true)}
              >
                <UserPlus size={18} /> Register to Participate
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowSignInModal(true)}
              >
                Sign In
              </button>
            </div>

            {/* Stats Card */}
            <div className="card">
              <h3 className="sidebar-title">Hub Stats</h3>
              <div className="stat-row">
                <span className="stat-label">Total Posts</span>
                <span className="stat-value">1</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Total Users</span>
                <span className="stat-value">1</span>
              </div>
            </div>
          </aside>

          {/* Posts Section */}
          <main className="community-main">
            {/* Tabs */}
            <div className="tabs">
              <button
                className={`tab ${activeTab === "latest" ? "active" : ""}`}
                onClick={() => setActiveTab("latest")}
              >
                Latest
              </button>
              <button
                className={`tab ${activeTab === "most_discussed" ? "active" : ""}`}
                onClick={() => setActiveTab("most_discussed")}
              >
                Most Discussed
              </button>
            </div>

            {/* Posts List */}
            <div className="posts-list">
              {posts.map((post) => (
                <article key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="author-info">
                      <span className="author-avatar">{post.avatar}</span>
                      <div>
                        <h4 className="author-name">{post.author}</h4>
                        <div className="post-meta">
                          <span className="post-time">{post.timeAgo}</span>
                          <span className="post-badge">{post.badge}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="post-content">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-text">{post.content}</p>
                  </div>

                  <div className="post-footer">
                    <div className="post-stats">
                      <MessageCircle size={16} />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Registration Modal */}
      <div className={`registration-modal ${showRegisterModal ? "active" : ""}`}>
        <div className="modal-backdrop" onClick={() => setShowRegisterModal(false)} />
        
        <div className="modal-content-register">
          <button 
            className="close-register-btn"
            onClick={() => setShowRegisterModal(false)}
          >
            <MdClose size={28} />
          </button>

          <h2 className="modal-title">Join the Community</h2>

          <form onSubmit={handleRegisterSubmit} className="registration-form">
            {/* Name Fields */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={registrationData.firstName}
                  onChange={handleRegisterInputChange}
                  required
                  placeholder=""
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={registrationData.lastName}
                  onChange={handleRegisterInputChange}
                  required
                  placeholder=""
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={registrationData.email}
                onChange={handleRegisterInputChange}
                required
                placeholder=""
              />
              <small className="form-hint">This will be your sign-in email</small>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={registrationData.password}
                  onChange={handleRegisterInputChange}
                  required
                  placeholder=""
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
              <small className="form-hint">Must be at least 6 characters long</small>
            </div>

            {/* User Type Selection */}
            <div className="form-group">
              <label>I am a</label>
              <div className="user-type-buttons">
                <button
                  type="button"
                  className={`user-type-btn ${registrationData.userType === "student" ? "active" : ""}`}
                  onClick={() => handleUserTypeChange("student")}
                >
                  <GraduationCap size={18} />
                  Student
                </button>
                <button
                  type="button"
                  className={`user-type-btn ${registrationData.userType === "professional" ? "active" : ""}`}
                  onClick={() => handleUserTypeChange("professional")}
                >
                  <Briefcase size={18} />
                  Professional
                </button>
              </div>
            </div>

            {/* School Field */}
            <div className="form-group">
              <label htmlFor="school">School/University (Optional)</label>
              <input
                type="text"
                id="school"
                name="school"
                value={registrationData.school}
                onChange={handleRegisterInputChange}
                placeholder="e.g., Stanford University"
              />
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowRegisterModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-join"
              >
                Join Community
              </button>
            </div>

            {/* Sign In Link */}
            <div className="sign-in-link-container">
              <span>Already have an account? </span>
              <button
                type="button"
                className="sign-in-link"
                onClick={() => {
                  setShowRegisterModal(false);
                  setShowSignInModal(true);
                }}
              >
                Sign in here
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Sign In Modal */}
      <div className={`signin-modal ${showSignInModal ? "active" : ""}`}>
        <div className="modal-backdrop" onClick={() => setShowSignInModal(false)} />
        
        <div className="modal-content-signin">
          <button 
            className="close-signin-btn"
            onClick={() => setShowSignInModal(false)}
          >
            <MdClose size={28} />
          </button>

          <h2 className="modal-title-signin">Sign In</h2>

          <form onSubmit={handleSignInSubmit} className="signin-form">
            {/* Email Field */}
            <div className="form-group-signin">
              <label htmlFor="signin-email">Email Address</label>
              <input
                type="email"
                id="signin-email"
                name="email"
                value={signInData.email}
                onChange={handleSignInInputChange}
                required
                placeholder=""
              />
            </div>

            {/* Password Field */}
            <div className="form-group-signin">
              <label htmlFor="signin-password">Password</label>
              <div className="password-wrapper-signin">
                <input
                  type={showSignInPassword ? "text" : "password"}
                  id="signin-password"
                  name="password"
                  value={signInData.password}
                  onChange={handleSignInInputChange}
                  required
                  placeholder=""
                />
                <button
                  type="button"
                  className="password-toggle-signin"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                >
                  {showSignInPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="btn-signin"
            >
              Sign In
            </button>

            {/* Register Link */}
            <div className="register-link-container">
              <span>Need an account? </span>
              <button
                type="button"
                className="register-link"
                onClick={() => {
                  setShowSignInModal(false);
                  setShowRegisterModal(true);
                }}
              >
                Register here
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer style={{marginTop: 50}}>
        <p>&copy; 2026 Emmanuel Dela Pena. All Rights Reserved.</p>
        <p>Developed in Baliuag City, Bulacan, Philippines</p>
      </footer>
    </div>
  );
}