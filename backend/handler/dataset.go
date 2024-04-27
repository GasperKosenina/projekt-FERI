package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/GasperKosenina/projekt-FERI/model"
	"github.com/GasperKosenina/projekt-FERI/repository/dataset"
	"github.com/labstack/echo/v4"
)

type Dataset struct {
	Repository *dataset.MongoRepository
}

func (d *Dataset) Create(c echo.Context) error {
	var body struct {
		Name        string      `json:"name"`
		URL         string      `json:"url"`
		AccessToken string      `json:"accessToken"`
		Price       float64     `json:"price"`
		Description interface{} `json:"description"`
		Duration    int         `json:"duration"`
		UserID      string      `json:"userID"`
	}

	if err := c.Bind(&body); err != nil {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	if body.Name == "" || body.URL == "" || body.AccessToken == "" || body.Price == 0 || body.Duration == 0 || body.UserID == "" {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	dataset := &model.Dataset{
		Name:        body.Name,
		URL:         body.URL,
		AccessToken: body.AccessToken,
		Price:       body.Price,
		Description: body.Description,
		Duration:    body.Duration,
		CreatedAt:   time.Now(),
		UserID:      body.UserID,
	}

	err := d.Repository.Insert(c.Request().Context(), dataset)
	if err != nil {
		fmt.Println("Error inserting dataset: ", err)
		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}

	return c.JSON(http.StatusCreated, dataset)
}
