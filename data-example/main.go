package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt"
)

var exampleSecret = []byte("example-secret")

func main() {
	http.HandleFunc("/farming-data", JWTAuthMiddleware(Protected))
	log.Println("Server started at http://localhost:9000")
	log.Fatal(http.ListenAndServe(":9000", nil))
}

func JWTAuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, `{"message": "Missing auth token"}`, http.StatusUnauthorized)
			return
		}

		splitToken := strings.Split(authHeader, "Bearer ")
		if len(splitToken) != 2 {
			http.Error(w, `{"message": "Invalid auth token"}`, http.StatusUnauthorized)
			return
		}

		tokenStr := splitToken[1]
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return exampleSecret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, `{"message": "Invalid or expired token"}`, http.StatusUnauthorized)
			return
		}

		next(w, r)
	}
}

func Protected(w http.ResponseWriter, r *http.Request) {
	filePath := "farming_data.json"

	data, err := os.ReadFile(filePath)
	if err != nil {
		http.Error(w, `{"message": "Error reading file"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}
