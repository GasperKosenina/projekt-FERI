package main

import (
	"log"

	"github.com/GasperKosenina/projekt-FERI/application"
)

func main() {
	app, err := application.NewApp()
	if err != nil {
		log.Fatalf("Failed to initialize the application: %v\n", err)
	}

	log.Printf("Starting the application...\n")
	err = app.Start()
	if err != nil {
		log.Fatalf("Failed to start the application: %v\n", err)
	}
}
