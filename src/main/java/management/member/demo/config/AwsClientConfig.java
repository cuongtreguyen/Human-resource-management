package management.member.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.kms.KmsClient;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.sqs.SqsClient;

@Configuration
public class AwsClientConfig {

    @Value("${aws.region:ap-southeast-1}")
    private String awsRegion;

    @Value("${aws.access-key-id:}")
    private String accessKeyId;

    @Value("${aws.secret-access-key:}")
    private String secretAccessKey;

    @Value("${aws.profile:}")
    private String awsProfile;

    /**
     * Lấy Region từ config
     */
    private Region getRegion() {
        return Region.of(awsRegion);
    }

    /**
     * Tạo CredentialsProvider - hỗ trợ nhiều cách:
     * 1. Access Key và Secret Key từ application.properties
     * 2. AWS Profile từ application.properties
     * 3. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
     * 4. AWS credentials file (~/.aws/credentials)
     * 5. IAM role (khi chạy trên EC2/ECS/Lambda)
     */
    private AwsCredentialsProvider getCredentialsProvider() {
        // Nếu có access key và secret key trong config, dùng chúng
        if (accessKeyId != null && !accessKeyId.isEmpty() 
            && secretAccessKey != null && !secretAccessKey.isEmpty()) {
            AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKeyId, secretAccessKey);
            return StaticCredentialsProvider.create(credentials);
        }
        
        // Nếu có profile, có thể dùng ProfileCredentialsProvider
        // Nhưng DefaultCredentialsProvider đã tự động hỗ trợ profile từ environment variable AWS_PROFILE
        // Nên chỉ cần dùng DefaultCredentialsProvider
        
        // DefaultCredentialsProvider sẽ tự động tìm credentials theo thứ tự:
        // 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
        // 2. Java system properties
        // 3. Web identity token (cho EKS)
        // 4. Shared credentials file (~/.aws/credentials)
        // 5. Shared config file (~/.aws/config)
        // 6. Container credentials (ECS)
        // 7. Instance profile credentials (EC2)
        return DefaultCredentialsProvider.create();
    }

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .region(getRegion())
                .credentialsProvider(getCredentialsProvider())
                .build();
    }

    @Bean
    public SecretsManagerClient secretsManagerClient() {
        return SecretsManagerClient.builder()
                .region(getRegion())
                .credentialsProvider(getCredentialsProvider())
                .build();
    }

    @Bean
    public KmsClient kmsClient() {
        return KmsClient.builder()
                .region(getRegion())
                .credentialsProvider(getCredentialsProvider())
                .build();
    }

    @Bean
    public SqsClient sqsClient() {
        return SqsClient.builder()
                .region(getRegion())
                .credentialsProvider(getCredentialsProvider())
                .build();
    }
}
