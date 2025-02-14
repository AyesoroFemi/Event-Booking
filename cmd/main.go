package main

import (
	// "encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/event-booking/internal/db"
	"github.com/event-booking/internal/repo"
	"github.com/event-booking/route"
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
		r.Get("/",  route.HealthHandler)
	})

	r.Route("/event", func(r chi.Router) {
		r.Get("/", app.getTaskHandler)
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

func main() {
	conn := config {
		maxOpenConns: 30,
		maxIdleConns: 30,
		maxIdleTime: "15m",
	}

	// Main database
	db, err := db.New(
		conn.maxOpenConns,
		conn.maxIdleConns,
		conn.maxIdleTime,
	)

	if err != nil {
		log.Fatal(err)
	}


	defer db.Close()
	log.Println("database connection pool established")

	store := repo.NewStorage(db)

	app := &application{
		config: conn,
		store: store,
	}

	mux := app.mount()
    if err := app.run(mux); err != nil {
		fmt.Println("err connecting ")
    }
	log.Println(app.run(mux))
}


