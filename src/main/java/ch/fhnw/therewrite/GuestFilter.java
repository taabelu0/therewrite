package ch.fhnw.therewrite;
import ch.fhnw.therewrite.controller.GuestController;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.DocumentAccessToken;
import ch.fhnw.therewrite.data.Guest;
import ch.fhnw.therewrite.data.User;
import ch.fhnw.therewrite.repository.DocumentAccessTokenRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Component
public class GuestFilter extends OncePerRequestFilter {
    private final GuestRepository guestRepository;
    private final DocumentRepository documentRepository;
    private final DocumentAccessTokenRepository documentAccessTokenRepository;
    private final CustomUserDetailsService customUserDetailsService;
    public GuestFilter(GuestRepository guestRepository, DocumentRepository documentRepository, DocumentAccessTokenRepository documentAccessTokenRepository, CustomUserDetailsService customUserDetailsService) {
        this.guestRepository = guestRepository;
        this.documentRepository = documentRepository;
        this.documentAccessTokenRepository = documentAccessTokenRepository;
        this.customUserDetailsService = customUserDetailsService;
    }
    public Document verifyToken(String documentAccessToken) {
        UUID token;
        try {
            token = UUID.fromString(documentAccessToken);
        }
        catch(IllegalArgumentException exception) {
            // TODO: log exception
            return null;
        }
        Optional<DocumentAccessToken> dat = documentAccessTokenRepository.findByToken(token);
        if(dat.isPresent()) return dat.get().getDocumentId();
        return null;
    }
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = request.getParameter("documentAccessToken");
        String username = request.getParameter("username");
        UserDetails user = null;
        if(username != null) user = customUserDetailsService.loadUserByUsername(username);
        if(token != null &&  user == null) {
            Document document = verifyToken(token);
            if(document != null) {
                GuestController gC = new GuestController(guestRepository, documentRepository);
                Guest guest = gC.createGuest(document);
                HttpSession session = request.getSession(true);
                session.setAttribute("guestId", guest.getId());
                List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_GUEST"));
                Authentication newAuth = new UsernamePasswordAuthenticationToken("guest", null, authorities);
                SecurityContextHolder.getContext().setAuthentication(newAuth);
            }
        }
        filterChain.doFilter(request, response);
    }
}