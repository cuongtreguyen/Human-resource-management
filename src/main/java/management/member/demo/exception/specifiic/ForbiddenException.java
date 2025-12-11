package management.member.demo.exception.specifiic;

import management.member.demo.exception.base.BusinessException;

/**
 * Custom exception cho Forbidden errors (403)
 * Kế thừa BusinessException để tương thích với GlobalExceptionHandler
 */
public class ForbiddenException extends BusinessException {
    
    public ForbiddenException(String message) {
        super("ACCESS_DENIED", message);
    }
    
    public ForbiddenException(String message, Throwable cause) {
        super("ACCESS_DENIED", message, cause);
    }
}

