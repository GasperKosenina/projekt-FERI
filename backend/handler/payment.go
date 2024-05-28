package handler

import (
	"net/http"
	"time"

	"github.com/GasperKosenina/projekt-FERI/model"
	"github.com/GasperKosenina/projekt-FERI/repository/dataset"
	"github.com/GasperKosenina/projekt-FERI/repository/payment"
	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Payment struct {
	Repository        *payment.MongoRepository
	DatasetRepository *dataset.MongoRepository
}

func (p *Payment) Create(c echo.Context) error {

	var body struct {
		UserID    string  `json:"userId"`
		DatasetID string  `json:"datasetId"`
		Amount    float64 `json:"amount"`
	}

	if err := c.Bind(&body); err != nil {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	if body.UserID == "" || body.DatasetID == "" {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	payment := &model.Payment{
		UserID:         body.UserID,
		DatasetID:      body.DatasetID,
		CreatedAt:      time.Now(),
		Amount:         body.Amount,
		AccessToken:    false,
		Payment_Status: false,
		TokenCreatedAt: time.Now(),
	}

	createdPayment, err := p.Repository.Insert(c.Request().Context(), payment)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}

	return c.JSON(http.StatusCreated, &createdPayment)
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

func (p *Payment) UpdatePaymentStatus(c echo.Context) error {
	var body struct {
		PaymentStatus bool `json:"paymentStatus"`
	}

	if err := c.Bind(&body); err != nil {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	id := c.Param("id")
	if id == "" {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	err := p.Repository.UpdatePaymentStatus(c.Request().Context(), id, body.PaymentStatus)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}

	return c.JSON(http.StatusOK, "OK")
}

func (p *Payment) UpdateTokenCreatedAt(c echo.Context) error {
	var body struct {
		TokenCreatedAt time.Time `json:"tokenCreatedAt"`
	}

	if err := c.Bind(&body); err != nil {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	id := c.Param("id")
	if id == "" {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	err := p.Repository.UpdateTokenCreatedAt(c.Request().Context(), id, body.TokenCreatedAt)
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

func (p *Payment) ListAllByDatasetUserID(c echo.Context) error {
	userID := c.Param("userID")
	if userID == "" {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	datasets, err := p.DatasetRepository.ListByUserID(c.Request().Context(), userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}

	var datasetIDs []primitive.ObjectID
	for _, dataset := range datasets {
		datasetIDs = append(datasetIDs, dataset.ID)
	}

	var allPayments []*model.Payment
	for _, datasetID := range datasetIDs {
		payments, err := p.Repository.FindByDatasetID(c.Request().Context(), datasetID.Hex())
		if err != nil {
			return c.JSON(http.StatusInternalServerError, "Internal Server Error")
		}

		allPayments = append(allPayments, payments...)
	}

	return c.JSON(http.StatusOK, allPayments)
}

func (p *Payment) ListAllByDatasetUserID2(c echo.Context) error {
	userID := c.Param("userID")
	if userID == "" {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	datasets, err := p.DatasetRepository.ListByUserID(c.Request().Context(), userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}

	var datasetIDs []primitive.ObjectID
	for _, dataset := range datasets {
		datasetIDs = append(datasetIDs, dataset.ID)
	}

	var allPayments []*model.Payment
	for _, datasetID := range datasetIDs {
		payments, err := p.Repository.FindByDatasetID2(c.Request().Context(), datasetID.Hex())
		if err != nil {
			return c.JSON(http.StatusInternalServerError, "Internal Server Error")
		}

		allPayments = append(allPayments, payments...)
	}

	return c.JSON(http.StatusOK, allPayments)
}

func (p *Payment) ListPurchasedDatasetsByUserID(c echo.Context) error {
	userID := c.Param("userID")
	if userID == "" {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	payments, err := p.Repository.FindByUserID(c.Request().Context(), userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}

	var datasetIDs []string
	for _, payment := range payments {
		datasetIDs = append(datasetIDs, payment.DatasetID)
	}

	var purchasedDatasets []*model.Dataset
	for _, datasetID := range datasetIDs {
		dataset, err := p.DatasetRepository.FindByID(c.Request().Context(), datasetID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, "Internal Server Error")
		}
		purchasedDatasets = append(purchasedDatasets, dataset)
	}

	return c.JSON(http.StatusOK, purchasedDatasets)
}

func (p *Payment) GetByDatasetID(c echo.Context) error {
	datasetID := c.Param("datasetID")
	userId := c.Param("userID")
	if datasetID == "" {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	payment, err := p.Repository.FindOneByDatasetID(c.Request().Context(), datasetID, userId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}
	if payment == nil {
		return c.JSON(http.StatusNotFound, "No payment found for the given datasetID")
	}

	return c.JSON(http.StatusOK, payment)
}

func (p *Payment) GetAllByDatasetID(c echo.Context) error {
	datasetID := c.Param("datasetID")
	if datasetID == "" {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	payments, err := p.Repository.FindAllByDatasetID(c.Request().Context(), datasetID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}
	if len(payments) == 0 {
		return c.JSON(http.StatusNotFound, "No payments found for the given datasetID")
	}

	return c.JSON(http.StatusOK, payments)
}

func (p *Payment) ListAll(c echo.Context) error {
	payments, err := p.Repository.ListAll(c.Request().Context())

	if err != nil {

		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}
	return c.JSON(http.StatusOK, payments)
}
