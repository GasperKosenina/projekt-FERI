package handler

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/GasperKosenina/projekt-FERI/repository/dataset"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestListAll(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/datasets", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	// mockRepo := &dataset.MockMongoRepository{}
	datasetHandler := &Dataset{
		Repository: &dataset.MongoRepository{Client: nil},
	}

	if assert.NoError(t, datasetHandler.ListAll(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Contains(t, rec.Body.String(), "Test1")
	}
}
