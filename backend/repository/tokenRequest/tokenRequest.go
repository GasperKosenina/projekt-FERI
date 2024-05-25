package tokenRequest

import (
	"context"

	"github.com/GasperKosenina/projekt-FERI/model"
	"go.mongodb.org/mongo-driver/mongo"
)

type TokenRequest struct {
	Client *mongo.Client
}

func (t *TokenRequest) Insert(ctx context.Context, tokenRequest *model.TokenRequest) error {
	collection := t.Client.Database("projekt").Collection("tokenRequest")
	_, err := collection.InsertOne(ctx, tokenRequest)
	if err != nil {
		return err
	}
	return nil
}
