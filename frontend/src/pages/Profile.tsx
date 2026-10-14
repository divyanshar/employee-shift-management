import { useEffect, useState } from "react";
import axiosInterceptor from "../services/axiosInterceptor";

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setError(""); 
        const response = await axiosInterceptor.get("/users/me");
        setProfile(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load your profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <section className="page-container">
        <p>Loading your profile...</p>
      </section>
    );
  }

  if (error || !profile) {
    return (
      <section className="page-container">
        <h1>My Profile</h1>
        <p className="error">
          {error || "Profile information is unavailable."}
        </p>
      </section>
    );
  }

  return (
    <section className="page-container">
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p className="muted">View your employee information.</p>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.name?.charAt(0).toUpperCase() || "E"}
          </div>

          <div>
            <h2>{profile.name}</h2>
            <span className="status-badge status-published">
              {profile.role}
            </span>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-detail">
            <span>Employee ID</span>
            <strong>{profile.id}</strong>
          </div>

          <div className="profile-detail">
            <span>Full Name</span>
            <strong>{profile.name}</strong>
          </div>

          <div className="profile-detail">
            <span>Email Address</span>
            <strong>{profile.email}</strong>
          </div>

          <div className="profile-detail">
            <span>Role</span>
            <strong>{profile.role}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
