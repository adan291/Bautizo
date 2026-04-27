# Security Specification - Menú Bautizo

## Data Invariants
1. A menu selection must have a valid `userId` matching the authenticated user.
2. A user can only create one response in the `/responses` collection.
3. Only authorized administrators can list all responses.
4. Observations and selections are PII and must only be visible to the owner or an admin.

## The Dirty Dozen Payloads

### 1. Identity Spoofing (Rejected)
**Goal:** Create a response for another user.
**Payload:**
```json
{
  "userId": "attacker_id",
  "userName": "Victim",
  "selectedMenu": "adult_standard"
}
```
*Target Path:* `/responses/victim_id`

### 2. Unauthorized Listing (Rejected)
**Goal:** Fetch all responses as a standard guest.
**Operation:** `list /responses`

### 3. Resource Poisoning (Rejected)
**Goal:** Inject huge string as ID.
**Path:** `/responses/very_long_and_malicious_id_string_over_128_chars...`

### 4. Shadow Update (Rejected)
**Goal:** Add a field to mark self as admin.
**Payload:**
```json
{
  "selectedMenu": "adult_standard",
  "isAdmin": true
}
```

### 5. Invalid Option (Rejected)
**Goal:** Select a non-existent menu.
**Payload:**
```json
{
  "selectedMenu": "caviar_and_champagne"
}
```

### 6. PII Leak (Rejected)
**Goal:** Read someone else's observations.
**Operation:** `get /responses/other_user_id`

### 7. Self-Admin Assignment (Rejected)
**Goal:** Create a doc in `/admins`.
**Payload:**
```json
{ "email": "hacker@gmail.com" }
```

### 8. Negative Choice (Rejected - Logic)
**Goal:** Manipulate numbers if they existed.

### 9. Bypass Validation (Rejected)
**Goal:** Create with missing required fields.
**Payload:**
{ "userId": "user123" }

### 10. Timestamp Spoofing (Rejected)
**Goal:** Set a future date.
**Payload:**
{ "submittedAt": "2029-01-01T00:00:00Z" }

### 11. Large Observation (Rejected)
**Goal:** 2MB string.

### 12. Multiple Submissions (Rejected)
**Goal:** Create a second response. (Prevented by using UID as doc ID and checking if exists, but rules should block if policy was different. Here, UID as ID naturally prevents multiple *different* docs, but we must decide if update is allowed).

## Test Runner (Conceptual)
All the above must return `PERMISSION_DENIED`.
