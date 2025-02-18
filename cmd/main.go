package main

import (
	"fmt"
	"log"

	"github.com/event-booking/internal/db"
	"github.com/event-booking/internal/repo"
)


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


