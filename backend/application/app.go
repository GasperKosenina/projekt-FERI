package application

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type App struct {
	router http.Handler
	db     *mongo.Client
}

func NewApp(cfg Config) (*App, error) {
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)

	clientOptions := options.Client().
		ApplyURI(cfg.DatabaseURL).
		SetServerAPIOptions(serverAPI)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Printf("Failed to connect to MongoDB: %v\n", err)
		return nil, err
	}

	if err := client.Ping(ctx, nil); err != nil {
		log.Printf("Failed to ping MongoDB: %v\n", err)
		return nil, err
	}

	app := &App{
		db: client,
	}

	app.routes()

	return app, nil
}

func (a *App) Start() error {
	server := http.Server{
		Addr:    ":8000",
		Handler: a.router,
	}

	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("HTTP server ListenAndServe: %v\n", err)
		}
	}()

	fmt.Printf("Server is running on %s\n", server.Addr)

	stopChan := make(chan os.Signal, 1)
	signal.Notify(stopChan, os.Interrupt, syscall.SIGTERM)
	<-stopChan

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("HTTP server Shutdown: %v\n", err)
	}

	if err := a.db.Disconnect(ctx); err != nil {
		log.Printf("Failed to disconnect from MongoDB: %v\n", err)
	}

	log.Println("Server gracefully stopped")

	return nil
}
