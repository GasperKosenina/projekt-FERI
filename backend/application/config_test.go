package application

import (
	"os"
	"testing"
)

func TestLoadConfig(t *testing.T) {
	// Set up environment variables for testing
	os.Setenv("DB_USER", "testuser")
	os.Setenv("DB_PASS", "testpass")
	os.Setenv("DB_HOST", "testhost")

	expectedURL := "mongodb+srv://testuser:testpass@testhost/"
	config := LoadConfig()

	if config.DatabaseURL != expectedURL {
		t.Errorf("Expected DatabaseURL: %s, got: %s", expectedURL, config.DatabaseURL)
	}
}
