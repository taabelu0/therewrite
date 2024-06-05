package ch.fhnw.therewrite.security;

import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.DocumentAccessToken;
import ch.fhnw.therewrite.data.User;
import ch.fhnw.therewrite.repository.DocumentAccessTokenRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.UUID;

public class AccessTokenUserHandler {
    @Autowired
    static
    DocumentRepository documentRepository;
    @Autowired
    static
    UserRepository userRepository;
    @Autowired
    static
    DocumentAccessTokenRepository documentAccessTokenRepository;
    public static void handleAccessTokenOnUser(String token, String username) {
         if(token != null) {
            User user = userRepository.findByUsername(username);
            if(user == null) return;
            UUID uuidToken;
            try {
                uuidToken = UUID.fromString(token);
            } catch (IllegalArgumentException ignored) {
                return;
            }
            DocumentAccessToken documentAccessToken = documentAccessTokenRepository.getReferenceById(uuidToken);
            List<Document> docs = user.getDocuments();
            if(docs == null) return;
            Document document = documentRepository.getReferenceById(documentAccessToken.getDocumentId().getId());
            if(docs.contains(document)) return;
            docs.add(document);
            user.setDocuments(docs);
            userRepository.save(user);
        }
    }
}
