package application

import (
	"github.com/GasperKosenina/projekt-FERI/handler"
	"github.com/GasperKosenina/projekt-FERI/repository/dataset"
	"github.com/GasperKosenina/projekt-FERI/repository/payment"
	"github.com/GasperKosenina/projekt-FERI/repository/user"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func (a *App) routes() {
	e := echo.New()

	e.Use(middleware.Logger())

	datasetGroup := e.Group("/dataset")
	a.datasetRoute(datasetGroup)

	userGroup := e.Group("/user")
	a.userRoute(userGroup)

	paymentGroup := e.Group("/payment")
	a.paymentRoute(paymentGroup)

	e.POST("login", handler.Login)
	e.GET("protected", handler.Protected, handler.JWTAuthMiddleware)
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
	g.GET("/:id", datasetHandler.FindById)
	g.GET("/user/:userID", datasetHandler.ListByUserID)

}

func (a *App) userRoute(g *echo.Group) {
	userHandler := &handler.User{
		Reposeitory: &user.MongoRepository{
			Client: a.db,
		},
	}

	g.POST("", userHandler.Create)
	g.GET("/:id", userHandler.GetByID)
	g.PUT("/email/:id", userHandler.UpdateEmailByID)
}

func (a *App) paymentRoute(g *echo.Group) {
	paymentHandler := &handler.Payment{
		Repository: &payment.MongoRepository{
			Client: a.db,
		},
		DatasetRepository: &dataset.MongoRepository{
			Client: a.db,
		},
	}

	g.POST("", paymentHandler.Create)
	g.PUT("/:id", paymentHandler.UpdateAccessToken)
	g.PUT("/status/:id", paymentHandler.UpdatePaymentStatus)
	g.GET("/:id", paymentHandler.GetByID)
	// g.GET("/purchased/:userID", paymentHandler.FindByUserID)
	g.GET("/user/:userID", paymentHandler.ListAllByDatasetUserID)
	g.GET("/purchased/:userID", paymentHandler.ListPurchasedDatasetsByUserID)
	g.GET("/dataset/:userID", paymentHandler.ListAllByDatasetUserID)
}
