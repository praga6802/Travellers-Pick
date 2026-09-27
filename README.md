# 🌍 Traveller’s Pick – Tour & Travel Management System

Traveller’s Pick is a full-stack tour and travel management application designed to help users discover, explore, and book tour packages across India. The system also provides an admin dashboard for managing packages, itineraries, users, and bookings.

## ✨ Features

### 👤 User Features

* User registration and secure login
* Browse available tour packages
* View package details, destinations, images, prices, and itineraries
* Book tour packages
* Generate a unique PNR for every booking
* View booking details
* Cancel bookings
* Receive automated email notifications

### 🛠️ Admin Features

* Secure admin authentication
* View user and booking information
* Add, update, and delete tour packages
* Upload package images
* Add and manage tour itineraries
* Manage booking information

## 📧 Email Notification System

Traveller’s Pick uses **Spring Boot `JavaMailSender`** for automated email communication.

### Signup Email

Sent after successful registration to confirm account creation and welcome the user.

### Booking Confirmation Email

Sent after a successful booking with:

* Package name
* Travel date
* Number of seats
* Booking amount
* Contact information
* PNR number

### Cancellation Email

Sent after a booking is cancelled with:

* Package name
* PNR number
* Cancellation confirmation

> *“We look forward to helping you book your next tour with Traveller’s Pick.”*

## 🔄 Application Flow

```text
User
 ↓
Signup / Login
 ↓
Browse Packages
 ↓
View Tour & Itinerary
 ↓
Book Tour
 ↓
PNR Generated
 ↓
Booking Confirmation Email
 ↓
View / Cancel Booking
```

```text
Admin
 ↓
Admin Login
 ↓
Manage Packages
 ↓
Manage Itineraries
 ↓
View Bookings
 ↓
Manage Booking Information
```

## 🛠️ Technology Stack

| Category        | Technologies          |
| --------------- | --------------------- |
| Backend         | Java, Spring Boot     |
| Security        | Spring Security       |
| API             | REST APIs             |
| Database        | MySQL                 |
| ORM             | JPA / Hibernate       |
| Email           | JavaMailSender        |
| Frontend        | HTML, CSS, JavaScript |
| API Testing     | Postman               |
| Build Tool      | Maven                 |
| Version Control | Git, GitHub           |
| Deployment      | Railway               |

## 🔐 Security

* Session-based authentication
* Protected user and admin endpoints
* Role-based access control
* Secure login and logout
* Authenticated API requests

## 🧪 API Testing

REST APIs were tested using **Postman**, including:

* User authentication
* Admin authentication
* Package management
* Itinerary management
* Booking operations
* Cancellation operations

## 🚀 Deployment

The Spring Boot backend and MySQL database are deployed using **Railway**.

**Backend:** `https://travellers-pick-production.up.railway.app`

## 🔮 Future Enhancements

* Online payment integration
* Ratings and reviews
* Improved mobile responsiveness
* React-based frontend

## 👨‍💻 Developer

**Pragadeeswaran Sekar**

Java Full Stack Developer | Java | Spring Boot | REST APIs | MySQL

**GitHub:** `https://github.com/praga6802/Travellers-Pick`
