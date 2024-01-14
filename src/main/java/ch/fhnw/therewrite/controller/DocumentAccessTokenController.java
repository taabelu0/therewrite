package ch.fhnw.therewrite.controller;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.DocumentAccessToken;
import ch.fhnw.therewrite.data.Guest;
import ch.fhnw.therewrite.repository.DocumentAccessTokenRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/documentAccessToken")
public class DocumentAccessTokenController {
    private final DocumentAccessTokenRepository documentAccessTokenRepository;
    private final DocumentRepository documentRepository;

    public DocumentAccessTokenController(DocumentAccessTokenRepository documentAccessTokenRepository, DocumentRepository documentRepository) {
        this.documentAccessTokenRepository = documentAccessTokenRepository;
        this.documentRepository = documentRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createAccessToken(@RequestBody Map<String, String> requestBody) {
        String documentId = requestBody.get("documentId");
        UUID dId;
        try {
            dId = UUID.fromString(documentId);
        } catch(IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
        DocumentAccessToken dat = new DocumentAccessToken();
        Document document = documentRepository.getReferenceById(dId);
        dat.setDocumentId(document);
        documentAccessTokenRepository.save(dat);
        return ResponseEntity.status(HttpStatus.OK).body(dat.getToken().toString());
    }


    @PostMapping("/verify")
    public ResponseEntity<Boolean> verifyToken(@RequestBody Map<String, String> requestBody) {
        String documentAccessToken = requestBody.get("documentAccessToken");
        String documentId = requestBody.get("documentId");
        UUID dId;
        try {
            dId = UUID.fromString(documentId);
        }
        catch(IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
        Document document = documentRepository.getReferenceById(dId);
        boolean valid = document.getAccessTokens().stream().map(dat -> dat.getToken().toString())
                .anyMatch(t -> t.equals(documentAccessToken));
        return ResponseEntity.status(HttpStatus.OK).body(valid);
    }

}
