package repo

import (
	"database/sql"
	"fmt"

	"github.com/event-booking/internal/model"
)


type EventStore struct {
	db  *sql.DB
}

func NewEventStore(db *sql.DB) *EventStore {
	return &EventStore{
		db: db,
	}
} 


func (e *EventStore) SaveEvent(event *model.Event) error {
	query := `INSERT INTO events(name, description, location, dateTime, user_id) 
		VALUES (?, ?, ?, ?, ?)
	`
	stmt, err := e.db.Prepare(query)
	if err != nil {
		return  err
	}
	defer stmt.Close()

	result, err := stmt.Exec(event.Name, event.Description, event.Location, event.DateTime, event.UserID)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	event.ID = id
	return err

}

func (e *EventStore) GetAllEvents()([]model.Event, error) {
	query := "SELECT * FROM events"
	rows, err := e.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []model.Event

	for rows.Next() {
		var event model.Event
		err := rows.Scan(&event.ID, &event.Name, &event.Description, &event.Location, &event.DateTime, &event.UserID)

		if err != nil {
			return nil, err
		}

		events = append(events, event)
	}

	return events, nil
}


func (e *EventStore) GetEventById(id int64) (*model.Event, error) {
	query := "SELECT * FROM events WHERE id = ?"
	row := e.db.QueryRow(query, id)

	var event model.Event
	err := row.Scan(&event.ID, &event.Name, &event.Description, &event.Location, &event.DateTime, &event.UserID)
	if err != nil {
		return nil, err
	}

	return &event, nil
}

func (e *EventStore) UpdateEvent(event model.Event) error {
	query := `
	UPDATE events
	SET name = ?, description = ?, location = ?, dateTime = ?
	WHERE id = ?
	`
	stmt, err := e.db.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	result, err := stmt.Exec(event.Name, event.Description, event.Location, event.DateTime, event.ID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to retrieve affected rows: %w", err)
	}
	if rowsAffected == 0 {
		return fmt.Errorf("no event found with id %d", event.ID)
	}

	return nil
}


func (e *EventStore) DeleteEvent(event model.Event) error {
	query := "DELETE FROM events WHERE id = ?"
	stmt, err := e.db.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(event.ID)
	if err != nil {
		return err
	}
	
	return nil
}


func (e *EventStore) GetEventsByUserId(userId int64) ([]model.Event, error) {
	query := "SELECT * FROM events WHERE user_id = ?"
	rows, err := e.db.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var events []model.Event
	for rows.Next() {
		var event model.Event
		err := rows.Scan(&event.ID, &event.Name, &event.Description, &event.Location, &event.DateTime, &event.UserID)
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return events, nil
}