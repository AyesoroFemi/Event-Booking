import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Footer from '../components/Footer'
import EventsListing from '../components/EventsListing'

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
    <div className="wrapper">
      <div className='hero'>
        <h1>Event Management App</h1>
        <Link to="/signup">
          Get Started
        </Link>
      </div>
      <EventsListing events={events}/>
      <Footer/>
    </div>
  )
}

export default Home