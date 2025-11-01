package management.member.demo.Mapper;

import management.member.demo.exception.model.ErrorCode;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * HttpStatusMapper - Map ErrorCode → HttpStatus
 * Component để tái sử dụng cho tất cả các Handler
 */
@Component
public class HttpStatusMapper {

    /**
     * Map ErrorCode string sang HttpStatus
     * Đây là nơi duy nhất quyết định HttpStatus dựa trên ErrorCode
     */
    public HttpStatus toHttpStatus(String errorCode) {
        if (errorCode == null) {
            return HttpStatus.BAD_REQUEST;
        }

        // Employee errors
        if (ErrorCode.EMPLOYEE_NOT_FOUND.getCode().equals(errorCode)) {
            return HttpStatus.NOT_FOUND;
        }

        // Employee conflicts
        if (ErrorCode.EMPLOYEE_EMAIL_EXISTS.getCode().equals(errorCode) ||
            ErrorCode.EMPLOYEE_CODE_EXISTS.getCode().equals(errorCode)) {
            return HttpStatus.CONFLICT;
        }

        // Common errors
        if (ErrorCode.INTERNAL_SERVER_ERROR.getCode().equals(errorCode)) {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }

        if (ErrorCode.METHOD_NOT_ALLOWED.getCode().equals(errorCode)) {
            return HttpStatus.METHOD_NOT_ALLOWED;
        }

        // Security/Authentication errors
        if (ErrorCode.AUTHENTICATION_FAILED.getCode().equals(errorCode) ||
            ErrorCode.INVALID_CREDENTIALS.getCode().equals(errorCode) ||
            "TOKEN_EXPIRED".equals(errorCode) ||
            "TOKEN_REVOKED".equals(errorCode) ||
            "INVALID_TOKEN_TYPE".equals(errorCode)) {
            return HttpStatus.UNAUTHORIZED;
        }

        if (ErrorCode.ACCESS_DENIED.getCode().equals(errorCode) ||
            "ACCOUNT_LOCKED_OR_INACTIVE".equals(errorCode)) {
            return HttpStatus.FORBIDDEN;
        }

        if ("USERNAME_EXISTS".equals(errorCode) ||
            "EMAIL_EXISTS".equals(errorCode)) {
            return HttpStatus.CONFLICT;
        }

        // Default: BAD_REQUEST cho tất cả validation errors và các lỗi khác
        return HttpStatus.BAD_REQUEST;
    }
}

