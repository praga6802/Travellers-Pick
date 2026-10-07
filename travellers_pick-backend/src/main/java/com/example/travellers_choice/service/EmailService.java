package com.example.travellers_choice.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final Resend resend;

    public EmailService(Resend resend) {
        this.resend = resend;
    }

    @Value("${resend.from-email}")
    private String fromEmail;


    public void sendWelcomeEmail(String toEmail, String name) {

        String subject = "Welcome to Traveller's Pick!";

        String html = """
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            
            <h4>Hello Pick, %s!</h2>

            <p>We're excited to have you with us.</p>

            <p>
                Your account has been successfully created, and you're now ready
                to discover exciting destinations and plan your next adventure.
            </p>

            <p>
                With Traveller's Pick, you can:
            </p>

            <ul>
                <li>Explore available tour packages</li>
                <li>View detailed tour itineraries</li>
                <li>Book your favourite trips</li>
                <li>Manage your bookings easily</li>
            </ul>

            <p>
                Start exploring today and find your next memorable journey.
            </p>

            <p>
                <strong>Happy travelling!</strong>
            </p>

            <p>
                Best regards,<br>
                <strong>Traveller's Pick Team</strong>
            </p>

        </body>
        </html>
        """.formatted(name);


        sendEmail(toEmail, subject, html);
    }


    public void sendBookingConfirmationEmail(
            String toEmail,
            String name,
            String pnr,
            String tourName) {

        String subject = "Tour Booking Confirmed - Traveller's Pick";

        String html = """
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

            <p>Hello %s,</p>

            <p>
                Great news! Your tour booking with <strong>Traveller's Pick</strong>
                has been successfully confirmed.
            </p>

            <h3>Booking Details</h3>

            <p>
                <strong>Tour:</strong> %s
            </p>

            <p>
                <strong>Booking Reference (PNR):</strong> %s
            </p>

            <p>
                Please keep your PNR safe for future reference. You can use it
                to identify your booking when contacting Traveller's Pick.
            </p>

            <p>
                We hope you have a wonderful journey and a memorable travel
                experience with us.
            </p>

            <p>
                <strong>Thank you for choosing Traveller's Pick!</strong>
            </p>

            <p>
                Best regards,<br>
                <strong>Traveller's Pick Team</strong>
            </p>

        </body>
        </html>
        """.formatted(name, tourName, pnr);


        sendEmail(toEmail, subject, html);
    }


    public void sendCancellationEmail(
            String toEmail,
            String name,
            String pnr,
            String tourName) {

        String subject = "Booking Cancelled - " + pnr;

        String html = """
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">


            <p>Hello %s,</p>

            <p>
                Your tour booking with <strong>Traveller's Pick</strong>
                has been successfully cancelled.
            </p>

            <h3>Cancellation Details</h3>

            <p>
                <strong>Tour:</strong> %s
            </p>

            <p>
                <strong>Booking Reference (PNR):</strong> %s
            </p>

            <p>
                This booking is no longer active. Please keep this email
                for your records and future reference.
            </p>

            <p>
                If you have any questions regarding your cancellation,
                please contact the Traveller's Pick support team.
            </p>

            <p>
                We hope to have the opportunity to serve you again
                on your future travels.
            </p>

            <p>
                Best regards,<br>
                <strong>Traveller's Pick Team</strong>
            </p>

        </body>
        </html>
        """.formatted(name, tourName, pnr);


        sendEmail(toEmail, subject, html);
    }


    private void sendEmail(
            String toEmail,
            String subject,
            String html) {

        try {

            CreateEmailOptions params =
                    CreateEmailOptions.builder()
                            .from(fromEmail)
                            .to(toEmail)
                            .subject(subject)
                            .html(html)
                            .build();

            resend.emails().send(params);

        } catch (ResendException e) {

            System.err.println(
                    "Failed to send email to " + toEmail
            );

            e.printStackTrace();
        }
    }
}