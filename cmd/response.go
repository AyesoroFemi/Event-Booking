package main

import (
	"encoding/json"
	"net/http"
)


type APIResponse struct {
	Status  int         `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}


func JsonResponse (w http.ResponseWriter, statusCode int, message string, data interface{}) {
	w.Header().Set("Content-Type", "Application/Json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(APIResponse{
		Status:  statusCode,
		Message: message,
		Data:    data,
	})
}