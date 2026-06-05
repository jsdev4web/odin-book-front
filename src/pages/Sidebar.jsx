import { useEffect, useState } from "react";
import "../App.css";

import { useNavigate, useLocation } from "react-router";

function Sidebar() {
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:3000/dash/profiles",
          {
            credentials: "include",
          }
        );

        const data = await response.json();
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  const handleFollowToggle = async (user) => {
  try {
    const route = user.isFollowing
      ? "http://127.0.0.1:3000/dash/unfollow"
      : "http://127.0.0.1:3000/dash/follow";

    await fetch(route, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followingId: user.id,
      }),
    });

    setProfiles((prevProfiles) =>
      prevProfiles.map((profile) =>
        profile.id === user.id
          ? {
              ...profile,
              isFollowing: !profile.isFollowing,
            }
          : profile
      )
    );

  } catch (error) {
    console.error(error);
  }
};

const handleUnfollow = async () => {
    try {
      await fetch("http://127.0.0.1:3000/dash/unfollow", {
  method: "POST"
      });
    } catch (error) {
      console.log(error);
    } finally {
      console.log("User unFollowed")
    }
  }

  // logout
  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    } finally {
      navigate("/");
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
          <h2>People</h2>

          {profiles.length === 0 ? (
            <p>No profiles found.</p>
          ) : (
            profiles.map((user) => (
              <div key={user.id} className="profile-row">
                <span>{user.name}</span>

                <button onClick={() => handleFollowToggle(user)}>
                  {user.isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
            ))
          )}
    </aside>

      <main className="main-content">
        <h1>Main Feed</h1>
        <p>This is where posts will go later.</p> <br />
        <button onClick={handleLogout}>Logout</button>
      </main>
    </div>
  );
}

export default Sidebar;