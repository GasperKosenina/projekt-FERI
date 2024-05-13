package handler

import (
	"net/http"

	"github.com/GasperKosenina/projekt-FERI/model"
	"github.com/GasperKosenina/projekt-FERI/repository/user"
	"github.com/labstack/echo/v4"
)

type User struct {
	Reposeitory *user.MongoRepository
}

func (u *User) Create(c echo.Context) error {
	var body struct {
		ID   string `json:"id"`
		Type string `json:"userType"`
	}

	if err := c.Bind(&body); err != nil {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	if body.ID == "" || body.Type == "" {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	user := &model.User{
		ID:   body.ID,
		Type: body.Type,
	}

	err := u.Reposeitory.Insert(c.Request().Context(), user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}

	return c.JSON(http.StatusCreated, body)
}

func (u *User) GetByID(c echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	user, err := u.Reposeitory.FindByID(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusNotFound, "Not Found")
	}

	return c.JSON(http.StatusOK, user)
}
