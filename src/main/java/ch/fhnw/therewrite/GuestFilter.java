package ch.fhnw.therewrite;

import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.Guest;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.NegatedRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
public class GuestFilter extends OncePerRequestFilter {
    private final GuestRepository guestRepository;
    private final DocumentRepository documentRepository;

    public GuestFilter(GuestRepository guestRepository, DocumentRepository documentRepository) {
        this.guestRepository = guestRepository;
        this.documentRepository = documentRepository;
    }
    public boolean verifyGuest(String guestId, String documentId) {
        UUID dId;
        UUID gId;
        try {
            dId = UUID.fromString(documentId);
            gId = UUID.fromString(guestId);
        }
        catch(IllegalArgumentException exception) {
            // TODO: log exception
            return false;
        }
        Guest guest = guestRepository.getReferenceById(gId);
        Document document = documentRepository.getReferenceById(dId);
        return document.getGuests().contains(guest);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            String uri = request.getRequestURI();
            String docId = uri.substring(uri.lastIndexOf('/') + 1); // assumes we are accessing a pdf resource which uses the pdf-id in its URI!!
            Object guestId = request.getSession().getAttribute("guestId");
            if(guestId != null && verifyGuest(guestId.toString(), docId)) {
                response.setStatus(HttpServletResponse.SC_ACCEPTED);
                return;
            }
        }
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        RequestMatcher matcher = new NegatedRequestMatcher(new AntPathRequestMatcher("**/view/**"));
        return matcher.matches(request);
    }
}
