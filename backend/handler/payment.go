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
		UserID:      body.UserID,
		DatasetID:   body.DatasetID,
		CreatedAt:   time.Now(),
		Status:      model.PaymentStatusCompleted,
		AccessToken: false,
	}

	createdPayment, err := p.Repository.Insert(c.Request().Context(), payment)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}

	return c.JSON(http.StatusCreated, &createdPayment.ID)
}

func (p *Payment) UpdateAccessToken(c echo.Context) error {
	var body struct {
		AccessToken bool `json:"accessToken"`
	}

	if err := c.Bind(&body); err != nil {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	id := c.Param("id")
	if id == "" {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	err := p.Repository.UpdateAccessToken(c.Request().Context(), id, body.AccessToken)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}

	return c.JSON(http.StatusOK, "OK")
}

func (p *Payment) GetByID(c echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	payment, err := p.Repository.FindByID(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusNotFound, "Not Found")
	}

	return c.JSON(http.StatusOK, payment)
}
