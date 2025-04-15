import { useNavigate } from "react-router";

const LogoutButton = ({ logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function passed as a prop
    // localStorage.removeItem("eventToken"); // Clear the token
    navigate("/signup"); // Redirect to signup page
  };

  return <button className="logout" onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
