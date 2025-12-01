package management.member.demo.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendForgotPasswordOtp(String email, String fullName, String otp) {
        // Mock implementation - would integrate with email service
        System.out.println("Sending OTP to " + email + ": " + otp);
    }

    public void sendEmployeeCredentials(String email, String fullName, String username, String password, String employeeId) {
        // Mock implementation - would integrate with email service
        System.out.println("Sending credentials to " + email);
    }
}

