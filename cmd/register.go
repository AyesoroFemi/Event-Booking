package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/event-booking/internal/model"
	"github.com/go-chi/chi"
)


func (app *application) RegisterForEvent(w http.ResponseWriter, r *http.Request) {

	userID, ok := r.Context().Value("userId").(int64)
	if !ok {
		http.Error(w, `{"message": "Unauthorized: invalid user ID."}`, http.StatusUnauthorized)
		return
	}

	eventIDStr := chi.URLParam(r, "id")
	eventID, err := strconv.ParseInt(eventIDStr, 10, 64)
	if err != nil {
		http.Error(w, `{"message": "Could not parse event ID."}`, http.StatusBadRequest)
		return
	}


	// event, err := app.store.Events.GetEventById(eventID)
	// if err != nil {
	// 	http.Error(w, `{"message": "Could not fetch events."}`, http.StatusInternalServerError)
	// 	return
	// }

	err = app.store.Users.Register(&model.User{ID: userID}, eventID)
	if err != nil {
		http.Error(w, `{"message": "Could not register user for event."}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Registered!",
	})

}