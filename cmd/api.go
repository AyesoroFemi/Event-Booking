package main

import (
	// "encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/event-booking/internal/repo"
	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
)

type application struct {
	config config
	store repo.Storage
}

type config struct {
	maxOpenConns int
	maxIdleConns int
	maxIdleTime string
}

func (app *application) mount() http.Handler {
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	
	r.Route("/health", func(r chi.Router) {
		r.Get("/", HealthHandler)
	})

	r.Route("/events", func(r chi.Router) {
		r.Get("/", app.getEvents)
		r.Get("/{id}", app.getEvent)

		r.Route("/", func(r chi.Router) {
			r.Use(Authenticate)
			r.Post("/", app.createEvent)
			r.Put("/{id}", app.updateEvent)
			r.Delete("/{id}", app.deleteEvent)
			r.Post("/{id}/register", app.RegisterForEvent)
			r.Delete("/{id}/register", app.CancelRegistration)
		})
	})


	r.Route("/", func(r chi.Router) {
		r.Post("/signup", app.SignUp)
		r.Post("/login", app.Login)
	})
	

	return r
}


func (app *application) run(mux http.Handler) error {
	srv := &http.Server{
		Addr:         ":8080",
		Handler:      mux,
		WriteTimeout: time.Second * 30,
		ReadTimeout:  time.Second * 10,
		IdleTimeout:  time.Minute,
	}

	fmt.Println("Served has started", "addr", ":8080")	

	err := srv.ListenAndServe()
	if !errors.Is(err, http.ErrServerClosed) {
		return err
	}

	return nil
}