package tokenRequest

import (
	"context"

	"github.com/GasperKosenina/projekt-FERI/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

func (t *TokenRequest) GetAllPendingByUserID(ctx context.Context, userID string) ([]model.TokenRequest, error) {
	collection := t.Client.Database("projekt").Collection("tokenRequest")
	cursor, err := collection.Find(ctx, map[string]string{"providerID": userID, "status": "pending"})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var tokenRequests []model.TokenRequest
	for cursor.Next(ctx) {
		var tokenRequest model.TokenRequest
		cursor.Decode(&tokenRequest)
		tokenRequests = append(tokenRequests, tokenRequest)
	}

	return tokenRequests, nil
}

func (t *TokenRequest) UpdateStatus(ctx context.Context, id string, status string) error {
	collection := t.Client.Database("projekt").Collection("tokenRequest")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = collection.UpdateOne(ctx, bson.M{"_id": objectID}, bson.M{"$set": bson.M{"status": status}})
	if err != nil {
		return err
	}

	return nil
}
