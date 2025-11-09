package management.member.demo.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // TODO: Implement actual user loading logic from database
        if ("admin".equals(username)) {
            return User.builder()
                    .username("admin")
                    .password("$2a$10$abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijab") // mock hashed password
                    .authorities("ROLE_ADMIN")
                    .build();
        }
        throw new UsernameNotFoundException("User not found: " + username);
    }
}
