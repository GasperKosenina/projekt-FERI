package handler

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
)

var jwtSecretKey = []byte("super-secret")

/* var tokenList = map[string]string{
	"secret": "user_id",
	"123":    "user_id",
} */

var jsonData = []map[string]interface{}{
	{"medicineId": 1, "medicineName": "Ibuprofen"},
}

func Login(c echo.Context) error {
	var tokenRequest struct {
		Token string `json:"token"`
	}

	if err := c.Bind(&tokenRequest); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"message": "Missing or invalid JSON in request"})
	}
	/*
		userID, exists := tokenList[tokenRequest.Token]
		if !exists {
			return c.JSON(http.StatusUnauthorized, echo.Map{"message": "Invalid access token"})
		} */

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		//"user_id": userID,
		"exp": time.Now().Add(time.Minute * 30).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecretKey)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"message": "Could not create token"})
	}

	return c.JSON(http.StatusOK, echo.Map{"access_token": tokenString})
}

func Protected(c echo.Context) error {
	return c.JSON(http.StatusOK, jsonData)
}

func JwtMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		authHeader := c.Request().Header.Get("Authorization")
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Authorization header format must be Bearer {token}"})
		}
		tokenString := parts[1]

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return jwtSecretKey, nil
		})

		if err != nil {
			return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Error parsing token", "error": err.Error()})
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			c.Set("user_id", claims["user_id"])
			return next(c)
		}

		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Invalid token"})
	}
}
