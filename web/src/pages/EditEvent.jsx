import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { toast } from "react-toastify"
import { baseURL } from "../utils/api"

function EditEvent() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [location, setLocation] = useState("")
    // const [dateTime, setDateTime] = useState("")

    const navigate = useNavigate()


    const { id } = useParams()

    const fetchEvent = async (id) => {
        try {
            const response = await fetch(`${baseURL}/events/${id}`)
            if (!response.ok) {
                throw new Error("Failed to fetch event details")
            }
            const data = await response.json()
            setName(data?.data.name)
            setDescription(data?.data.description)
            setLocation(data?.data.location)
            // setDateTime(data?.data.dateTime); 
        } catch (error) {
            toast.error("Could not fetch event details")
        }
    }

    useEffect(() => {
        fetchEvent(id)
    }, [id])


    const updateEvent = async (updateEvent) => {
        const token = localStorage.getItem("eventToken")

        try {
            const res = await fetch(`${baseURL}/events/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updateEvent)
            })

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.message || "Failed to update event");
                return;
            }

            toast.success("Event updated successfully!")

        } catch (error) {
            toast.error("An error occurred while updating the event.", error)
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name || !description || !location) {
            return;
        }
        const newEvent = {
            name: name,
            description: description,
            location: location,
            dateTime: new Date().toISOString(),
        }
        await updateEvent(newEvent)
        navigate("/dashboard");
    }

    return (
        <div className="container">
            <h1>Edit Event</h1>
            <button onClick={() => navigate(-1)} className="previous__page">Go back</button>
            <form onSubmit={handleSubmit} className="create__event">
                <div className="">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="">
                    <label htmlFor="description">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={10} id="description"></textarea>
                </div>
                <div className="">
                    <label htmlFor="location">Location</label>
                    <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <input type='submit' value="Update Event" />

            </form>
        </div>
    )
}

export default EditEvent
