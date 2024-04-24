package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Dataset struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name        string             `bson:"name" json:"name"`
	URL         string             `bson:"url" json:"url"`
	AccessToken string             `bson:"accessToken" json:"accessToken"`
	Price       float64            `bson:"price" json:"price"`
	Description interface{}        `bson:"description" json:"description"` // JSON Schema as an interface{}
	Duration    time.Duration      `bson:"expDate" json:"expDate"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UserID      string             `bson:"userID" json:"userID"`
}
