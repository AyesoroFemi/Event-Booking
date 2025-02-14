package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func (app *application) getTaskHandler (w http.ResponseWriter, r *http.Request) {
	getTasks, err := app.store.Events.GetAllEvents()
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	b, err := json.Marshal(getTasks)
	if err != nil {
		log.Println(err)
	}

	_, err = w.Write(b)
	if err != nil {
		log.Println(err)
	}
}