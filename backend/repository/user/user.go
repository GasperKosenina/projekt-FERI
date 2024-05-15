package user

import (
	"context"

	"github.com/GasperKosenina/projekt-FERI/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type MongoRepository struct {
	Client *mongo.Client
}

func (m *MongoRepository) Insert(ctx context.Context, user *model.User) error {
	collection := m.Client.Database("projekt").Collection("user")
	_, err := collection.InsertOne(ctx, user)
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoRepository) FindByID(ctx context.Context, id string) (*model.User, error) {
	collection := m.Client.Database("projekt").Collection("user")
	user := &model.User{}
	err := collection.FindOne(ctx, bson.M{"_id": id}).Decode(user)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (m *MongoRepository) UpdateByID(ctx context.Context, id string, email string) error {
	collection := m.Client.Database("projekt").Collection("user")
	_, err := collection.UpdateByID(ctx, id, bson.M{"$set": bson.M{"email": email}})
	if err != nil {
		return err
	}
	return nil
}
