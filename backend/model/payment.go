package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Payment struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	UserID    string             `json:"userID" bson:"userID"`
	DatasetID string             `json:"datasetID" bson:"datasetID"`
	CreatedAt time.Time          `json:"createdAt" bson:"createdAt"`
}
