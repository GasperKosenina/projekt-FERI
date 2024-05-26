package handler

import (
	"time"

	"github.com/GasperKosenina/projekt-FERI/model"
	"github.com/GasperKosenina/projekt-FERI/repository/tokenRequest"
	"github.com/labstack/echo/v4"
)

type TokenRequest struct {
	Repository *tokenRequest.TokenRequest
}

func (t *TokenRequest) Create(c echo.Context) error {
	var body struct {
		ReqUserID  string `json:"reqUserID"`
		ProviderID string `json:"providerID"`
		DatasetID  string `json:"datasetID"`
		Status     string `json:"status"`
	}

	if err := c.Bind(&body); err != nil {
		return c.JSON(400, "Bad Request")
	}

	if body.ReqUserID == "" || body.ProviderID == "" || body.Status == "" {
		return c.JSON(400, "Bad Request")
	}

	tokenRequest := &model.TokenRequest{
		ReqUserID:  body.ReqUserID,
		ProviderID: body.ProviderID,
		CreatedAt:  time.Now(),
		DatasetID:  body.DatasetID,
		Status:     body.Status,
		Url:        "",
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

func (t *TokenRequest) UpdateStatus(c echo.Context) error {
	var body struct {
		Status string `json:"status"`
	}

	if err := c.Bind(&body); err != nil {
		return c.JSON(400, "Bad Request")
	}

	id := c.Param("id")
	if id == "" || body.Status == "" {
		return c.JSON(400, "Bad Request")
	}

	err := t.Repository.UpdateStatus(c.Request().Context(), id, body.Status)
	if err != nil {
		return c.JSON(500, "Internal Server Error")
	}

	return c.JSON(200, "OK")
}
