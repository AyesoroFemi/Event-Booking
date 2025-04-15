import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { formatDateTime } from '../utils/date'

function Dashboard() {
  const [events, setEvents] = useState([])
  const [userId, setUserId] = useState(null)
  const [userEmail, setUserEmail] = useState(null)

  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("eventToken")
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        setUserId(decodedToken.userId)
        setUserEmail(decodedToken.email)
      } catch (error) {
        console.log("Invalid token", error)
        localStorage.removeItem("eventToken")
        navigate("/login")
      }
    }
  }, [navigate])

  useEffect(() => {
    if (userId) {
      const fetchEvents = async () => {
        try {
          const res = await fetch(`http://localhost:8080/events?createdBy=${userId}`)
          const data = await res.json()
          setEvents(data.data)
        } catch (error) {
          console.log("Error fetching events", error)
        }
      }
      fetchEvents()
    } 
  }, [userId])

  return (
    <div className="container">
      <h1>  Events created by {userEmail}</h1>
      <div className="dashboard__events">
        {events.map((event) => (
          <div key={event.id} className="dashboard__card">
            <p >{formatDateTime(event.datetime)}</p>
            <h3>{event.name}</h3>
            <p>{event.description}</p>
              <div className="event__btn">
                <button onClick={() => navigate("/signup")}>Edit Event</button>
                <button onClick={() => navigate("/signup")}>Delete Event</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard