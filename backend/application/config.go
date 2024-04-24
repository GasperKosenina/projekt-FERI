package application

import (
	"fmt"
	"os"
)

type Config struct {
	DatabaseURL string
}

func LoadConfig() Config {
	url := fmt.Sprintf("mongodb+srv://%s:%s@%s/", os.Getenv("DB_USER"), os.Getenv("DB_PASS"), os.Getenv("DB_HOST"))
	return Config{
		DatabaseURL: url,
	}
}
