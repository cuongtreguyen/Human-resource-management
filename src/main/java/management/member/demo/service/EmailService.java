package management.member.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.*;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private SesClient sesClient;

    @Value("${email.from:noreply@company.com}")
    private String fromEmail;

    @Value("${email.enabled:false}")
    private boolean emailEnabled;

    /**
     * Gửi OTP qua email cho forgot password
     */
    public void sendForgotPasswordOtp(String email, String fullName, String otp) {
        if (!emailEnabled || sesClient == null) {
            // Fallback: in ra console nếu không có cấu hình email
            logger.warn("Email service not configured. OTP for {}: {}", email, otp);
            System.out.println("=== OTP EMAIL (Mock) ===");
            System.out.println("To: " + email);
            System.out.println("Subject: Password Reset OTP");
            System.out.println("OTP Code: " + otp);
            System.out.println("========================");
            return;
        }

        try {
            String subject = "Password Reset OTP - HRM System";
            String htmlBody = buildForgotPasswordOtpEmail(fullName, otp);
            String textBody = buildForgotPasswordOtpEmailText(fullName, otp);

            sendEmail(email, subject, htmlBody, textBody);
            logger.info("OTP email sent successfully to: {}", email);
        } catch (Exception e) {
            logger.error("Failed to send OTP email to {}: {}", email, e.getMessage(), e);
            // Fallback: in ra console nếu gửi email thất bại
            System.out.println("=== OTP EMAIL (Failed to send) ===");
            System.out.println("To: " + email);
            System.out.println("OTP Code: " + otp);
            System.out.println("Error: " + e.getMessage());
            System.out.println("================================");
        }
    }

    /**
     * Gửi thông tin đăng nhập cho nhân viên mới
     */
    public void sendEmployeeCredentials(String email, String fullName, String username, String password, String employeeId) {
        if (!emailEnabled || sesClient == null) {
            // Fallback: in ra console nếu không có cấu hình email
            logger.warn("Email service not configured. Credentials for {}: username={}, password={}", email, username, password);
            System.out.println("=== EMPLOYEE CREDENTIALS EMAIL (Mock) ===");
            System.out.println("To: " + email);
            System.out.println("Username: " + username);
            System.out.println("Password: " + password);
            System.out.println("==========================================");
            return;
        }

        try {
            String subject = "Welcome to HRM System - Your Login Credentials";
            String htmlBody = buildEmployeeCredentialsEmail(fullName, username, password, employeeId);
            String textBody = buildEmployeeCredentialsEmailText(fullName, username, password, employeeId);

            sendEmail(email, subject, htmlBody, textBody);
            logger.info("Credentials email sent successfully to: {}", email);
        } catch (Exception e) {
            logger.error("Failed to send credentials email to {}: {}", email, e.getMessage(), e);
            // Fallback: in ra console nếu gửi email thất bại
            System.out.println("=== EMPLOYEE CREDENTIALS EMAIL (Failed to send) ===");
            System.out.println("To: " + email);
            System.out.println("Username: " + username);
            System.out.println("Password: " + password);
            System.out.println("Error: " + e.getMessage());
            System.out.println("===================================================");
        }
    }

    /**
     * Gửi email qua AWS SES
     */
    private void sendEmail(String toEmail, String subject, String htmlBody, String textBody) {
        if (sesClient == null) {
            throw new IllegalStateException("SES client is not configured");
        }

        Destination destination = Destination.builder()
                .toAddresses(toEmail)
                .build();

        Content subjectContent = Content.builder()
                .data(subject)
                .charset("UTF-8")
                .build();

        Content htmlContent = Content.builder()
                .data(htmlBody)
                .charset("UTF-8")
                .build();

        Content textContent = Content.builder()
                .data(textBody)
                .charset("UTF-8")
                .build();

        Body body = Body.builder()
                .html(htmlContent)
                .text(textContent)
                .build();

        Message message = Message.builder()
                .subject(subjectContent)
                .body(body)
                .build();

        SendEmailRequest emailRequest = SendEmailRequest.builder()
                .destination(destination)
                .message(message)
                .source(fromEmail)
                .build();

        sesClient.sendEmail(emailRequest);
    }

    /**
     * Tạo HTML email cho forgot password OTP
     */
    private String buildForgotPasswordOtpEmail(String fullName, String otp) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head><meta charset='UTF-8'></head>" +
                "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                "<div style='max-width: 600px; margin: 0 auto; padding: 20px;'>" +
                "<h2 style='color: #2c3e50;'>Password Reset Request</h2>" +
                "<p>Xin chào " + (fullName != null ? fullName : "User") + ",</p>" +
                "<p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã OTP sau để đặt lại mật khẩu:</p>" +
                "<div style='background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;'>" +
                "<h1 style='color: #27ae60; font-size: 32px; margin: 0; letter-spacing: 5px;'>" + otp + "</h1>" +
                "</div>" +
                "<p><strong>Lưu ý:</strong> Mã OTP này có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>" +
                "<p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>" +
                "<hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'>" +
                "<p style='color: #7f8c8d; font-size: 12px;'>Email này được gửi tự động từ hệ thống HRM. Vui lòng không trả lời email này.</p>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Tạo text email cho forgot password OTP
     */
    private String buildForgotPasswordOtpEmailText(String fullName, String otp) {
        return "Password Reset Request\n\n" +
                "Xin chào " + (fullName != null ? fullName : "User") + ",\n\n" +
                "Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã OTP sau để đặt lại mật khẩu:\n\n" +
                "Mã OTP: " + otp + "\n\n" +
                "Lưu ý: Mã OTP này có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.\n\n" +
                "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n" +
                "---\n" +
                "Email này được gửi tự động từ hệ thống HRM.";
    }

    /**
     * Tạo HTML email cho employee credentials
     */
    private String buildEmployeeCredentialsEmail(String fullName, String username, String password, String employeeId) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head><meta charset='UTF-8'></head>" +
                "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                "<div style='max-width: 600px; margin: 0 auto; padding: 20px;'>" +
                "<h2 style='color: #2c3e50;'>Welcome to HRM System</h2>" +
                "<p>Xin chào " + (fullName != null ? fullName : "User") + ",</p>" +
                "<p>Chào mừng bạn đến với hệ thống Quản lý Nhân sự (HRM). Dưới đây là thông tin đăng nhập của bạn:</p>" +
                "<div style='background-color: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 5px;'>" +
                "<p><strong>Employee ID:</strong> " + (employeeId != null ? employeeId : "N/A") + "</p>" +
                "<p><strong>Email/Username:</strong> " + username + "</p>" +
                "<p><strong>Password:</strong> " + password + "</p>" +
                "</div>" +
                "<p><strong>Lưu ý quan trọng:</strong></p>" +
                "<ul>" +
                "<li>Vui lòng đổi mật khẩu sau lần đăng nhập đầu tiên</li>" +
                "<li>Không chia sẻ thông tin đăng nhập với bất kỳ ai</li>" +
                "<li>Bảo mật tài khoản của bạn</li>" +
                "</ul>" +
                "<hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'>" +
                "<p style='color: #7f8c8d; font-size: 12px;'>Email này được gửi tự động từ hệ thống HRM. Vui lòng không trả lời email này.</p>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Tạo text email cho employee credentials
     */
    private String buildEmployeeCredentialsEmailText(String fullName, String username, String password, String employeeId) {
        return "Welcome to HRM System\n\n" +
                "Xin chào " + (fullName != null ? fullName : "User") + ",\n\n" +
                "Chào mừng bạn đến với hệ thống Quản lý Nhân sự (HRM). Dưới đây là thông tin đăng nhập của bạn:\n\n" +
                "Employee ID: " + (employeeId != null ? employeeId : "N/A") + "\n" +
                "Email/Username: " + username + "\n" +
                "Password: " + password + "\n\n" +
                "Lưu ý quan trọng:\n" +
                "- Vui lòng đổi mật khẩu sau lần đăng nhập đầu tiên\n" +
                "- Không chia sẻ thông tin đăng nhập với bất kỳ ai\n" +
                "- Bảo mật tài khoản của bạn\n\n" +
                "---\n" +
                "Email này được gửi tự động từ hệ thống HRM.";
    }
}

