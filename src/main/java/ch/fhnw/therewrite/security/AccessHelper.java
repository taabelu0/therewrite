package ch.fhnw.therewrite.security;

import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.Guest;
import ch.fhnw.therewrite.data.User;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Component
public class AccessHelper {

    private final DocumentRepository documentRepository;
    private final GuestRepository guestRepository;
    public AccessHelper(DocumentRepository documentRepository, GuestRepository guestRepository) {
        this.documentRepository = documentRepository;
        this.guestRepository = guestRepository;
    }
    public boolean verifyUserRights(String username, String documentId) {
        if(username == null || documentId == null) return false;
        UUID dId;
        Document document;
        try {
            dId = UUID.fromString(documentId);
            document = documentRepository.findById(dId).orElseThrow();
        }
        catch(IllegalArgumentException | NoSuchElementException exception) {
            // TODO: log exception
            return false;
        }
        List<User> users = document.getUsers();
        return users.size() > 0 && users.stream().anyMatch(u -> u.getUsername().equals(username));
    }

    public boolean verifyGuest(String guestId, String documentId) {
        if(guestId == null || documentId == null) return false;
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

    public boolean isUnauthorized(String documentId, UserDetails currentUser, UUID guestId) {
        AuthTuple<Boolean, Boolean> st = getIsAuthorized(documentId, currentUser, guestId);
        return !st.userIsAuth() && !st.guestIsAuth();
    }

    public AuthTuple<Boolean, Boolean> getIsAuthorized(String documentId, UserDetails currentUser, UUID guestId) {
        boolean authUser = currentUser != null && verifyUserRights(currentUser.getUsername(), documentId);
        boolean authGuest = guestId != null && verifyGuest(guestId.toString(), documentId);
        return new AuthTuple<>(authUser || AccessHelper.isAdmin(currentUser), authGuest);
    }

    public static boolean isAdmin(UserDetails userDetails) {
        return userDetails != null &&
                userDetails.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
    }

}
