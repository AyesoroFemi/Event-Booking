import { useNavigate } from "react-router";

const LogoutButton = ({ logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signup"); 
  };

  return <button className="logout" onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
