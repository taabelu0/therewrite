package ch.fhnw.therewrite;

import ch.fhnw.therewrite.controller.GuestController;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.DocumentAccessToken;
import ch.fhnw.therewrite.data.Guest;
import ch.fhnw.therewrite.repository.DocumentAccessTokenRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.data.domain.Example;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static ch.fhnw.therewrite.SecurityConfiguration.permitAllMatchers;

@Component
public class GuestFilter extends OncePerRequestFilter {
    private final GuestRepository guestRepository;
    private final DocumentRepository documentRepository;
    private final DocumentAccessTokenRepository documentAccessTokenRepository;


    public GuestFilter(GuestRepository guestRepository, DocumentRepository documentRepository, DocumentAccessTokenRepository documentAccessTokenRepository) {
        this.guestRepository = guestRepository;
        this.documentRepository = documentRepository;
        this.documentAccessTokenRepository = documentAccessTokenRepository;
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
        HttpSession session = request.getSession(false);
        String token = request.getParameter("documentAccessToken");
        if(token != null) {
            Document document = verifyToken(token);
            if(document != null) {
                GuestController gC = new GuestController(guestRepository, documentRepository);
                Guest guest = gC.createGuest(document);
                session.setAttribute("guestId", guest.getId());
                List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_GUEST"));
                Authentication newAuth = new UsernamePasswordAuthenticationToken("guest", null, authorities);
                SecurityContextHolder.getContext().setAuthentication(newAuth);
            }
        }
        filterChain.doFilter(request, response);
    }
}
