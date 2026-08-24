<div align="center">

# 🏥 MediCare Pro
### Advanced Healthcare Management System

[![Java](https://img.shields.io/badge/Java-17%2B-orange?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.3-brightgreen?style=flat-square&logo=spring)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat-square&logo=bootstrap)](https://getbootstrap.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-black?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)
[![H2](https://img.shields.io/badge/H2-In--Memory-blue?style=flat-square)](https://h2database.com/)
[![MySQL](https://img.shields.io/badge/MySQL-Ready-4479A1?style=flat-square&logo=mysql)](https://www.mysql.com/)

**A full-stack healthcare management web application built with Spring Boot and React.**

</div>

---

## 📋 Overview

**MediCare Pro** is a comprehensive, production-ready **Healthcare Management System** designed for clinics and hospitals.
It provides a role-based portal for **Administrators**, **Doctors**, and **Patients** with full appointment scheduling,
electronic health records, prescription management, and digital billing.

> Built as a full-stack portfolio project demonstrating Java Spring Boot REST APIs, JWT authentication, Spring Security, JPA/Hibernate, and a modern React frontend.

---

## ✨ Features

### 🛡️ Admin Portal
- **Dashboard** — Live KPIs (patients, doctors, revenue, appointment stats) with charts
- **Manage Doctors** — Add, edit, activate/deactivate doctor profiles
- **Manage Patients** — View patient demographics and history
- **Manage Departments** — Create and manage hospital departments
- **Appointments** — View all appointments, approve/reject, change status
- **Bills** — Generate itemized invoices for completed consultations
- **Payments** — View all payment transactions and revenue ledger

### 👨‍⚕️ Doctor Portal
- **Dashboard** — Appointment stats and quick action cards
- **My Appointments** — Accept/Reject pending slots, run consultation modal
- **Consultation Form** — Record symptoms, diagnosis, treatment, prescribe medicines
- **Patient Cohort** — View all patients with complete medical history
- **Profile Settings** — Update availability, fee, and contact info

### 🧑‍⚕️ Patient Portal
- **Dashboard** — Upcoming appointments and visit summary
- **Find Doctor** — Search by specialty/department and book time slots
- **My Appointments** — Track booking status, cancel pending slots
- **Medical Records** — Full consultation history from all doctors
- **Prescriptions** — View all prescribed medicines and dosages
- **Bills & Payments** — View invoices, pay online (simulated gateway)
- **Profile Settings** — Update demographics, blood group, allergies

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend Language** | Java 17+ |
| **Framework** | Spring Boot 3.3.3 |
| **Security** | Spring Security + JWT |
| **Data Access** | Spring Data JPA + Hibernate |
| **Database (Dev)** | H2 In-Memory (MySQL-mode) |
| **Database (Prod)** | MySQL 8+ |
| **Build Tool** | Maven |
| **API Docs** | Swagger / SpringDoc OpenAPI |
| **Frontend** | React 18 + Vite 5 |
| **UI Framework** | Bootstrap 5 + Bootstrap Icons |
| **HTTP Client** | Axios |
| **Routing** | React Router v6 |
| **Charts** | Chart.js + react-chartjs-2 |

---

## 🚀 Getting Started

### Prerequisites

- Java 17+ — https://adoptium.net/
- Maven 3.8+ — https://maven.apache.org/
- Node.js v18+ — https://nodejs.org/
- Git — https://git-scm.com/
- *(Optional)* MySQL 8 for persistent storage

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/medicare-pro.git
cd medicare-pro
```

### 2. Backend Setup

```bash
cd backend

# Windows
copy src\main\resources\application.properties.example src\main\resources\application.properties

# Mac/Linux
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Start the API server
mvn spring-boot:run
```

Backend runs at: **http://localhost:8081**

H2 Console: http://localhost:8081/h2-console
- JDBC URL: `jdbc:h2:mem:healthcaredb`
- Username: `sa` | Password: *(leave empty)*

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173** (or 5174)

### 4. Switch to MySQL (Production)

In `application.properties`, comment the H2 block and uncomment:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/healthcare_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.h2.console.enabled=false
```

---

## 🔑 Demo Credentials

| Role | Username | Password |
|---|---|---|
| **Admin** | `admin` | `admin123` |
| **Doctor** | `drsmith` | `doctor123` |
| **Doctor** | `drjones` | `doctor123` |
| **Patient** | `patient` | `patient123` |

> Seeded automatically by `DataSeeder.java` on first startup (when DB is empty).

---

## 📡 API Documentation

Swagger UI: http://localhost:8081/swagger-ui.html

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/login | Public | Login, receive JWT |
| POST | /api/patients/register | Public | Patient registration |
| POST | /api/doctors/register | Public | Doctor registration |
| GET | /api/doctors | Public | List doctors |
| GET | /api/departments | Public | List departments |
| GET | /api/appointments | Auth | List appointments |
| POST | /api/appointments | Patient | Book appointment |
| PUT | /api/appointments/{id}/status | Auth | Update status |
| GET | /api/medical-records/patient/{id} | Auth | Patient records |
| POST | /api/medical-records | Doctor | Create record |
| POST | /api/prescriptions | Doctor | Create prescription |
| POST | /api/bills | Admin | Generate bill |
| POST | /api/payments | Patient | Process payment |
| GET | /api/dashboards/admin | Admin | Admin stats |
| GET | /api/dashboards/patient/{id} | Patient | Patient stats |

---

## 📁 Project Structure

```
medicare-pro/
├── .gitignore
├── README.md
├── backend/                              # Spring Boot REST API
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/healthcare/
│       │   ├── config/                   # DataSeeder
│       │   ├── controller/               # REST Controllers
│       │   ├── dto/                      # Request/Response DTOs
│       │   ├── entity/                   # JPA Entities + Enums
│       │   ├── exception/                # Global Exception Handler
│       │   ├── repository/               # Spring Data JPA Repos
│       │   ├── security/                 # JWT + SecurityConfig
│       │   └── service/                  # Business Logic
│       └── resources/
│           ├── application.properties
│           └── application.properties.example
│
└── frontend/                             # React + Vite SPA
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── components/                   # Navbar, Sidebar, Toast
        ├── context/                      # AuthContext
        ├── pages/
        │   ├── admin/                    # 7 admin pages
        │   ├── doctor/                   # 4 doctor pages
        │   ├── patient/                  # 7 patient pages
        │   └── public/                   # 8 public pages
        └── services/api.js               # Axios + JWT interceptor
```

---

## 🔐 Security Notes

- Passwords hashed with **BCrypt**
- JWT tokens expire after 24 hours
- Role-based access on every endpoint via `@PreAuthorize`
- CORS restricted to localhost in development

**Before production deployment:**
1. Replace `jwt.secret` with a 64-char cryptographically secure secret
2. Set `spring.h2.console.enabled=false`
3. Switch to MySQL with a restricted DB user
4. Add HTTPS via reverse proxy (Nginx/Apache)
5. Update CORS `allowedOrigins` to your production domain

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
Made with ❤️ &mdash; MediCare Pro | Full Stack Java Healthcare Platform
</div>
