# ✈️ Traveller’s Pick – Tour & Travel Management System

**Traveller’s Pick** is a dynamic full-stack tour and travel management web application designed to help users discover, explore, and book tour packages across India smoothly. The system provides an interactive experience for travelers along with a comprehensive Admin Dashboard to manage packages, itineraries, users, image uploads, and bookings efficiently.

---

## ✨ Features

### 👤 User Features

* **Authentication & Authorization:** Secure User Registration, Login, and Profile Management (Update Personal Details).
* **Explore Packages:** Browse dynamic tour packages with real-time details, destinations, cloud-hosted images, pricing, and day-wise itineraries.
* **Booking System:** Book tours with real-time seat availability and receive a unique **PNR Number** for every booking.
* **Booking Management:** View booking history, booking status, and cancel bookings anytime.
* **Automated Email Notifications:** Multi-event transactional emails (Welcome, Booking Confirmation, Updates, and Cancellation).

### 🛠️ Admin Features

* **Admin Authentication:** Secure role-based access for system administrators.
* **Package Management:** Add, update, and delete tour packages along with dynamic cloud image uploads.
* **Itinerary Management:** Create and manage detailed day-by-day itineraries for tour packages.
* **Booking & User Control:** Monitor and manage user profiles, booking records, and cancellation requests.

---

## 📧 Email Notification System

Traveller’s Pick integrates **Brevo (formerly Sendinblue) SMTP** with Spring Boot `JavaMailSender` to send triggered notification emails:

* **Welcome Email:** Triggered upon successful registration to confirm account setup.
* **Booking Confirmation Email:** Contains Package Name, Travel Date, Number of Seats, Total Amount, Contact Info, and PNR Number.
* **Booking Update Email:** Sent when booking details or schedule undergo modifications.
* **Cancellation Email:** Confirms booking cancellation along with the PNR number for reference.

---

## 🔄 Application Flow

```
[ User ] ──► Signup / Login ──► Browse / Search Packages ──► View Details & Itinerary
                                                                    │
   [ Confirmation Email ] ◄── [ PNR Generated ] ◄── Book Tour ◄─────┘
              │
              └──► View / Cancel Booking / Update Profile

[ Admin ] ──► Admin Login ──► Manage Packages & Itineraries (Cloudinary Uploads)
                                       │
                                       └──► View & Manage User Bookings

```

---

## 🛠️ Technology Stack & Infrastructure

| Category | Technologies / Cloud Services |
| --- | --- |
| **Frontend** | HTML5, CSS3, JavaScript (Deployed on **Vercel**) |
| **Backend** | Java, Spring Boot, Spring Security, REST APIs (Deployed on **Render**) |
| **Database** | MySQL Database (Cloud Hosted on **Aiven MySQL**) |
| **ORM / Persistence** | Spring Data JPA / Hibernate |
| **Media Storage** | **Cloudinary API** (Dynamic image upload & media management) |
| **Email Service** | **Brevo SMTP** (`JavaMailSender` Integration) |
| **API Testing** | Postman |
| **Build & Versioning** | Maven, Git, GitHub |

---

## 🔐 Security & Architecture

* **Role-Based Access Control (RBAC):** Distinct authorities for `USER` and `ADMIN` roles.
* **Session & Endpoint Protection:** Secured API routes preventing unauthorized access.
* **Decoupled Architecture:** Frontend hosted independently on Vercel communicating via RESTful endpoints to the Render-hosted backend.
* **Cloud Infrastructure:** Database hosted on cloud-native Aiven MySQL for reliable persistence and continuous connectivity.

---

## 🧪 API Testing

All REST endpoints have been thoroughly tested using **Postman**, including:

* User & Admin Authentication
* Profile Updates & Management
* Package CRUD Operations & Cloudinary Image Uploads
* Itinerary Builder Endpoints
* Booking Generation & Cancellation Workflows

---

## 🔮 Future Enhancements

* [ ] Online Payment Gateway Integration (Razorpay / Stripe)
* [ ] Interactive Customer Ratings & Reviews System
* [ ] Search Filters by Price Range, Location, and Duration

---

## 👨‍💻 Developer

**Pragadeeswaran Sekar**

*Java Full Stack Developer*

* **GitHub:** [@praga6802](https://github.com/praga6802)
* **Project Repository:** [Travellers-Pick](https://github.com/praga6802/Travellers-Pick)
* **Live Link:** (https://travellers-pick-frontend.vercel.app)
