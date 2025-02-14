package main

import (
	"context"
	"net/http"
	"strings"

	"github.com/event-booking/internal/utils"
)

type ContextKey string

const UserIDKey ContextKey = "userId"

// Authenticate middleware to verify JWT token in Chi
func Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Extract Authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, `{"message": "Not authorized."}`, http.StatusUnauthorized)
			return
		}

		// Ensure the format is "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, `{"message": "Not authorized."}`, http.StatusUnauthorized)
			return
		}

		token := parts[1]

		// Verify the token
		userId, err := utils.VerifyToken(token)
		if err != nil {
			http.Error(w, `{"message": "Not authorized."}`, http.StatusUnauthorized)
			return
		}

		// Store user ID in request context
		ctx := context.WithValue(r.Context(), UserIDKey, userId)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
