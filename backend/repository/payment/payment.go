package payment

import (
	"context"

	"github.com/GasperKosenina/projekt-FERI/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type MongoRepository struct {
	Client *mongo.Client
}

func (p *MongoRepository) Insert(ctx context.Context, payment *model.Payment) error {
	collection := p.Client.Database("projekt").Collection("payment")
	_, err := collection.InsertOne(ctx, payment)
	if err != nil {
		return err
	}
	return nil
}

func (p *MongoRepository) UpdateStatus(ctx context.Context, id string, status string) error {
	collection := p.Client.Database("projekt").Collection("payment")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	filter := bson.M{"_id": objectID}
	update := bson.M{"$set": bson.M{"status": status}}

	_, err = collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}
	return nil
}

func (p *MongoRepository) FindByID(ctx context.Context, id string) (*model.Payment, error) {
	collection := p.Client.Database("projekt").Collection("payment")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	payment := &model.Payment{}
	err = collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(payment)
	if err != nil {
		return nil, err
	}
	return payment, nil
}
