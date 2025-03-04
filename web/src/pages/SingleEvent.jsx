import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { formatDateTime } from "../utils/date"

function SingleEvent() {

    const [event, setEvent] = useState({})

    const { id } = useParams()
    const navigate = useNavigate()

    const fetchEvent = async (id) => {
        const response = await fetch(`http://localhost:8080/events/${id}`)
        const data = await response.json()
        console.log(data.data)
        setEvent(data.data)
    }

    useEffect(() => {
        fetchEvent(id)
    }, [])

    return (
        <div>
            <div className='card' key={event.id}>
                <h3>{event.name}</h3>
                <p>{event.description}</p>
                <p>{event.location}</p>
                <p>{formatDateTime(event.datetime)}</p>
            </div>
            <div className="event__btn">
                <button onClick={() => navigate("/signup")}>Edit Event</button>
                <button onClick={() => navigate("/signup")}>Delete Event</button>
            </div>
        </div>
    )
}

export default SingleEvent