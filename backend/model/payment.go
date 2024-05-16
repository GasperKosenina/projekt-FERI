package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	PaymentStatusPending   = "pending"
	PaymentStatusCompleted = "completed"
	PaymentStatusFailed    = "failed"
)

type Payment struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	UserID      string             `json:"userId" bson:"userId"`
	DatasetID   string             `json:"datasetId" bson:"datasetId"`
	Status      string             `json:"status" bson:"status"`
	AccessToken bool               `json:"accessToken" bson:"accessToken"`
	CreatedAt   time.Time          `json:"createdAt" bson:"createdAt"`
}
