package handler

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
)

// var jwtSecretKey = []byte("super-secret")
var jwtSecret = []byte("")

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
		Exp   int64  `json:"experation"`
	}
	if err := c.Bind(&tokenRequest); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"message": "Missing or invalid JSON in request"})
	}

	jwtSecret = []byte(tokenRequest.Token)

	expirationTime := time.Now().Add(time.Duration(tokenRequest.Exp) * time.Hour).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp": expirationTime,
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"message": "Could not create token"})
	}

	return c.JSON(http.StatusOK, echo.Map{"access_token": tokenString})
}

func Protected(c echo.Context) error {
	return c.JSON(http.StatusOK, jsonData)
}

func JWTAuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		authHeader := c.Request().Header.Get("Authorization")
		if authHeader == "" {
			return c.JSON(http.StatusUnauthorized, echo.Map{"message": "Missing auth token"})
		}

		splitToken := strings.Split(authHeader, "Bearer ")
		if len(splitToken) != 2 {
			return c.JSON(http.StatusUnauthorized, echo.Map{"message": "Invalid auth token"})
		}

		tokenStr := splitToken[1]
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			return c.JSON(http.StatusUnauthorized, echo.Map{"message": "Invalid or expired token"})
		}

		return next(c)
	}
}
