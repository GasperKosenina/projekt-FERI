package dataset

import (
	"context"

	"github.com/GasperKosenina/projekt-FERI/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
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

func (m *MongoRepository) ListAll(ctx context.Context) ([]*model.Dataset, error) {
	collection := m.Client.Database("projekt").Collection("dataset")
	cursor, err := collection.Find(ctx, bson.D{{}}, options.Find())
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var datasets []*model.Dataset
	if err = cursor.All(ctx, &datasets); err != nil {
		return nil, err
	}
	return datasets, nil
}
