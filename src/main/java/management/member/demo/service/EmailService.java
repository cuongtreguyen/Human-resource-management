package management.member.demo.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${email.from:noreply@company.com}")
    private String fromEmail;

    @Value("${email.enabled:false}")
    private boolean emailEnabled;

    @Value("${email.login.url:#}")
    private String loginUrl;

    /**
     * Gửi OTP qua email cho forgot password
     */
    public void sendForgotPasswordOtp(String email, String fullName, String otp) {
        if (!emailEnabled || mailSender == null) {
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
            String subject = "Yêu cầu đặt lại mật khẩu - HRM System";
            String htmlBody = loadAndReplaceTemplate("templates/email/forgot-password-otp.html", fullName, otp);
            String textBody = loadAndReplaceTemplate("templates/email/forgot-password-otp.txt", fullName, otp);

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
        if (!emailEnabled || mailSender == null) {
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
            String subject = "Thông tin đăng nhập - HRM System";
            String htmlBody = loadAndReplaceEmployeeCredentialsTemplate(fullName, username, password, employeeId);
            String textBody = loadAndReplaceEmployeeCredentialsTextTemplate(fullName, username, password, employeeId);

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
     * Gửi email qua JavaMail
     */
    private void sendEmail(String toEmail, String subject, String htmlBody, String textBody) throws MessagingException {
        if (mailSender == null) {
            throw new IllegalStateException("Mail sender is not configured");
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(textBody, htmlBody);

        mailSender.send(message);
        logger.debug("Email sent successfully to: {}", toEmail);
    }

    /**
     * Đọc template từ file và thay thế placeholder
     */
    private String loadAndReplaceTemplate(String templatePath, String fullName, String otp) {
        try {
            ClassPathResource resource = new ClassPathResource(templatePath);
            String template = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            
            // Thay thế placeholder
            template = template.replace("{{FULL_NAME}}", fullName != null ? fullName : "User");
            template = template.replace("{{OTP_CODE}}", otp != null ? otp : "");
            
            return template;
        } catch (IOException e) {
            logger.error("Failed to load email template: {}", templatePath, e);
            // Fallback to simple template
            return buildSimpleOtpEmail(fullName, otp);
        }
    }

    /**
     * Đọc template employee credentials và thay thế placeholder
     */
    private String loadAndReplaceEmployeeCredentialsTemplate(String fullName, String username, String password, String employeeId) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/email/employee-credentials.html");
            String template = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            
            // Thay thế placeholder
            template = template.replace("{{FULL_NAME}}", fullName != null ? fullName : "User");
            template = template.replace("{{USERNAME}}", username != null ? username : "");
            template = template.replace("{{PASSWORD}}", password != null ? password : "");
            template = template.replace("{{EMPLOYEE_ID}}", employeeId != null ? employeeId : "N/A");
            template = template.replace("{{LOGIN_URL}}", loginUrl);
            
            return template;
        } catch (IOException e) {
            logger.error("Failed to load employee credentials template", e);
            // Fallback to simple template
            return buildSimpleEmployeeCredentialsEmail(fullName, username, password, employeeId);
        }
    }

    /**
     * Đọc template text employee credentials và thay thế placeholder
     */
    private String loadAndReplaceEmployeeCredentialsTextTemplate(String fullName, String username, String password, String employeeId) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/email/employee-credentials.txt");
            String template = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            
            // Thay thế placeholder
            template = template.replace("{{FULL_NAME}}", fullName != null ? fullName : "User");
            template = template.replace("{{USERNAME}}", username != null ? username : "");
            template = template.replace("{{PASSWORD}}", password != null ? password : "");
            template = template.replace("{{EMPLOYEE_ID}}", employeeId != null ? employeeId : "N/A");
            template = template.replace("{{LOGIN_URL}}", loginUrl);
            
            return template;
        } catch (IOException e) {
            logger.error("Failed to load employee credentials text template", e);
            // Fallback to simple template
            return buildSimpleEmployeeCredentialsText(fullName, username, password, employeeId);
        }
    }

    /**
     * Fallback: Tạo email OTP đơn giản nếu không đọc được template
     */
    private String buildSimpleOtpEmail(String fullName, String otp) {
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body>" +
                "<h2>Yêu cầu đặt lại mật khẩu</h2>" +
                "<p>Xin chào " + (fullName != null ? fullName : "User") + ",</p>" +
                "<p>Mã OTP của bạn: <strong>" + otp + "</strong></p>" +
                "<p>Mã này có hiệu lực trong 5 phút.</p>" +
                "</body></html>";
    }

    /**
     * Fallback: Tạo email credentials đơn giản nếu không đọc được template
     */
    private String buildSimpleEmployeeCredentialsEmail(String fullName, String username, String password, String employeeId) {
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body>" +
                "<h2>Chào mừng đến với HRM System</h2>" +
                "<p>Xin chào " + (fullName != null ? fullName : "User") + ",</p>" +
                "<p>Thông tin đăng nhập:</p>" +
                "<ul>" +
                "<li>Employee ID: " + (employeeId != null ? employeeId : "N/A") + "</li>" +
                "<li>Username: " + username + "</li>" +
                "<li>Password: " + password + "</li>" +
                "</ul>" +
                "</body></html>";
    }

    /**
     * Fallback: Tạo text email credentials đơn giản nếu không đọc được template
     */
    private String buildSimpleEmployeeCredentialsText(String fullName, String username, String password, String employeeId) {
        return "Chào mừng đến với HRM System\n\n" +
                "Xin chào " + (fullName != null ? fullName : "User") + ",\n\n" +
                "Thông tin đăng nhập:\n" +
                "Employee ID: " + (employeeId != null ? employeeId : "N/A") + "\n" +
                "Username: " + username + "\n" +
                "Password: " + password + "\n";
    }
}
