package model

type User struct {
	ID    string `bson:"_id,omitempty" json:"id,omitempty"`
	Type  string `bson:"type" json:"type"`
	Email string `bson:"email" json:"email"`
}
