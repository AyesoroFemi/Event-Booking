import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import EventList from "../components/EventList"

function SingleEvent() {
    const [event, setEvent] = useState({})
    const navigate = useNavigate()


    const { id } = useParams()

    const fetchEvent = async (id) => {
        const response = await fetch(`http://localhost:8080/events/${id}`)
        const data = await response.json()
        setEvent(data.data)
    }

    useEffect(() => {
        fetchEvent(id)
    }, [])

    return (
        <div className="container">
            <h1>Event Details</h1>
            <EventList event={event}/>
            <div className="event__btn">
                <button onClick={() => navigate("/signup")}>Register for Event</button>
                <button onClick={() => navigate("/signup")}>Cancel</button>
            </div>
        </div>
    )
}


export default SingleEvent