package dataset

import (
	"context"

	"github.com/GasperKosenina/projekt-FERI/model"
)

type MockMongoRepository struct {
}

func (m *MockMongoRepository) Insert(ctx context.Context, dataset *model.Dataset) error {
	return nil
}

func (m *MockMongoRepository) ListAll(ctx context.Context) ([]*model.Dataset, error) {
	datasets := []*model.Dataset{
		{
			Name:        "Test1",
			URL:         "http://test1.com",
			AccessToken: "test1",
			Description: "Test1",
			Category:    "Test1",
			Duration:    1,
			UserID:      "test1",
			Price: []model.PricePurpose{
				{
					Purpose: "Test1",
					Price:   1,
				},
			},
			Show: true,
		},
	}
	return datasets, nil
}

func (m *MockMongoRepository) FindByID(ctx context.Context, id string) (*model.Dataset, error) {
	return nil, nil
}

func (m *MockMongoRepository) ListByUserID(ctx context.Context, userID string) ([]*model.Dataset, error) {
	return nil, nil
}

func (m *MockMongoRepository) UpdateShowStatus(ctx context.Context, id string, show bool) error {
	return nil
}
