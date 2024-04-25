package dataset

import (
	"context"

	"github.com/GasperKosenina/projekt-FERI/model"
	"go.mongodb.org/mongo-driver/mongo"
)

type MongoRepository struct {
	Client *mongo.Client
}

func (m *MongoRepository) Insert(ctx context.Context, dataset *model.Dataset) error {
	collection := m.Client.Database("projekt").Collection("dataset")
	_, err := collection.InsertOne(ctx, dataset)
	if err != nil {
		return err
	}
	return nil
}
