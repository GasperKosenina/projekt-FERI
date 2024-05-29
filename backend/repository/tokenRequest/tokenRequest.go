package tokenRequest

import (
	"context"
	"fmt"

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

func (t *TokenRequest) GetAllDeclinedByUserID(ctx context.Context, userID string) ([]model.TokenRequest, error) {
	collection := t.Client.Database("projekt").Collection("tokenRequest")
	cursor, err := collection.Find(ctx, map[string]string{"reqUserID": userID, "status": "declined"})
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

func (t *TokenRequest) GetAllAcceptedByUserID(ctx context.Context, userID string) ([]model.TokenRequest, error) {
	collection := t.Client.Database("projekt").Collection("tokenRequest")
	cursor, err := collection.Find(ctx, map[string]string{"reqUserID": userID, "status": "accepted"})
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

func (t *TokenRequest) UpdateStatus(ctx context.Context, id string, status string, url string, amount float64) error {
	collection := t.Client.Database("projekt").Collection("tokenRequest")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = collection.UpdateOne(ctx, bson.M{"_id": objectID}, bson.M{"$set": bson.M{"status": status, "url": url, "amount": amount}})
	if err != nil {
		return err
	}

	return nil
}

func (t *TokenRequest) UpdateSeen(ctx context.Context, id string, seen bool) error {
	collection := t.Client.Database("projekt").Collection("tokenRequest")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = collection.UpdateOne(ctx, bson.M{"_id": objectID}, bson.M{"$set": bson.M{"seen": seen}})
	if err != nil {
		return err
	}

	return nil
}

func (t *TokenRequest) ListAll(ctx context.Context) ([]*model.TokenRequest, error) {
	collection := t.Client.Database("projekt").Collection("tokenRequest")
	//findOptions := options.Find()
	//findOptions.SetSort(bson.D{{"createdAt", -1}})
	cursor, err := collection.Find(ctx, bson.D{{}})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var token_request []*model.TokenRequest
	if err = cursor.All(ctx, &token_request); err != nil {
		return nil, err
	}
	return token_request, nil
}

func (t *TokenRequest) FindByDatasetID(ctx context.Context, datasetID string) ([]*model.TokenRequest, error) {
	fmt.Println(datasetID)
	collection := t.Client.Database("projekt").Collection("tokenRequest")

	filter := bson.M{"datasetID": datasetID, "status": "accepted"}

	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var tokenRequests []*model.TokenRequest
	if err := cursor.All(ctx, &tokenRequests); err != nil {
		return nil, err
	}

	return tokenRequests, nil
}
