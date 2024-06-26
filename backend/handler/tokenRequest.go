package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/GasperKosenina/projekt-FERI/model"
	"github.com/GasperKosenina/projekt-FERI/repository/dataset"
	"github.com/GasperKosenina/projekt-FERI/repository/tokenRequest"
	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TokenRequest struct {
	Repository        *tokenRequest.TokenRequest
	DatasetRepository *dataset.MongoRepository
}

func (t *TokenRequest) Create(c echo.Context) error {
	var body struct {
		ReqUserID  string `json:"reqUserID"`
		ProviderID string `json:"providerID"`
		DatasetID  string `json:"datasetID"`
		PaymentID  string `json:"paymentID"`
		Status     string `json:"status"`
		Reason     string `json:"reason"`
	}

	fmt.Println("Create token request")

	if err := c.Bind(&body); err != nil {
		return c.JSON(400, "Bad Request")
	}

	if body.ReqUserID == "" || body.ProviderID == "" || body.Status == "" {
		return c.JSON(400, "Bad Request")
	}

	tokenRequest := &model.TokenRequest{
		ReqUserID:    body.ReqUserID,
		ProviderID:   body.ProviderID,
		CreatedAt:    time.Now(),
		DatasetID:    body.DatasetID,
		PaymentID:    body.PaymentID,
		Status:       body.Status,
		Seen:         false,
		AcceptedSeen: false,
		DeclinedSeen: false,
		Reason:       body.Reason,
		Url:          "",
		Amount:       0,
		Payed:        false,
	}

	err := t.Repository.Insert(c.Request().Context(), tokenRequest)
	if err != nil {
		return c.JSON(500, "Internal Server Error")
	}

	return c.JSON(201, tokenRequest)
}

func (t *TokenRequest) ListAllPendingByUserID(c echo.Context) error {
	userID := c.Param("userID")
	if userID == "" {
		return c.JSON(400, "Bad Request")
	}

	tokenRequests, err := t.Repository.GetAllPendingByUserID(c.Request().Context(), userID)
	if err != nil {
		return c.JSON(500, "Internal Server Error")
	}

	return c.JSON(200, tokenRequests)
}

func (t *TokenRequest) ListAllDeclinedByUserID(c echo.Context) error {
	userID := c.Param("userID")
	if userID == "" {
		return c.JSON(400, "Bad Request")
	}

	tokenRequests, err := t.Repository.GetAllDeclinedByUserID(c.Request().Context(), userID)
	if err != nil {
		return c.JSON(500, "Internal Server Error")
	}

	return c.JSON(200, tokenRequests)
}

func (t *TokenRequest) ListAllAcceptedByUserID(c echo.Context) error {
	userID := c.Param("userID")
	if userID == "" {
		return c.JSON(400, "Bad Request")
	}

	tokenRequests, err := t.Repository.GetAllAcceptedByUserID(c.Request().Context(), userID)
	if err != nil {
		return c.JSON(500, "Internal Server Error")
	}

	return c.JSON(200, tokenRequests)
}

func (t *TokenRequest) UpdateStatus(c echo.Context) error {
	var body struct {
		PaymentID string  `json:"paymentID"`
		DatasetID string  `json:"datasetID"`
		Status    string  `json:"status"`
		Amount    float64 `json:"amount"`
	}

	if err := c.Bind(&body); err != nil {
		return c.JSON(400, "Bad Request")
	}

	id := c.Param("id")
	if id == "" || body.Status == "" {
		return c.JSON(400, "Bad Request")
	}

	var url string
	if body.Amount == 0 {
		fmt.Println("Amount is 0")
		//http://localhost:3000/dashboard/paypal/success?datasetId=664f3c1b4beb7ebb6c096cc2&payment_id=6652fd647466c714d8cad039
		url = "http://localhost:3000/dashboard/paypal/success?datasetId=" + body.DatasetID + "&payment_id=" + body.PaymentID
	} else {
		url = ""
	}

	err := t.Repository.UpdateStatus(c.Request().Context(), id, body.Status, url, body.Amount)
	if err != nil {
		return c.JSON(500, "Internal Server Error")
	}

	return c.JSON(200, "OK")
}

func (t *TokenRequest) UpdateSeen(c echo.Context) error {
	var body struct {
		Seen bool `json:"seen"`
	}
	id := c.Param("id")
	if id == "" {
		return c.JSON(400, "Bad Request")
	}

	if err := c.Bind(&body); err != nil {
		return c.JSON(400, "Bad Request")
	}

	err := t.Repository.UpdateSeen(c.Request().Context(), id, body.Seen)
	if err != nil {
		return c.JSON(500, "Internal Server Error")
	}

	return c.JSON(200, "OK")
}

func (t *TokenRequest) UpdateAcceptedSeen(c echo.Context) error {
	var body struct {
		AcceptedSeen bool `json:"acceptedSeen"`
	}
	id := c.Param("id")
	if id == "" {
		return c.JSON(400, "Bad Request")
	}

	if err := c.Bind(&body); err != nil {
		return c.JSON(400, "Bad Request")
	}

	err := t.Repository.UpdateAcceptedSeen(c.Request().Context(), id, body.AcceptedSeen)
	if err != nil {
		return c.JSON(500, "Internal Server Error")
	}

	return c.JSON(200, "OK")
}

func (t *TokenRequest) ListAll(c echo.Context) error {
	token_request, err := t.Repository.ListAll(c.Request().Context())
	if err != nil {

		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}
	return c.JSON(http.StatusOK, token_request)
}

func (t *TokenRequest) ListAllByDatasetUserID(c echo.Context) error {
	userID := c.Param("providerID")
	if userID == "" {
		return c.JSON(http.StatusBadRequest, "Bad Request")
	}

	datasets, err := t.DatasetRepository.ListByUserID(c.Request().Context(), userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Internal Server Error")
	}

	var datasetIDs []primitive.ObjectID
	for _, dataset := range datasets {
		datasetIDs = append(datasetIDs, dataset.ID)
	}

	var allPayments []*model.TokenRequest
	for _, datasetID := range datasetIDs {
		payments, err := t.Repository.FindByDatasetID(c.Request().Context(), datasetID.Hex())
		if err != nil {
			return c.JSON(http.StatusInternalServerError, "Internal Server Error")
		}

		allPayments = append(allPayments, payments...)
	}

	return c.JSON(http.StatusOK, allPayments)
}

func (t *TokenRequest) UpdatePayed(c echo.Context) error {
	var body struct {
		Payed bool `json:"payed"`
	}
	id := c.Param("id")
	if id == "" {
		return c.JSON(400, "Bad Request")
	}

	if err := c.Bind(&body); err != nil {
		return c.JSON(400, "Bad Request")
	}

	err := t.Repository.UpdatePayed(c.Request().Context(), id, body.Payed)
	if err != nil {
		return c.JSON(500, "Internal Server Error")
	}

	return c.JSON(200, "OK")
}
