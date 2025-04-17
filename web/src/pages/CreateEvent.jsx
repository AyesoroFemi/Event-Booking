import { useState } from "react"
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { baseURL } from "../utils/api";


function CreateEvent() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [location, setLocation] = useState("")

    const navigate = useNavigate()

    const createEvent = async (newEvent) => {
        const token = localStorage.getItem("eventToken")

        try {
            const res = await fetch(`${baseURL}/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newEvent)
            })

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.message || "Failed to create event");
                return;
            }

            toast.success("Event created successfully!")

        } catch (error) {
            toast.error("An error occurred while creating the event.", error)
        }

    }


    const handleSubmit = (e) => {
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
        createEvent(newEvent)
        setName("")
        setDescription("")
        setLocation("")
        navigate("/dashboard");
    }


    return (
        <div className="container">
            <h1>Create Event</h1>
            <form onSubmit={handleSubmit} className="create__event">
                <div className="">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Event Name" />
                </div>
                <div className="">
                    <label htmlFor="description">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={10} id="description"></textarea>
                </div>
                <div className="">
                    <label htmlFor="location">Location</label>
                    <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
                </div>
                <input type='submit' value="Create Event" />

            </form>
        </div>
    )
}

export default CreateEvent