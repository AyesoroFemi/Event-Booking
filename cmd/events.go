package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/event-booking/internal/model"
	"github.com/go-chi/chi"
)

func HealthHandler(w http.ResponseWriter, r *http.Request) {
	var payload = struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Version string `json:"version"`
	}{
		Status:  "active",
		Message: "Event booking app",
		Version: "1.0.0",
	}

	if err := json.NewEncoder(w).Encode(payload); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}

func (app *application) getEvents(w http.ResponseWriter, r *http.Request) {
	// Check if the userId query parameter is present
	userIdStr := r.URL.Query().Get("createdBy")
	if userIdStr != "" {
		userId, err := strconv.ParseInt(userIdStr, 10, 64)
        if err != nil {
            http.Error(w, `{"message": "Invalid user ID format"}`, http.StatusBadRequest)
            return
        }

		events, err := app.store.Events.GetEventsByUserId(userId)
		if err != nil {
			http.Error(w, `{"message": "Could not fetch events"}`, http.StatusInternalServerError)
			return 
		}
		JsonResponse(w, http.StatusOK, "Events retrieved successfully", events)
		return
	}

	// If the userId query parameter is not present, fetch all events
	// and return them
	events, err := app.store.Events.GetAllEvents()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	JsonResponse(w, http.StatusOK, "Events retrieved successfully", events)
}

func (app *application) getEvent(w http.ResponseWriter, r *http.Request) {
	userIDStr := chi.URLParam(r, "id")
	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	event, err := app.store.Events.GetEventById(userID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	JsonResponse(w, http.StatusOK, "Event retrieved successfully", event)
}

func (app *application) createEvent(w http.ResponseWriter, r *http.Request) {
	var event model.Event
	err := json.NewDecoder(r.Body).Decode(&event)

	defer r.Body.Close()

	if err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}
	userID, ok := r.Context().Value(UserIDKey).(int64)
	if !ok {
		http.Error(w, `{"message": "Unauthorized: invalid user"}`, http.StatusUnauthorized)
		return
	}
	
	event.UserID = userID

	if err := app.store.Events.SaveEvent(&event); err != nil {
		http.Error(w, `{"message": "Could not create event. Try again later."}`, http.StatusInternalServerError)
		return
	}

	JsonResponse(w, http.StatusCreated, "Event created successfully", event)
}

func (app *application) updateEvent (w http.ResponseWriter, r *http.Request) {
	userIDStr := chi.URLParam(r, "id")

    EventId, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
        http.Error(w, "Invalid event ID", http.StatusBadRequest)
        return
    }

	userID, ok := r.Context().Value(UserIDKey).(int64)
	if !ok {
		http.Error(w, `{"message": "Unauthorized: invalid user ID."}`, http.StatusUnauthorized)
		return
	}
	
	event, err := app.store.Events.GetEventById(EventId)
	if err != nil {
		http.Error(w, `{"message": "Could not retrieve event."}`, http.StatusInternalServerError)
		return
	}

	if event.UserID != userID {
		http.Error(w, "Not authorized to update event.", http.StatusUnauthorized)
        return
	}

	var updatedEvent model.Event
	err = json.NewDecoder(r.Body).Decode(&updatedEvent)
	if err != nil {
		http.Error(w, `{"error": "Could not parse request data"}`, http.StatusBadRequest)
		return
	}

	updatedEvent.ID = EventId
	err = app.store.Events.UpdateEvent(updatedEvent)
	if err != nil {
		http.Error(w, `{"error": "Could not update event"}`, http.StatusInternalServerError)
		return
	}

	JsonResponse(w, http.StatusOK, "Event update successfully", updatedEvent)
	
}

func (app *application) deleteEvent (w http.ResponseWriter, r *http.Request) {
	userIDStr := chi.URLParam(r, "id")
    EventId, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
        http.Error(w, "Invalid event ID", http.StatusBadRequest)
        return
    }

	userID, ok := r.Context().Value(UserIDKey).(int64)
	if !ok {
		http.Error(w, `{"message": "Unauthorized: invalid user ID."}`, http.StatusUnauthorized)
		return
	}
	
	event, err := app.store.Events.GetEventById(EventId)
	if err != nil {
		http.Error(w, `{"message": "Could not retrieve event."}`, http.StatusInternalServerError)
		return
	}

	if event.UserID != userID {
		http.Error(w, `{"message": "Not authorized to delete event."}`, http.StatusUnauthorized)
        return
	}

	err = app.store.Events.DeleteEvent(*event)
	if err != nil {
		http.Error(w, `{"error": "Could not delete event"}`, http.StatusInternalServerError)
		return
	}
	JsonResponse(w, http.StatusOK, "The Event deleted successfully", nil)
}