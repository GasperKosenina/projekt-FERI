package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Payment struct {
	ID             primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	UserID         string             `json:"userId" bson:"userId"`
	DatasetID      string             `json:"datasetId" bson:"datasetId"`
	AccessToken    bool               `json:"accessToken" bson:"accessToken"`
	Payment_Status bool               `json:"paymentStatus" bson:"paymentStatus"`
	CreatedAt      time.Time          `json:"createdAt" bson:"createdAt"`
}
