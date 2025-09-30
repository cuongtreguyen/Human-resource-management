package management.member.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.*;

@Service
public class EmailService {

    private final SesClient sesClient;

    @Autowired
    public EmailService(SesClient sesClient) {
        this.sesClient = sesClient;
    }

    public void sendEmployeeCredentials(String toEmail, String fullName, String username, String password, String employeeId) {
        try {
            String fromEmail = "noreply@yourcompany.com"; // TODO: Cấu hình email verified trong SES
            
            String subject = "Thông tin tài khoản nhân viên - " + employeeId;
            
            String emailBody = String.format(
                "Xin chào %s,\n\n" +
                "Tài khoản của bạn đã được tạo thành công:\n\n" +
                "Mã nhân viên: %s\n" +
                "Email đăng nhập: %s\n" +
                "Mật khẩu tạm thời: %s\n\n" +
                "Vui lòng đăng nhập và đổi mật khẩu ngay lần đầu.\n\n" +
                "Trân trọng,\n" +
                "Phòng Nhân sự",
                fullName, employeeId, username, password
            );

            Destination destination = Destination.builder()
                    .toAddresses(toEmail)
                    .build();

            Content subjectContent = Content.builder()
                    .data(subject)
                    .charset("UTF-8")
                    .build();

            Content bodyContent = Content.builder()
                    .data(emailBody)
                    .charset("UTF-8")
                    .build();

            Body body = Body.builder()
                    .text(bodyContent)
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
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email via AWS SES: " + e.getMessage(), e);
        }
    }

    /**
     * Gửi OTP cho quên mật khẩu
     */
    public void sendForgotPasswordOtp(String toEmail, String fullName, String otp) {
        try {
            String fromEmail = "noreply@yourcompany.com"; // TODO: Cấu hình email verified trong SES
            
            String subject = "Password Reset OTP - HRM System";
            
            String emailBody = String.format(
                "Xin chào %s,\n\n" +
                "Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã OTP sau để đặt lại mật khẩu:\n\n" +
                "Mã OTP: %s\n\n" +
                "Mã này sẽ hết hạn sau 5 phút.\n\n" +
                "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n" +
                "Trân trọng,\n" +
                "Hệ thống HRM",
                fullName, otp
            );

            Destination destination = Destination.builder()
                    .toAddresses(toEmail)
                    .build();

            Content subjectContent = Content.builder()
                    .data(subject)
                    .charset("UTF-8")
                    .build();

            Content bodyContent = Content.builder()
                    .data(emailBody)
                    .charset("UTF-8")
                    .build();

            Body body = Body.builder()
                    .text(bodyContent)
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
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP email via AWS SES: " + e.getMessage(), e);
        }
    }
}
