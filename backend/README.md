# Quotivra Backend

## Node.js REST API For Quotation Management

The Quotivra backend is the Express.js API layer for administrator authentication, company settings, dashboard summaries, and quotation management. It connects the React frontend to MongoDB through Mongoose models and exposes REST-style endpoints under `/api`.

[Master README](../README.md) 
[Frontend README](../frontend/README.md)
[Screenshots](../screenshots/README.md) 


![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![REST API](https://img.shields.io/badge/REST_API-02569B?style=for-the-badge)
![MIT License](https://img.shields.io/github/license/jigarpandav/Quotivra)

---

## Table of Contents

- [Backend Overview](#backend-overview)
- [Responsibilities](#responsibilities)
- [Technology Stack](#technology-stack)
- [Architecture Diagram](#architecture-diagram)
- [Request Lifecycle](#request-lifecycle)
- [Folder Structure](#folder-structure)
- [Database Collections](#database-collections)
- [Logical Data Relationships](#logical-data-relationships)
- [Authentication Flow](#authentication-flow)
- [JWT-Protected Routes](#jwt-protected-routes)
- [Password Hashing](#password-hashing)
- [Company Settings APIs](#company-settings-apis)
- [Quotation APIs](#quotation-apis)
- [PDF Generation Support](#pdf-generation-support)
- [WhatsApp Sharing Support](#whatsapp-sharing-support)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running The Server](#running-the-server)
- [API Endpoint Tables](#api-endpoint-tables)
- [Example API Requests](#example-api-requests)
- [Error Handling](#error-handling)
- [Security Considerations](#security-considerations)
- [CORS Configuration](#cors-configuration)
- [API Testing](#api-testing)
- [Deployment Guidance](#deployment-guidance)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Backend Overview

Quotivra Backend provides the server-side business logic for the Smart Quotation Management System. It receives requests from the React frontend, validates request data, performs MongoDB operations with Mongoose, and returns JSON responses.

The backend supports a lightweight quotation model. Customers and products are entered directly inside quotation workflows instead of being managed as separate modules.

---

## Responsibilities

- Register and authenticate administrators
- Hash administrator passwords
- Generate JWTs during login
- Store and retrieve company settings
- Store quotations and quotation items
- Calculate quotation item totals on the server
- Retrieve dashboard summary data
- Serve uploaded company logo files
- Return consistent JSON responses and HTTP status codes

---

## Technology Stack

| Category | Technology |
| --- | --- |
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT |
| Password Security | bcrypt-compatible hashing |
| Configuration | dotenv |
| Cross-Origin Access | cors |
| API Style | REST API |

---

## Architecture Diagram

                    👤 User
                        │
                        ▼
            ⚛️ React + Vite Frontend
                        │
              HTTP / Axios Requests
                        │
                        ▼
               🚀 Express.js Backend
                        │
        ┌────────────────────────────────┐
        │        🛡️ Middleware           │
        │ CORS • JSON • JWT • Multer     │
        └──────────────┬─────────────────┘
                       │
                       ▼
                 🛣️ API Routes
                       │
                       ▼
              🎯 Controllers
             (Business Logic)
              ┌────────┴────────┐
              ▼                 ▼
      📦 Mongoose Models   📁 Uploads
              │
              ▼
        🍃 MongoDB Atlas

              🔑 JWT Service
                    │
                    ▼
          Protected React Frontend

---

## Request Lifecycle

              👤 User
                 │
                 ▼
        ⚛️ React + Vite
                 │
          Axios API Request
                 │
                 ▼
         🚀 Express Server
                 │
        ┌────────┴────────┐
        ▼                 ▼
 🛡️ Middleware      🛣️ API Routes
                         │
                         ▼
                  🎯 Controllers
                  ┌──────┼────────┐
                  ▼      ▼        ▼
          📦 Models   📁 Upload  🔑 JWT
                  │
                  ▼
             🍃 MongoDB
                  │
                  ▼
           📦 JSON Response
                  │
                  ▼
           ⚛️ React + Vite
                  │
                  ▼
               👤 User

---

## Folder Structure

```text
backend/
|
+-- config/
|   +-- db.js
|   +-- generateToken.js
|   +-- mail.js
|   +-- multer.js
+-- controller/
|   +-- authController.js
|   +-- companySettingController.js
|   +-- dashboardController.js
|   +-- quotationController.js
+-- models/
|   +-- Admin.js
|   +-- CompanySettings.js
|   +-- Quotation.js
|   +-- QuotationItems.js
+-- router/
|   +-- adminRouter.js
|   +-- companySettingRouter.js
|   +-- dashbaordRouter.js
|   +-- quotationRouter.js
+-- uploads/
+-- index.js
+-- package.json
```

| Folder | Purpose |
| --- | --- |
| `config/` | Database, upload, mail, and token helper configuration |
| `controller/` | API request handlers and business logic |
| `models/` | Mongoose schemas for MongoDB collections |
| `router/` | Express route declarations |
| `uploads/` | Uploaded company logo files |
| `index.js` | App setup, middleware, routes, database connection, and server startup |

---

## Database Collections

| Collection | Model | Purpose |
| --- | --- | --- |
| `admins` | `Admin` | Stores administrator authentication and password recovery information |
| `company_settings` | `CompanySettings` | Stores company profile, branding, contact, GST, terms, and signature information |
| `quotations` | `Quotation` | Stores quotation-level customer, date, amount, number, and status information |
| `quotation_items` | `QuotationItems` | Stores product rows belonging to quotations |

Actual MongoDB collection names can vary based on Mongoose pluralization. The names above describe the logical collections used by the application.

---

## Logical Data Relationships

                 ┌─────────────────────┐
                 │       ADMINS        │
                 ├─────────────────────┤
                 │ _id (PK)            │
                 │ name                │
                 │ email               │
                 │ password            │
                 └─────────┬───────────┘
                           │
         configures (1:1)  │
                           ▼
          ┌────────────────────────────────┐
          │      COMPANY_SETTINGS          │
          ├────────────────────────────────┤
          │ _id (PK)                       │
          │ admin_id (FK)                  │
          │ company_name                   │
          │ company_logo                   │
          │ address                        │
          │ city                           │
          │ state                          │
          │ contact                        │
          │ website                        │
          │ gst                            │
          └────────────────────────────────┘


                           │
                creates (1:N)
                           ▼
          ┌────────────────────────────────┐
          │         QUOTATIONS             │
          ├────────────────────────────────┤
          │ _id (PK)                       │
          │ admin_id (FK)                  │
          │ quotation_no                   │
          │ customer_name                  │
          │ customer_contact               │
          │ quotation_date                 │
          │ status                         │
          │ total_quantity                 │
          │ total_amount                   │
          └───────────────┬────────────────┘
                          │
               contains (1:N)
                          ▼
          ┌────────────────────────────────┐
          │      QUOTATION_ITEMS           │
          ├────────────────────────────────┤
          │ _id (PK)                       │
          │ quotation_id (FK)              │
          │ admin_id (FK)                  │
          │ product_name                   │
          │ price                          │
          │ quantity                       │
          │ total                          │
          └────────────────────────────────┘

MongoDB is not a SQL database. This diagram represents logical document references through ObjectIds such as `admin_id` and `quotation_id`.

---

## Authentication Flow

                    🚀 Start
                        │
                        ▼
               📝 Register Account
                        │
                        ▼
        ✅ Validate User Information
      (Name • Email • Password)
                        │
                        ▼
          🔒 Hash Password (bcrypt)
                        │
                        ▼
           💾 Store Admin in MongoDB
                        │
                        ▼
                  🔑 Login
                        │
                        ▼
        🛡️ Verify Email & Password
                        │
                        ▼
             ┌─────────────────┐
             │ Credentials OK? │
             └──────┬──────────┘
                 Yes│        │No
                    ▼        ▼
          🎫 Generate JWT   ❌ Invalid Credentials
                    │             │
                    ▼             │
     📦 Send Token & User Data    │
                    │             │
                    ▼             │
           ⚛️ React Frontend ◄────┘
                    │
                    ▼
        📊 Protected Dashboard
                    │
                    ▼
             ✅ Authenticated

---

## JWT-Protected Routes

The login controller generates a JWT for successful authentication. The frontend uses that token for protected UI access.

The current route files should be reviewed before describing backend routes as fully Bearer-token protected. If JWT middleware is added, protected API requests should use:

```http
Authorization: Bearer <token>
```

---

## Password Hashing

Administrator passwords are hashed before storage and compared during login. Plain-text passwords should never be stored in MongoDB or returned in API responses.

Password-related workflows include:

- Registration password hashing
- Login password comparison
- Reset password hashing
- Change password validation and hashing

---

## Company Settings APIs

Company settings allow quotations to include business branding and contact information.

Supported company settings data includes:

- Company logo
- Company name
- Address, city, and state
- Contact and alternative contact
- Website
- Terms and conditions
- Signature
- GST

---

## Quotation APIs

Quotation APIs handle quotation-level records and quotation item records.

Quotation-level data includes:

- Administrator reference
- Quotation number
- Customer name
- Customer contact
- Quotation date
- Total quantity
- Total amount
- Status: draft, approved, rejected

Quotation item data includes:

- Administrator reference
- Quotation reference
- Product name
- Price
- Quantity
- Total

Products are entered directly into each quotation. There is no separate product master module.

---

## PDF Generation Support

The backend stores quotation, quotation-item, company, and administrator data required for professional quotation PDFs. PDF rendering or download behavior should match the currently implemented frontend and backend code.

A quotation PDF should include company information, customer information, item table, quantity totals, grand total, terms, and signature when available.

---

## WhatsApp Sharing Support

The backend provides quotation and customer-contact data that the frontend can use for WhatsApp sharing. Do not describe the project as having WhatsApp Business API integration unless that integration is explicitly implemented.

---

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URL=<your-mongodb-connection-string>
JWT_SECRET=<your-secure-jwt-secret>
```

| Variable | Required | Purpose | Example |
| --- | --- | --- | --- |
| `PORT` | No | Backend server port | `5000` |
| `MONGO_URL` | Yes | MongoDB connection string | `mongodb://127.0.0.1:27017/quotivra` |
| `JWT_SECRET` | Yes | Secret used to sign JWT tokens | `replace-with-secure-secret` |

> Never commit `.env`, never expose `JWT_SECRET`, and never publish the MongoDB connection string.

---

## Installation

```bash
git clone https://github.com/jigarpandav/Quotivra/tree/main/backend
cd Quotivra/backend
npm install
```

---

## Running The Server

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

Confirm exact scripts from `backend/package.json`.

---

## API Endpoint Tables

### Authentication

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/api/admin/register` | Register an administrator | Public |
| POST | `/api/admin/login` | Authenticate an administrator | Public |
| POST | `/api/admin` | Retrieve administrator details | Application |
| POST | `/api/admin/forgot-password` | Request password reset | Public |
| POST | `/api/admin/reset-password/:token` | Reset password | Public |
| POST | `/api/admin/change-password` | Change password | Application |

### Company Settings

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/api/company-setting` | Create company settings | Application |
| POST | `/api/company-settings` | Retrieve company settings | Application |
| PUT | `/api/company-settings/update` | Update company settings | Application |

### Quotations

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/api/quotation` | Create a quotation | Application |
| POST | `/api/quotations` | Retrieve all quotations | Application |
| POST | `/api/quotation/id` | Retrieve one quotation | Application |
| PUT | `/api/quotation/update` | Update a quotation | Application |
| POST | `/api/quotation/delete` | Delete a quotation | Application |

### Dashboard

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/api/dashboard` | Retrieve dashboard data | Application |

Actual endpoint behavior and access control should match the route files and middleware implementation.

---

## Example API Requests

### Register

```bash
curl -X POST http://localhost:5000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JP",
    "email": "admin@example.com",
    "password": "secure-password"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "secure-password"
  }'
```

### Create Quotation

```bash
curl -X POST http://localhost:5000/api/quotation \
  -H "Content-Type: application/json" \
  -d '{
    "admin_id": "<admin-id>",
    "customer_name": "Sample Customer",
    "customer_contact": "9876543210",
    "quotation_date": "2026-07-21",
    "total_amount": 5000,
    "status": "draft",
    "products": [
      {
        "product_name": "Sample Product",
        "price": 2500,
        "quantity": 2
      }
    ]
  }'
```

---

## Error Handling

The backend returns JSON responses with status codes for validation and server errors.

| Status | Meaning |
| --- | --- |
| `200` | Successful request |
| `201` | Resource created |
| `400` | Missing or invalid input |
| `401` | Invalid password or unauthorized action |
| `404` | Resource not found |
| `409` | Duplicate or conflicting data |
| `500` | Internal server error |

---

## Security Considerations

- Hash administrator passwords before storing them.
- Keep `JWT_SECRET` private.
- Keep MongoDB credentials private.
- Validate all request data on the server.
- Avoid returning password hashes to the frontend.
- Restrict CORS origins before production deployment.
- Add JWT middleware to sensitive backend routes if not already present.
- Do not trust only frontend route protection for backend security.

---

## CORS Configuration

The backend enables CORS so the React frontend can call the API. For production, configure CORS to allow only trusted frontend origins instead of allowing every origin.

---

## API Testing

Recommended tools:

- Postman
- Thunder Client

Test these flows before a demo:

- Register
- Login
- Create company settings
- Create quotation
- Retrieve quotations
- Update draft quotation
- Delete quotation
- Dashboard summary

---

## Deployment Guidance

1. Set production environment variables.
2. Connect a production MongoDB database.
3. Install backend dependencies.
4. Start the server with the production command.
5. Configure CORS for the deployed frontend.
6. Verify uploaded-file behavior.
7. Test all authentication and quotation endpoints.
8. Use HTTPS in production.

---

## Troubleshooting

| Issue | Fix |
| --- | --- |
| Server does not start | Run `npm install` and check `.env` |
| MongoDB connection fails | Verify `MONGO_URL` and database network access |
| JWT errors | Confirm `JWT_SECRET` is set |
| API returns validation errors | Check required request fields |
| CORS errors | Allow the frontend origin in backend CORS configuration |
| Logo upload fails | Confirm file type, file size, and upload folder behavior |
| Quotation update fails | Confirm the quotation exists and is in draft status |

---

## Future Improvements

- JWT authorization middleware
- Swagger or OpenAPI documentation
- Automated tests
- Pagination improvements
- Advanced status filters
- Email sharing
- Cloud file storage
- Role-based access
- Activity logs
- Notifications
- Docker support
- CI/CD pipeline

---

## Contributing

1. Fork the repository.
2. Create a backend feature branch.
3. Make focused API changes.
4. Test affected endpoints.
5. Commit with a clear message.
6. Push the branch.
7. Open a pull request.

---

## License

![MIT License](https://img.shields.io/github/license/jigarpandav/Quotivra)

---

## Author

**Jigar Pandav**  
Frontend Developer / MERN Stack Developer

- GitHub: `https://github.com/jigarpandav`
- LinkedIn: `www.linkedin.com/in/jigar-pandav-a098bb298`
- Email: `jigarpandav342005@gmail.com`
