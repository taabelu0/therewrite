package ch.fhnw.therewrite.controller;
import ch.fhnw.therewrite.security.AccessHelper;
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

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/documentAccessToken")
public class DocumentAccessTokenController {
    private final DocumentAccessTokenRepository documentAccessTokenRepository;
    private final DocumentRepository documentRepository;
    private final AccessHelper accessHelper;

    public DocumentAccessTokenController(DocumentAccessTokenRepository documentAccessTokenRepository, DocumentRepository documentRepository, GuestRepository guestRepository) {
        this.documentAccessTokenRepository = documentAccessTokenRepository;
        this.documentRepository = documentRepository;
        this.accessHelper = new AccessHelper(documentRepository, guestRepository);
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/create")
    public ResponseEntity<String> createAccessToken(@RequestBody Map<String, String> requestBody, @AuthenticationPrincipal UserDetails currentUser) {
        String documentId = requestBody.get("documentId");
        UUID dId;
        try {
            dId = getDocumentUUIDAuthorized(documentId, currentUser);
        } catch(IllegalArgumentException  ignored) {
            return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).body(null);
        } catch(IllegalAccessException ignored) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        DocumentAccessToken dat = new DocumentAccessToken();
        Document document = documentRepository.getReferenceById(dId);
        dat.setDocumentId(document);
        documentAccessTokenRepository.save(dat);
        String strToken = "";
        try {
            strToken = dat.getToken().toString();
        } catch (NullPointerException ignored) {}
        return ResponseEntity.status(HttpStatus.OK).body(strToken);
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/{documentId}")
    public ResponseEntity<String> getAccessToken(@PathVariable("documentId") String documentId, @AuthenticationPrincipal UserDetails currentUser) {
        UUID dId;
        try {
            dId = getDocumentUUIDAuthorized(documentId, currentUser);
        } catch(IllegalArgumentException  ignored) {
            return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).body(null);
        } catch(IllegalAccessException ignored) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        Document document = documentRepository.getReferenceById(dId);
        List<DocumentAccessToken> dats = document.getAccessTokens();
        DocumentAccessToken dat;
        if(!dats.isEmpty()) {
            dat = dats.get(0);
        } else {
            dat = new DocumentAccessToken();
            dat.setDocumentId(document);
            documentAccessTokenRepository.save(dat);
        }
        return ResponseEntity.status(HttpStatus.OK).body(dat.getToken().toString());
    }

    public UUID getDocumentUUIDAuthorized(String documentId, UserDetails currentUser) throws IllegalAccessException, IllegalArgumentException {
        if(documentId == null) throw new IllegalArgumentException();
        if(currentUser == null) throw new IllegalAccessException();
        if(!UUID.fromString(documentId).toString().equals(documentId)) throw new IllegalArgumentException();
        boolean isAdmin = AccessHelper.isAdmin(currentUser);
        if(!accessHelper.verifyUserRights(currentUser.getUsername(), documentId) && !isAdmin) {
            throw new IllegalAccessException();
        }
        return UUID.fromString(documentId);
    }
}
