package main

import (
	"log"

	"github.com/GasperKosenina/projekt-FERI/application"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Failed load env variables: %v\n", err)
	}

	app, err := application.NewApp(application.LoadConfig())
	if err != nil {
		log.Fatalf("Failed to initialize the application: %v\n", err)
	}

	log.Printf("Starting the application...\n")

	err = app.Start()
	if err != nil {
		log.Fatalf("Failed to start the application: %v\n", err)
	}
}
