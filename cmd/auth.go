package main

import (
	"context"
	"net/http"
	"strings"

	"github.com/event-booking/internal/utils"
)

type ContextKey string

const UserIDKey ContextKey = "userId"

func Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, `{"message": "Not authorized."}`, http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, `{"message": "Not authorized. where is it coming from??"}`, http.StatusUnauthorized)
			return
		}

		token := parts[1]

		userId, err := utils.VerifyToken(token)
		if err != nil {
			http.Error(w, `{"message": "Not authorized."}`, http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), UserIDKey, userId)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
