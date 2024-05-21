package dataset

import (
	"context"

	"github.com/GasperKosenina/projekt-FERI/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
	findOptions := options.Find()
	findOptions.SetSort(bson.D{{"createdAt", -1}})
	cursor, err := collection.Find(ctx, bson.D{{}}, findOptions)
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

func (m *MongoRepository) FindByID(ctx context.Context, id string) (*model.Dataset, error) {
	collection := m.Client.Database("projekt").Collection("dataset")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var dataset model.Dataset
	if err := collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&dataset); err != nil {
		return nil, err
	}
	return &dataset, nil
}

func (m *MongoRepository) ListByUserID(ctx context.Context, userID string) ([]*model.Dataset, error) {
	collection := m.Client.Database("projekt").Collection("dataset")

	filter := bson.M{"userID": userID}

	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var datasets []*model.Dataset
	if err := cursor.All(ctx, &datasets); err != nil {
		return nil, err
	}
	return datasets, nil
}
