# 📅 Event Booking App - API Overview (FullStack App)

## 🧾 Introduction

The **Event Booking App** is a web-based platform that allows users to **create**, **manage**, and **register** for events.  
It provides a seamless experience for both event organizers and participants, enabling efficient event management and user engagement.

---

## ✨ Key Features

- **User Authentication** – Secure signup and login system.
- **Event Management** – Users can create, update, and delete events.
- **Event Registration** – Users can register and cancel their registration for events.
- **Access Control** – Only authenticated users can create, edit, or register for events.
- **CORS Handling** – Supports secure API access for both web and mobile applications.

---

## 🧪 API Endpoints & Functionality

### 1. ✅ Health Check

- **Endpoint**: `GET /health/`  
- **Function**: Ensures the server is running and operational.  
- **Handler**: `HealthHandler`

---

### 2. 🔐 Authentication

#### Sign Up

- **Endpoint**: `POST /signup`  
- **Description**: Allows new users to create an account.  
- **Handler**: `app.SignUp`

#### Login

- **Endpoint**: `POST /login`  
- **Description**: Authenticates users and returns an access token.  
- **Handler**: `app.Login`

---

### 3. 📋 Event Management

These endpoints handle **event creation**, **modification**, and **retrieval**.

#### 📖 Public Endpoints

- `GET /events/`  
  → Fetch all available events  
  **Handler**: `app.getEvents`

- `GET /events/{id}`  
  → Retrieve details of a specific event  
  **Handler**: `app.getEvent`

#### 🔐 Protected Endpoints (Require Authentication)

- `POST /events/`  
  → Create a new event  
  **Handler**: `app.createEvent`

- `PUT /events/{id}`  
  → Update an existing event  
  **Handler**: `app.updateEvent`

- `DELETE /events/{id}`  
  → Delete an event  
  **Handler**: `app.deleteEvent`

- `POST /events/{id}/register`  
  → Register the authenticated user for an event  
  **Handler**: `app.RegisterForEvent`

- `DELETE /events/{id}/register`  
  → Cancel the user's registration for an event  
  **Handler**: `app.CancelRegistration`

---

## 🧱 Tech Stack

- **Go (Golang)** – Backend language
- **Chi Router** – Lightweight router for HTTP APIs
- **CORS Middleware** – Handles cross-origin resource sharing
- **Custom Repository Layer** – Abstracts storage operations (`repo.Storage`)

---

## 🚀 Server Configuration

```go
srv := &http.Server{
	Addr:         ":8080",
	Handler:      mux,
	WriteTimeout: time.Second * 30,
	ReadTimeout:  time.Second * 10,
	IdleTimeout:  time.Minute,
}


# Clone the repo
git clone https://github.com/your-username/event-booking.git
cd event-booking

# Run the backend application
go run ./cmd

# Run the frontend application
cd web
npm install    (Go node modules)
npm run dev    (Start the development server)