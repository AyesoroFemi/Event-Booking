import React, { useEffect, useState } from 'react'
import { formatDateTime } from '../utils/date'
import { Link } from 'react-router'

function Home() {
    const [events, setEvents] = useState([])

    const fetchEvents = async () => {
        const response = await fetch("http://localhost:8080/events")
        const data = await response.json()
        setEvents(data.data)
    }

    useEffect(() => {
        fetchEvents()
    }, [])


  return (
    <div>
        {events?.length > 0 ? <div className='event__card'>
          {events?.map((event) => {
            return (
              <Link to={`/${event.id}`} className='card' key={event.id}>
               <h3>{event.name}</h3>
               <p>{event.description}</p>
               <p>{formatDateTime(event.datetime)}</p>
              </Link>
            )
          })}
        </div> : <h1>No task added yet</h1>}
    </div>
  )
}

export default Home