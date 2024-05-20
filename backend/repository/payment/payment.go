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

func (p *MongoRepository) Insert(ctx context.Context, payment *model.Payment) (*model.Payment, error) {
	collection := p.Client.Database("projekt").Collection("payment")

	result, err := collection.InsertOne(ctx, payment)
	if err != nil {
		return nil, err
	}

	insertedID := result.InsertedID.(primitive.ObjectID)

	var createdPayment model.Payment
	err = collection.FindOne(ctx, bson.M{"_id": insertedID}).Decode(&createdPayment)
	if err != nil {
		return nil, err
	}

	return &createdPayment, nil
}

func (p *MongoRepository) UpdateAccessToken(ctx context.Context, id string, accessToken bool) error {
	collection := p.Client.Database("projekt").Collection("payment")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = collection.UpdateOne(ctx, bson.M{"_id": objectID}, bson.M{"$set": bson.M{"accessToken": accessToken}})
	if err != nil {
		return err
	}
	return nil
}

func (p *MongoRepository) UpdatePaymentStatus(ctx context.Context, id string, paymentStatus bool) error {
	collection := p.Client.Database("projekt").Collection("payment")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = collection.UpdateOne(ctx, bson.M{"_id": objectID}, bson.M{"$set": bson.M{"paymentStatus": paymentStatus}})
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
