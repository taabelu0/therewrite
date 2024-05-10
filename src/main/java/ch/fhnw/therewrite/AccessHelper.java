package ch.fhnw.therewrite;

import ch.fhnw.therewrite.controller.GuestController;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.DocumentAccessToken;
import ch.fhnw.therewrite.data.Guest;
import ch.fhnw.therewrite.data.User;
import ch.fhnw.therewrite.repository.DocumentAccessTokenRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;

import javax.print.Doc;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Component
public class AccessHelper {
    public static boolean verifyUserRights(String username, String documentId, DocumentRepository documentRepository) {
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

    public static boolean verifyGuest(String guestId, String documentId, DocumentRepository documentRepository, GuestRepository guestRepository) {
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

}
