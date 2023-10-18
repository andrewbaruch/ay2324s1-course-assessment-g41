CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE refresh_tokens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    revoked BOOLEAN NOT NULL,
    expiry TIMESTAMP WITH TIME ZONE NOT NULL
);