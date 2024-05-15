package handler

import (
	"net/http"
	"time"

	"github.com/GasperKosenina/projekt-FERI/model"
	"github.com/GasperKosenina/projekt-FERI/repository/payment"
	"github.com/labstack/echo/v4"
)

type Payment struct {
	Repository *payment.MongoRepository
}

func (p *Payment) Create(c echo.Context) error {

	var body struct {
		UserID    string `json:"userId"`
		DatasetID string `json:"datasetId"`
	}

	if err := c.Bind(&body); err != nil {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	if body.UserID == "" || body.DatasetID == "" {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	payment := &model.Payment{
		UserID:    body.UserID,
		DatasetID: body.DatasetID,
		CreatedAt: time.Now(),
	}

	err := p.Repository.Insert(c.Request().Context(), payment)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}

	return c.JSON(http.StatusCreated, payment)
}
