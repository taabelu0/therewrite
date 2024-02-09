package ch.fhnw.therewrite;

import ch.fhnw.therewrite.controller.GuestController;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.Guest;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import java.util.UUID;

@Component
public class GuestInterceptor implements HandlerInterceptor {
    private final GuestRepository guestRepository;
    private final DocumentRepository documentRepository;

    public GuestInterceptor(GuestRepository guestRepository, DocumentRepository documentRepository) {
        this.guestRepository = guestRepository;
        this.documentRepository = documentRepository;
    }
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            String uri = request.getRequestURI();
            String docId = uri.substring(uri.lastIndexOf('/') + 1);
            return verifyGuest(request.getSession().getAttribute("guestId").toString(), docId);
        }
        return true;
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
}
