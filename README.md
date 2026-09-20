# 🌍 Traveller’s Pick – Tour & Travel Management System

**Traveller’s Pick** is a full-stack Tour & Travel Management System designed to help users discover, book, and manage tour packages across India. It provides a user-friendly booking experience along with an admin dashboard for managing packages, itineraries, and bookings.

## ✨ Features

### 👤 User Features

* Browse and explore available tour packages
* View package details, destinations, images, prices, and itineraries
* User registration and login
* Book tour packages online
* Generate a unique **PNR number** for confirmed bookings
* Receive email notifications for signup, booking confirmation, and cancellation
* View booking-related information

### 🛠️ Admin Features

* Secure admin login
* Admin Dashboard
* View and manage booking requests
* Approve, reject, and cancel bookings
* Add, update, and delete tour packages
* Manage package itineraries and content
* View passenger and booking details

## 📧 Email Notification System

The application uses **Spring Boot JavaMailSender** to send automated emails.

* **Signup Email** – Welcome email after successful registration
* **Booking Confirmation** – Includes package name, travel dates, number of seats, amount, contact information, and PNR
* **Cancellation Email** – Confirms ticket cancellation with package name and PNR

## 🛠️ Tech Stack

**Backend**

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* REST APIs
* JavaMailSender
* Maven

**Frontend**

* HTML
* CSS
* JavaScript

**Database**

* MySQL

**Tools**

* Git & GitHub
* Postman
* IntelliJ IDEA / Eclipse

## 🔄 Booking Workflow

```text
User Registration
       ↓
Browse Tour Packages
       ↓
Select Package
       ↓
Create Booking
       ↓
Admin Reviews Booking
       ↓
Approve / Reject / Cancel
       ↓
PNR Generation
       ↓
Email Notification
```

## 🔐 Security

* Spring Security-based authentication
* Protected admin endpoints
* Role-based access control
* Secure password handling
* Session-based admin authentication

## 🗄️ Main Modules

```text
User Management
Admin Management
Tour Packages
Categories
Itineraries
Bookings
Passenger Management
Email Notifications
```

## 🔮 Future Enhancements

* Online payment integration
* User booking history
* Package search and filtering
* Reviews and ratings

## 👨‍💻 Author

**Pragadeeswaran Sekar**

* GitHub: https://github.com/praga6802
* LinkedIn: https://www.linkedin.com/in/praga06/
