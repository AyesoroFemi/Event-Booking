package repo

import (
	"database/sql"

	"github.com/event-booking/internal/model"
)

type Storage struct {
	Events interface {
		SaveEvent(event *model.Event) error
		GetAllEvents()([]model.Event, error)
		GetEventById(id int64) (*model.Event, error)
		UpdateEvent(event model.Event) error 
		DeleteEvent(event model.Event) error
	}
	Users interface {
		SaveUser(user *model.User) error
		Register(user *model.User, userId int64) error 
		CancelRegistration(user *model.User, userId int64) error
	}
}


func NewStorage(db *sql.DB) Storage {
	return Storage{
		Events: &EventStore{db},
		Users: &UserStore{db},
	}
}