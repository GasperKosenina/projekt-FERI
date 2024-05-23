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
	Description interface{}        `bson:"description" json:"description"`
	Category    string             `bson:"category" json:"category"`
	Duration    int                `bson:"duration" json:"duration"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UserID      string             `bson:"userID" json:"userID"`
	Price       []PricePurpose     `bson:"price" json:"price"`
	Show        bool               `json:"show" bson:"show"`
}

type PricePurpose struct {
	Purpose string  `bson:"purpose" json:"purpose"`
	Price   float64 `bson:"price" json:"price"`
}
