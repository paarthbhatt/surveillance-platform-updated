-- Database schema for surveillance tracking system
-- This SQL can be run on Supabase or Neon free tier

-- Create facilities table
CREATE TABLE IF NOT EXISTS facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES facilities(id),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  device_type VARCHAR(50) DEFAULT 'camera',
  api_key_hash VARCHAR(64) NOT NULL UNIQUE,
  status VARCHAR(20) DEFAULT 'offline',
  last_seen TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tracking_events table
CREATE TABLE IF NOT EXISTS tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id),
  facility_id UUID NOT NULL REFERENCES facilities(id),
  timestamp TIMESTAMP NOT NULL,
  encrypted_data JSONB NOT NULL,
  event_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  facility_id UUID NOT NULL REFERENCES facilities(id),
  action VARCHAR(255) NOT NULL,
  resource VARCHAR(255),
  status VARCHAR(20),
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  facility_id UUID NOT NULL REFERENCES facilities(id),
  role VARCHAR(20) DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their facility's data
CREATE POLICY "Users see own facility tracking events"
ON tracking_events FOR SELECT
USING (facility_id IN (
  SELECT facility_id FROM users WHERE id = auth.uid()
));

CREATE POLICY "Users see own facility devices"
ON devices FOR SELECT
USING (facility_id IN (
  SELECT facility_id FROM users WHERE id = auth.uid()
));

-- Create indexes for performance
CREATE INDEX idx_tracking_events_facility_timestamp 
ON tracking_events(facility_id, timestamp DESC);

CREATE INDEX idx_tracking_events_device_timestamp 
ON tracking_events(device_id, timestamp DESC);

CREATE INDEX idx_devices_facility 
ON devices(facility_id);

CREATE INDEX idx_audit_logs_user_facility 
ON audit_logs(user_id, facility_id);
