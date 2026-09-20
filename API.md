# PainLens API Documentation

## Endpoints

### 1. POST `/api/login`

Authenticates access for the demo patient.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:

```json
{
  "patient_id": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "token": "string",
  "patient_id": "string"
}
```

**Error Response:**
- Status: `401`

```json
{
  "error": "Invalid ID or password"
}
```

---

### 2. GET `/api/patient`

Fetches the current patient data, visit history, observer score adjustments, and active alert status.

Requires the header `Authorization: Bearer <token>`. Returns `401` without it.

**Request:**
- Method: `GET`
- Parameters: None

**Response:**

```json
{
  "patient": {
    "id": "string",
    "name": "string",
    "age": "number",
    "care_type": "string"
  },
  "visits": [
    {
      "id": "string",
      "date": "string",
      "observer": "string",
      "note": "string",
      "raw": "number",
      "corrected": "number"
    }
  ],
  "adjustments": {
    "A": "number",
    "B": "number",
    "C": "number"
  },
  "alert": {
    "active": "boolean",
    "message": "string"
  }
}
```

---

### 3. POST `/api/score-note`

Evaluates and scores an observer note.

Requires the header `Authorization: Bearer <token>`. Returns `401` without it.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:

```json
{
  "observer": "string",
  "note": "string"
}
```

**Response:**

```json
{
  "score": "number",
  "reason": "string",
  "fallback": "boolean"
}
```

---

### 4. POST `/api/visits`

Submits a new visit entry with an observer score and returns the updated patient object.

Requires the header `Authorization: Bearer <token>`. Returns `401` without it.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:

```json
{
  "observer": "string",
  "note": "string",
  "score": "number"
}
```

**Response:**

Returns the updated patient response object identical in structure to `GET /api/patient`.

---

### 5. POST `/api/patients`

Creates a new synthetic demo patient. Accessible before sign-in (no authorization header required).

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:

```json
{
  "patient_id": "string",
  "name": "string",
  "age": "number",
  "care_type": "string",
  "password": "string"
}
```

**Response:**

Returns the created patient response object with an empty visit history.
