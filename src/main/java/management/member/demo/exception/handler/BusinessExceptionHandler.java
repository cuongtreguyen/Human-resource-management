package management.member.demo.exception.handler;

import management.member.demo.exception.BusinessException;
import management.member.demo.exception.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@RestControllerAdvice
public class BusinessExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex, WebRequest request) {
        HttpStatus status = mapStatus(ex.getErrorCode());
        ErrorResponse error = new ErrorResponse(
                status.value(),
                ex.getErrorCode() == null ? "Business Error" : ex.getErrorCode(),
                ex.getMessage(),
                LocalDateTime.now(),
                request.getDescription(false)
        );
        return new ResponseEntity<>(error, status);
    }

    private HttpStatus mapStatus(String code) {
        if (code == null) {
            return HttpStatus.BAD_REQUEST;
        }
        switch (code) {
            case "INVALID_CREDENTIALS":
                return HttpStatus.UNAUTHORIZED;
            case "ACCOUNT_LOCKED_OR_INACTIVE":
                return HttpStatus.FORBIDDEN;
            case "USERNAME_EXISTS":
            case "EMAIL_EXISTS":
            case "EMPLOYEE_EMAIL_EXISTS":
            case "EMPLOYEE_CODE_EXISTS":
                return HttpStatus.CONFLICT;
            case "TOKEN_EXPIRED":
            case "TOKEN_REVOKED":
            case "INVALID_TOKEN_TYPE":
                return HttpStatus.UNAUTHORIZED;
            default:
                return HttpStatus.BAD_REQUEST;
        }
    }
}
