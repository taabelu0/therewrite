package ch.fhnw.therewrite;

import ch.fhnw.therewrite.controller.DocumentAccessTokenController;
import ch.fhnw.therewrite.controller.GuestController;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.DocumentAccessToken;
import ch.fhnw.therewrite.data.Guest;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.NegatedRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
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

    public boolean verifyToken(String documentAccessToken, String documentId, HttpSession session) {
        UUID dId;
        try {
            dId = UUID.fromString(documentId);
        }
        catch(IllegalArgumentException exception) {
            return false;
        }
        Document document = documentRepository.getReferenceById(dId);
        List<DocumentAccessToken> dats = document.getAccessTokens();
        boolean valid = dats.stream()
                .map(dat -> dat.getToken().toString())
                .anyMatch(t -> t.equals(documentAccessToken));
        if(valid) {
            // create new guest if the token is valid
            GuestController gC = new GuestController(guestRepository, documentRepository);
            Guest guest = gC.createGuest(document);
            session.setAttribute("guestId", guest.getId());
        }
        return valid;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // default is unauthorized
        String uri = request.getRequestURI();
        String docId = uri.substring(uri.lastIndexOf('/') + 1); // assumes we are accessing a pdf resource which uses the pdf-id in its URI!!
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            Object guestId = request.getSession().getAttribute("guestId");
            if(guestId != null && verifyGuest(guestId.toString(), docId)) {
                response.setStatus(HttpServletResponse.SC_ACCEPTED);
                return; // no need to go through potential token authorization if guest is already registered
            }
        }
        if(request.getParameter("documentAccessToken") != null) {
            System.out.println(request.getParameter("documentAccessToken").toString() + ", " + docId +  ", " + request.getSession());
            if(verifyToken(request.getParameter("documentAccessToken").toString(), docId, request.getSession())) {
                response.setStatus(HttpServletResponse.SC_ACCEPTED);
            }
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        RequestMatcher matcher = new AntPathRequestMatcher("/view/**");
        return !matcher.matches(request);
    }
}
