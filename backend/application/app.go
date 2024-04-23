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
)

type App struct {
	router http.Handler
}

func NewApp() (*App, error) {
	app := &App{}

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

	return nil
}
