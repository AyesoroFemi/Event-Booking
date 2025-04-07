package repo

import (
	"database/sql"
	"errors"

	"github.com/event-booking/internal/model"
	"github.com/event-booking/internal/utils"
)

type UserStore struct {
	db *sql.DB
}

func NewUserStore(db *sql.DB)  *UserStore {
	return &UserStore{
		db:db,
	}
}

func (u *UserStore) SaveUser(user *model.User) error {
	query := "INSERT INTO users(email, password) VALUES (?, ?)"

	hashedPassword, err := utils.HashPassword(user.Password)

	if err != nil {
		return err
	}

	stmt, err := u.db.Prepare(query)

	if err != nil {
		return nil
	}

	defer stmt.Close()

	result, err := stmt.Exec(user.Email, hashedPassword)

	if err != nil {
		return err
	}

	userId, err := result.LastInsertId()
	if err != nil {
		return err
	}
	user.ID = userId

	return nil
}

func (u *UserStore) ValidateCredentials(user *model.User) error {
	query := "SELECT id, password FROM users WHERE email = ?"
	row := u.db.QueryRow(query, user.Email)

	var retrievedPassword string
	err := row.Scan(&user.ID, &retrievedPassword)

	if err != nil {
		return errors.New("credentials invalid")
	}

	passwordIsValid := utils.CheckPasswordHash(user.Password, retrievedPassword)

	if !passwordIsValid {
		return errors.New("credentials invalid")
	}

	return nil
}

func (u *UserStore) Register(user *model.User, eventId int64) error {
	query := "INSERT INTO registrations(event_id, user_id) VALUES (?, ?)"
	stmt, err := u.db.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(eventId, user.ID)

	if err != nil {
		return err
	}

	return nil
}

func (u *UserStore) CancelRegistration(userID, eventID int64) error {
	query := "DELETE FROM registrations WHERE event_id = ? AND user_id = ?"
	stmt, err := u.db.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(eventID, userID)

	if err != nil {
		return err
	}

	return nil
}


