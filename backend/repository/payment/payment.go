package payment

import (
	"context"

	"github.com/GasperKosenina/projekt-FERI/model"
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
