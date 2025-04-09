package main

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/event-booking/internal/model"
	"github.com/event-booking/internal/utils"
	"github.com/go-chi/chi"
)

type APIResponseData struct {
	Status  int         `json:"status"`
	Message string      `json:"message"`
	Token    interface{} `json:"token,omitempty"`
}

func (app *application) RegisterForEvent(w http.ResponseWriter, r *http.Request) {

	userID, ok := r.Context().Value(UserIDKey).(int64)
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

	event, err := app.store.Events.GetEventById(eventID)
	if err != nil {
		http.Error(w, `{"message": "Could not fetch events."}`, http.StatusInternalServerError)
		return
	}

	err = app.store.Users.Register(&model.User{ID: userID}, event.ID)
	if err != nil {
		http.Error(w, `{"message": "Could not register user for event."}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Registered!",
	})

}

func (app *application) SignUp(w http.ResponseWriter, r *http.Request) {
	var user model.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	err = app.store.Users.SaveUser(&user)
	if err != nil {
		http.Error(w, `{"message": "Could not save user."}`, http.StatusInternalServerError)
		return
	}
	JsonResponse(w, http.StatusCreated, "User created successfully", nil)
}


func (app *application) Login(w http.ResponseWriter, r *http.Request) {
	var user model.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}
	
	err = app.store.Users.ValidateCredentials(&user)
	if err != nil {
		http.Error(w, `{"error": "Could not authenticate user."}`, http.StatusUnauthorized)
		return
	}

	token, err := utils.GenerateToken(user.Email, user.ID)
	if err != nil {
		http.Error(w, `{"message": "Could not authenticate user."}`, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "Application/Json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(APIResponseData{
		Status:  http.StatusOK,
		Message: "Login successfully",
		Token:    token,
	})

}


func (app *application) CancelRegistration(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(UserIDKey).(int64)
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

	err = app.store.Users.CancelRegistration(userID, eventID)
	if err != nil {
		if strings.Contains(err.Error(), "no registration found") {
			http.Error(w, `{"message": "No registration found."}`, http.StatusNotFound)
		} else {
			http.Error(w, `{"message": "Could not cancel registration."}`, http.StatusInternalServerError)
		}
		return
	}

	JsonResponse(w, http.StatusOK, "Cancelled", nil)
}
