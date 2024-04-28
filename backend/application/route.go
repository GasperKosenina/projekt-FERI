package application

import (
	"github.com/GasperKosenina/projekt-FERI/handler"
	"github.com/GasperKosenina/projekt-FERI/repository/dataset"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func (a *App) routes() {
	e := echo.New()

	e.Use(middleware.Logger())

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
	g.GET("", datasetHandler.ListAll)
}
