import { useNavigate } from "react-router"
import { formatDateTime } from "../utils/date"



function EventList({event}) {
    const navigate = useNavigate()

    return (
        <>  
            <button onClick={() => navigate(-1)} className="previous__page">Go back</button>
            <div className='event__list' key={event.id}>
                <p>{formatDateTime(event.datetime)}</p>
                <h3>{event.name}</h3>
                <p>{event.description}</p>
                <h4>Location: {event.location}</h4>
            </div>
        </>
    )
}

export default EventList