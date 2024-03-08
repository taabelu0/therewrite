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
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Component
public class GuestFilter extends OncePerRequestFilter {
    private final GuestRepository guestRepository;
    private final DocumentRepository documentRepository;
    private final DocumentAccessTokenRepository documentAccessTokenRepository;
    private final List<String> permitAllMatchers;

    public GuestFilter(List<String> permitAllMatchers, GuestRepository guestRepository, DocumentRepository documentRepository, DocumentAccessTokenRepository documentAccessTokenRepository) {
        this.permitAllMatchers = permitAllMatchers;
        this.guestRepository = guestRepository;
        this.documentRepository = documentRepository;
        this.documentAccessTokenRepository = documentAccessTokenRepository;
    }
    public boolean verifyGuest(String guestId) {
        UUID gId;
        try {
            gId = UUID.fromString(guestId);
        }
        catch(IllegalArgumentException exception) {
            // TODO: log exception
            return false;
        }
        return guestRepository.existsById(gId);
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
        Document document = documentRepository.getReferenceById(dId);
        List<Guest> guests = guestRepository.findByDocumentId(document);
        return guests.stream().anyMatch(guest -> guest.getId().equals(gId));
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
        List<DocumentAccessToken> dats = documentAccessTokenRepository.findByDocumentId(document);
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
        if((boolean) request.getAttribute(this.getAlreadyFilteredAttributeName()))  { // spring security is apparently not able to do this check internally...
            filterChain.doFilter(request, response);
            return;
        }
        response.setStatus(HttpServletResponse.SC_FORBIDDEN); // default
        String uri = request.getRequestURI();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String docId = uri.substring(uri.lastIndexOf('/') + 1); // TODO: get id by other means
        boolean isUUID = false;

        try{
            UUID uuid = UUID.fromString(docId);
            isUUID = uuid.toString().equals(docId);
        } catch (IllegalArgumentException ignored){}
        if(!isUUID) { // TODO: change to check for resources dynamically (additional filter)
            if (!(authentication instanceof AnonymousAuthenticationToken) && authentication != null && authentication.getPrincipal().equals("guest")) {
                Object guestId = request.getSession().getAttribute("guestId");
                if(guestId instanceof UUID && verifyGuest(guestId.toString())) {
                    response.setStatus(HttpServletResponse.SC_ACCEPTED);
                    filterChain.doFilter(request, response);
                    return;
                }
            }
        }
         // assumes we are accessing a pdf resource which uses the pdf-id in its URI!!
        if (!(authentication instanceof AnonymousAuthenticationToken) && authentication != null && authentication.getPrincipal().equals("guest")) {
            Object guestId = request.getSession().getAttribute("guestId");
            if(guestId instanceof UUID && verifyGuest(guestId.toString(), docId)) {
                response.setStatus(HttpServletResponse.SC_ACCEPTED);
                filterChain.doFilter(request, response);
                return; // no need to go through potential token authorization if guest is already registered
            } else {
                // existing guest user but has wrong access rights
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Respond with 401 Unauthorized
            }
        }
        String token = request.getParameter("documentAccessToken");
        if(token != null) {
            if(verifyToken(token, docId, request.getSession())) {
                response.setStatus(HttpServletResponse.SC_ACCEPTED);
                List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_GUEST"));
                Authentication newAuth = new UsernamePasswordAuthenticationToken("guest", null, authorities);
                SecurityContextHolder.getContext().setAuthentication(newAuth);
                filterChain.doFilter(request, response);
            }
            return;
        }
        if(response.getStatus() == HttpServletResponse.SC_ACCEPTED) filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        for (String matcher : permitAllMatchers) {
            if(new AntPathRequestMatcher(matcher).matches(request)) {
                return true;
            }
        }
        return false;
    }

}
