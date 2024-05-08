package ch.fhnw.therewrite;

import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.User;
import ch.fhnw.therewrite.repository.DocumentRepository;
import org.springframework.stereotype.Component;

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
}
