CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE matching_pairs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id1 VARCHAR(255) NOT NULL,
    user_id2 VARCHAR(255) NOT NULL,
    room_id INTEGER
);