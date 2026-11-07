\# API Contract (v1)



Base URL: http://localhost:8081/api

Auth: protected endpoints need header `Authorization: Bearer <accessToken>`



\## POST /auth/register

Request:  { "name": "Asha", "phone": "9876543210", "password": "Secret@123" }

Response: 201 { "message": "Registered successfully" }

Error:    400 { "message": "Phone already registered" }



\## POST /auth/login

Request:  { "phone": "9876543210", "password": "Secret@123" }

Response: 200 { "accessToken": "...", "refreshToken": "..." }

Error:    401 { "message": "Invalid credentials" }



\## GET /contacts

Response: 200 \[ { "id": 1, "name": "Mom", "phone": "9123456780",

&#x20;                 "email": "", "relationship": "Mother", "status": "PENDING" } ]



\## POST /contacts

Request:  { "name": "Mom", "phone": "9123456780", "email": "", "relationship": "Mother" }

Response: 201 { "id": 1, "name": "Mom", ... "status": "PENDING" }

Error:    400 { "message": "Maximum 5 contacts allowed" }



\## DELETE /contacts/{id}

Response: 204 No Content

