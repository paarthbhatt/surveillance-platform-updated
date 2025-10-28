# SurveillanceOps - Complete API Documentation

## Overview
All API endpoints are located in `/app/api/` and use Next.js Route Handlers.

## Authentication
- **Method**: API Key in headers
- **Header**: `x-api-key: <device_api_key>`
- **Format**: 64-character hexadecimal string

## Response Format
All endpoints return JSON with this structure:
\`\`\`json
{
  "success": true/false,
  "data": {},
  "error": "error message if failed"
}
\`\`\`

---

## Tracking Endpoints

### POST /api/tracking/update
Submit encrypted tracking data from edge devices.

**Request**
\`\`\`bash
curl -X POST http://localhost:3000/api/tracking/update \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{
    "device_id": "device-1",
    "facility_id": "facility-1",
    "timestamp": "2025-10-28T12:00:00Z",
    "encrypted_data": {
      "iv": "hex_string",
      "data": "hex_string",
      "authTag": "hex_string"
    }
  }'
\`\`\`

**Response**
\`\`\`json
{
  "success": true,
  "event_id": "uuid",
  "message": "Tracking data received and encrypted"
}
\`\`\`

**Status Codes**
- `200`: Success
- `400`: Missing required fields
- `401`: Invalid API key
- `500`: Server error

---

### GET /api/tracking/events
Retrieve tracking events for a facility.

**Request**
\`\`\`bash
curl http://localhost:3000/api/tracking/events?facility_id=facility-1&limit=50
\`\`\`

**Query Parameters**
| Parameter | Type | Required | Default |
|-----------|------|----------|---------|
| `facility_id` | string | ✅ Yes | - |
| `limit` | number | ❌ No | 100 |

**Response**
\`\`\`json
{
  "success": true,
  "count": 50,
  "events": [
    {
      "id": "uuid",
      "device_id": "device-1",
      "facility_id": "facility-1",
      "timestamp": "2025-10-28T12:00:00Z",
      "data": {
        "objects": [
          {
            "id": 1,
            "class": "person",
            "bbox": [100, 200, 50, 100],
            "confidence": 0.95,
            "centroid": [125, 250]
          }
        ]
      },
      "created_at": "2025-10-28T12:00:00Z"
    }
  ]
}
\`\`\`

---

## Device Endpoints

### POST /api/devices/register
Register a new surveillance device.

**Request**
\`\`\`bash
curl -X POST http://localhost:3000/api/devices/register \
  -H "Content-Type: application/json" \
  -d '{
    "facility_id": "facility-1",
    "device_name": "Main Entrance Camera",
    "location": "North Gate",
    "device_type": "camera"
  }'
\`\`\`

**Request Body**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `facility_id` | string | ✅ Yes | Facility identifier |
| `device_name` | string | ✅ Yes | Device name |
| `location` | string | ❌ No | Physical location |
| `device_type` | string | ❌ No | Type of device |

**Response**
\`\`\`json
{
  "success": true,
  "device_id": "uuid",
  "api_key": "64_character_hex_string",
  "message": "Device registered successfully. Store the API key securely."
}
\`\`\`

**Important**: Store the API key securely. It won't be shown again.

---

### GET /api/devices/status
Get device status and health information.

**Request**
\`\`\`bash
curl http://localhost:3000/api/devices/status?facility_id=facility-1
\`\`\`

**Query Parameters**
| Parameter | Type | Required |
|-----------|------|----------|
| `facility_id` | string | ✅ Yes |

**Response**
\`\`\`json
{
  "success": true,
  "devices": [
    {
      "id": "uuid",
      "facility_id": "facility-1",
      "name": "Main Entrance Camera",
      "location": "North Gate",
      "status": "online",
      "last_seen": "2025-10-28T12:00:00Z",
      "created_at": "2025-10-28T11:00:00Z"
    }
  ]
}
\`\`\`

**Status Values**
- `online`: Device is actively sending data
- `offline`: Device hasn't sent data recently
- `warning`: Device is sending data but with issues

---

## Simulator Endpoints

### POST /api/simulator/start
Start the edge device simulator for testing.

**Request**
\`\`\`bash
curl -X POST http://localhost:3000/api/simulator/start \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "device-1",
    "facility_id": "facility-1",
    "api_key": "your_api_key",
    "interval_ms": 2000
  }'
\`\`\`

**Request Body**
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `device_id` | string | ✅ Yes | - | Device identifier |
| `facility_id` | string | ✅ Yes | - | Facility identifier |
| `api_key` | string | ✅ Yes | - | Device API key |
| `interval_ms` | number | ❌ No | 2000 | Data send interval in ms |

**Response**
\`\`\`json
{
  "success": true,
  "message": "Simulator started for device device-1",
  "interval_ms": 2000
}
\`\`\`

---

### POST /api/simulator/stop
Stop the edge device simulator.

**Request**
\`\`\`bash
curl -X POST http://localhost:3000/api/simulator/stop \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "device-1"
  }'
\`\`\`

**Request Body**
| Field | Type | Required |
|-------|------|----------|
| `device_id` | string | ✅ Yes |

**Response**
\`\`\`json
{
  "success": true,
  "message": "Simulator stopped for device device-1"
}
\`\`\`

---

## Audit Endpoints

### GET /api/audit/logs
Retrieve audit logs for compliance and security.

**Request**
\`\`\`bash
curl http://localhost:3000/api/audit/logs?user_id=user-1&limit=100
\`\`\`

**Query Parameters**
| Parameter | Type | Required | Default |
|-----------|------|----------|---------|
| `user_id` | string | ✅ Yes | - |
| `limit` | number | ❌ No | 100 |

**Response**
\`\`\`json
{
  "success": true,
  "logs": [
    {
      "id": "uuid",
      "user_id": "user-1",
      "action": "tracking_data_received",
      "resource": "device:device-1",
      "status": "success",
      "timestamp": "2025-10-28T12:00:00Z",
      "ip_address": "192.168.1.1"
    }
  ]
}
\`\`\`

**Status Values**
- `success`: Action completed successfully
- `failure`: Action failed

---

## Health Endpoint

### GET /api/health
Check system health and status.

**Request**
\`\`\`bash
curl http://localhost:3000/api/health
\`\`\`

**Response**
\`\`\`json
{
  "status": "healthy",
  "timestamp": "2025-10-28T12:00:00Z",
  "version": "1.0.0",
  "uptime": 3600,
  "services": {
    "database": "connected",
    "encryption": "operational",
    "simulator": "ready"
  }
}
\`\`\`

---

## Error Handling

### Common Error Responses

**Missing API Key**
\`\`\`json
{
  "error": "Missing API key",
  "status": 401
}
\`\`\`

**Invalid Request**
\`\`\`json
{
  "error": "Missing required fields",
  "status": 400
}
\`\`\`

**Server Error**
\`\`\`json
{
  "error": "Failed to process request",
  "status": 500
}
\`\`\`

---

## Rate Limiting

Currently no rate limiting is implemented. For production, add:
- 100 requests per minute per API key
- 1000 requests per hour per facility
- Implement using middleware or external service

---

## Security Considerations

1. **API Keys**: Store securely, never commit to git
2. **HTTPS**: Always use HTTPS in production
3. **Encryption**: All tracking data is AES-256-GCM encrypted
4. **Validation**: All inputs are validated
5. **Logging**: All actions are logged for audit trail

---

## Integration Examples

### Python Edge Device
\`\`\`python
import requests
import json
from encryption import encryptData

API_KEY = "your_api_key"
BACKEND_URL = "http://localhost:3000"

def send_tracking_data(frame):
    encrypted = encryptData(frame)
    
    response = requests.post(
        f"{BACKEND_URL}/api/tracking/update",
        headers={"x-api-key": API_KEY},
        json={
            "device_id": "device-1",
            "facility_id": "facility-1",
            "timestamp": datetime.now().isoformat(),
            "encrypted_data": encrypted
        }
    )
    
    return response.json()
\`\`\`

### JavaScript Client
\`\`\`javascript
async function sendTrackingData(frame, apiKey) {
  const response = await fetch('/api/tracking/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    },
    body: JSON.stringify({
      device_id: 'device-1',
      facility_id: 'facility-1',
      timestamp: new Date().toISOString(),
      encrypted_data: frame
    })
  });
  
  return response.json();
}
\`\`\`

---

## Changelog

### v1.0.0 (2025-10-28)
- Initial release
- Tracking API
- Device management
- Simulator
- Audit logging
- Encryption support

---

**Last Updated**: 2025-10-28
**API Version**: 1.0.0
