package application

import (
	"fmt"
	"net/http"

	"github.com/GasperKosenina/projekt-FERI/handler"
	"github.com/GasperKosenina/projekt-FERI/repository/dataset"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// example
type Items struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

func (a *App) routes() {
	e := echo.New()

	e.Use(middleware.Logger())

	e.GET("/call", func(c echo.Context) error {
		fmt.Println(("I got called from frontend!"))
		items := []Items{
			{ID: 1, Name: "Item 1", Description: "This is item 1"},
			{ID: 2, Name: "Item 2", Description: "This is item 2"},
		}
		return c.JSON(http.StatusOK, items)
	})

	datasetGroup := e.Group("/dataset")
	a.datasetRoute(datasetGroup)

	a.router = e
}

func (a *App) datasetRoute(g *echo.Group) {
	datasetHandler := &handler.Dataset{
		Repository: &dataset.MongoRepository{
			Client: a.db,
		},
	}

	g.POST("", datasetHandler.Create)
}
