
function CreateEvent() {
  return (
    <div className="container">
        <h1>Create Event</h1>
        <form className="create__event">
            <div className="">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Event Name" />
            </div>
            <div className="">
            <label htmlFor="description">Description</label>
            <textarea rows={10} id="description"></textarea>
            </div>
            <div className="">
            <label htmlFor="location">Location</label>
            <input type="text" id="location" placeholder="Location" />
            </div>
            <input type='submit' value="Create Event" />

        </form>
    </div>
  )
}

export default CreateEvent


