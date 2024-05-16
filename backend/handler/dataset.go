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
		Name        string               `json:"name"`
		URL         string               `json:"url"`
		AccessToken string               `json:"accessToken"`
		Description interface{}          `json:"description"`
		Category    string               `json:"category"`
		Duration    int                  `json:"duration"`
		UserID      string               `json:"userID"`
		Price       []model.PricePurpose `json:"price"`
	}

	if err := c.Bind(&body); err != nil {
		fmt.Println("Error binding body: ", err)
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	if body.Name == "" || body.URL == "" || body.AccessToken == "" || body.Duration == 0 || body.UserID == "" || body.Category == "" {
		fmt.Println("Missing required fields")
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	dataset := &model.Dataset{
		Name:        body.Name,
		URL:         body.URL,
		AccessToken: body.AccessToken,
		Description: body.Description,
		Duration:    body.Duration,
		Category:    body.Category,
		CreatedAt:   time.Now(),
		UserID:      body.UserID,
		Price:       body.Price,
	}

	err := d.Repository.Insert(c.Request().Context(), dataset)
	if err != nil {
		fmt.Println("Error inserting dataset: ", err)
		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}

	return c.JSON(http.StatusCreated, dataset)
}

func (d *Dataset) ListAll(c echo.Context) error {
	datasets, err := d.Repository.ListAll(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}
	return c.JSON(http.StatusOK, datasets)
}

func (d *Dataset) FindById(c echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return c.JSON(http.StatusBadRequest, "Invalid ID")
	}

	dataset, err := d.Repository.FindByID(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}

	return c.JSON(http.StatusOK, dataset)
}

func (d *Dataset) ListByUserID(c echo.Context) error {
	userID := c.Param("userID")
	if userID == "" {
		return c.JSON(http.StatusBadRequest, "Invalid User ID")
	}

	datasets, err := d.Repository.ListByUserID(c.Request().Context(), userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}

	return c.JSON(http.StatusOK, datasets)
}
