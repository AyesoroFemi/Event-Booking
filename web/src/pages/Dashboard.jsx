import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { formatDateTime } from '../utils/date'
import { toast } from "react-toastify";
import { baseURL } from "../utils/api";


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
          const res = await fetch(`${baseURL}/events?createdBy=${userId}`)
          const data = await res.json()
          setEvents(data.data)
        } catch (error) {
          console.log("Error fetching events", error)
        }
      }
      fetchEvents()
    } 
  }, [userId])

  const deleteEvent = async (id) => {
    const token = localStorage.getItem("eventToken")

    try {
      const res = await fetch(`${baseURL}/events/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Full server error:", errorData);
        toast.error(errorData.message || "Could not delete the event!");
        return; 
      }

      toast.success("Event deleted successfully!");
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    } catch (error) {
      toast.error("Could not be deleted!!")        
    }

  }

  const handleDelete = (eventId) => {
    const confirm = window.confirm("Are you sure you want to delete this event")
    if (!confirm) return
    deleteEvent(eventId)
  }


  return (
    <div className="container">
      <h1>  Events created by {userEmail}</h1>
      {events?.length > 0 ? (
        <div className="dashboard__events">
          {events.map((event) => (
            <div key={event.id} className="dashboard__card">
              <p >{formatDateTime(event.datetime)}</p>
              <h3>{event.name}</h3>
              <p>{event.description}</p>
              <p className="location">Location: {event.location}</p>
              <div className="event__btn">
                <button onClick={() => navigate(`/event/${event.id}`)}>Edit Event</button>
                <button onClick={() => handleDelete(event.id)}>Delete Event</button>
              </div>
            </div>
          ))}
        </div>
      ) : <h1>No user event added yet</h1>}
    </div>
  )
}

export default Dashboard