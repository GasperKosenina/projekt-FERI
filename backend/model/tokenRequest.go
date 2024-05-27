package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TokenRequest struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	ReqUserID  string             `bson:"reqUserID" json:"reqUserID"`
	ProviderID string             `bson:"providerID" json:"providerID"`
	DatasetID  string             `bson:"datasetID" json:"datasetID"`
	PaymentID  string             `bson:"paymentID" json:"paymentID"`
	CreatedAt  time.Time          `bson:"createdAt" json:"createdAt"`
	Status     string             `bson:"status" json:"status"`
	Url        string             `bson:"url" json:"url"`
	Seen       bool               `bson:"seen" json:"seen"`
	Reason     string             `bson:"reason" json:"reason"`
}
