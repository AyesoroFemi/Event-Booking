import { useNavigate } from "react-router";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("eventToken"); // Clear the token
    navigate("/signup"); // Redirect to signup page
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
