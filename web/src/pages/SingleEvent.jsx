import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { toast } from "react-toastify"
import EventList from "../components/EventList"
import { baseURL } from "../utils/api"

function SingleEvent() {
    const [event, setEvent] = useState({})
    const navigate = useNavigate()


    const { id } = useParams()

    const fetchEvent = async (id) => {
        try {
            const response = await fetch(`${baseURL}/events/${id}`)
            if (!response.ok) {
                throw new Error("Failed to fetch event details")
            }
            const data = await response.json()
            setEvent(data.data)
        } catch (error) {
            toast.error("Could not fetch event details")
        }
    }

    useEffect(() => {
        fetchEvent(id)
    }, [])


    const registerForEvent = async (id) => {
        const token = localStorage.getItem("eventToken")

        if (!token) {
            toast.error("You must be logged in to register for an event.");
            navigate("/signup"); 
            return;
        }

        try {
            const response = await fetch(`${baseURL}/events/${id}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, 
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to register for the event.");
                return;
            }

            toast.success("Successfully registered for the event!");
        } catch(error) {
            toast.error("An error occurred while registering for the event.");
        }

    }


    const cancelEvent = async (id) => {
        const token = localStorage.getItem("eventToken");

        if (!token) {
            toast.error("You must be logged in to cancel an event.");
            navigate("/signup");
            return;
        }

        try {
            const response = await fetch(`${baseURL}/events/${id}/register`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to cancel the event.");
                return;
            }

            toast.success("Successfully canceled the event!");
        } catch (error) {
            toast.error("An error occurred while canceling the event.");
        }
    };


    return (
        <div className="container">
            <h1>Event Details</h1>
            <EventList event={event} />
            <div className="event__btn">
                <button onClick={() => registerForEvent(id)}>Register for Event</button>
                <button onClick={() => cancelEvent(id)}>Cancel</button>
            </div>
        </div>
    )
}


export default SingleEvent