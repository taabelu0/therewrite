package ch.fhnw.therewrite;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

public class DaoAuthProv extends DaoAuthenticationProvider {
    public DaoAuthProv(PasswordEncoder pe) {
        super(pe);
    }
    @Override
    protected void additionalAuthenticationChecks(UserDetails userDetails, UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
        this.logger.debug("Start of: additionalAuthenticationChecks");
        if (authentication.getCredentials() == null) {
            System.out.println("Failed to authenticate since no credentials provided");
            throw new BadCredentialsException(this.messages.getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
        } else {
            System.out.println("credentials: " + authentication.getCredentials().toString());
            System.out.println("credentials: " + userDetails.getUsername());
            String presentedPassword = authentication.getCredentials().toString();
            if (!this.getPasswordEncoder().matches(presentedPassword, userDetails.getPassword())) {
                System.out.println(getPasswordEncoder().matches(presentedPassword, getPasswordEncoder().encode(presentedPassword)));
                System.out.println(userDetails.getPassword());
                System.out.println("Failed to authenticate since password does not match stored value");
                throw new BadCredentialsException(this.messages.getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
            }
        }
    }

}
