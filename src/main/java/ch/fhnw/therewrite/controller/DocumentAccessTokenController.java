package ch.fhnw.therewrite.controller;
import ch.fhnw.therewrite.AccessHelper;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.DocumentAccessToken;
import ch.fhnw.therewrite.repository.DocumentAccessTokenRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/documentAccessToken")
public class DocumentAccessTokenController {
    private final DocumentAccessTokenRepository documentAccessTokenRepository;
    private final DocumentRepository documentRepository;
    private final GuestRepository guestRepository;

    public DocumentAccessTokenController(DocumentAccessTokenRepository documentAccessTokenRepository, DocumentRepository documentRepository, GuestRepository guestRepository) {
        this.documentAccessTokenRepository = documentAccessTokenRepository;
        this.documentRepository = documentRepository;
        this.guestRepository = guestRepository;
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/create")
    public ResponseEntity<String> createAccessToken(@RequestBody Map<String, String> requestBody, @AuthenticationPrincipal UserDetails currentUser) {
        String documentId = requestBody.get("documentId");
        if(documentId == null) return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).body(null);
        if(currentUser == null || !AccessHelper.verifyUserRights(currentUser.getUsername(), documentId, documentRepository)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        UUID dId;
        try {
            dId = UUID.fromString(documentId);
        } catch(IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
        // TODO: verify ownership of document (needs user management)
        DocumentAccessToken dat = new DocumentAccessToken();
        Document document = documentRepository.getReferenceById(dId);
        dat.setDocumentId(document);
        documentAccessTokenRepository.save(dat);
        return ResponseEntity.status(HttpStatus.OK).body(dat.getToken().toString());
    }

}
