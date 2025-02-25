## Event Booking App - API Overview
**Introduction**
# The Event Booking App is a web-based platform that allows users to create, manage, and register for events. 
# It provides a seamless experience for both event organizers and participants, enabling efficient event management and user engagement.

**Key Features**
# User Authentication → Secure signup and login system.
# Event Management → Users can create, update, and delete events.
# Event Registration → Users can register and cancel their registration for events.
# Access Control → Only authenticated users can create, edit, or register for events.
# CORS Handling → Supports secure API access for both web and mobile applications.

**API Endpoints & Functionality**
1. Health Check
Endpoint: GET /health/
Function: Ensures the server is running and operational.
Handler: HealthHandler
2. Authentication
Endpoint: POST /signup

**Allows new users to create an account.**
Handler: app.SignUp
Endpoint: POST /login

**Authenticates users and returns an access token.**
Handler: app.Login
3. Event Management
These endpoints handle event creation, modification, and retrieval.

 **Public Endpoints:**

GET /event/ → Fetch all available events. Handler: app.getEvents
GET /event/{id} → Retrieve details of a specific event. Handler: app.getEvent
Protected Endpoints (Require Authentication):

POST /event/ → Create a new event. Handler: app.createEvent
PUT /event/{id} → Update an existing event. Handler: app.updateEvent
DELETE /event/{id} → Delete an event. Handler: app.deleteEvent
4. Event Registration
Endpoint: POST /event/{id}/register

Registers a user for an event.
Handler: app.RegisterForEvent
Endpoint: DELETE /event/{id}/register

Cancels a user’s registration for an event.
Handler: app.CancelRegistration
