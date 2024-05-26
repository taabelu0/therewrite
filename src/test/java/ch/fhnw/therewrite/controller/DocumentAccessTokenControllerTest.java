package ch.fhnw.therewrite.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import ch.fhnw.therewrite.repository.DocumentAccessTokenRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;

import java.util.Map;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;

@ExtendWith(MockitoExtension.class)
public class DocumentAccessTokenControllerTest {

    @Mock
    private DocumentAccessTokenController documentAccessTokenController;

    @Mock
    private DocumentAccessTokenRepository documentAccessTokenRepository;

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private GuestRepository guestRepository;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        documentAccessTokenController = new DocumentAccessTokenController(documentAccessTokenRepository,
            documentRepository, guestRepository);
    }

    /**
     * @Test
     *       public void testCreateAccessToken() {
     *       Document document = new Document();
     *       UUID documentId = UUID.randomUUID();
     *       document.setId(documentId);
     *       DocumentAccessToken dat = new DocumentAccessToken();
     *       dat.setDocumentId(document);
     *       UUID token = UUID.randomUUID();
     *       dat.setToken(token);
     *       ArrayList<DocumentAccessToken> datList = new
     *       ArrayList<DocumentAccessToken>();
     *       datList.add(dat);
     *       document.setAccessTokens(datList);
     *       Map<String, String> requestBody = Map.of("documentId",
     *       documentId.toString());
     *       ResponseEntity<String> response =
     *       documentAccessTokenController.createAccessToken(requestBody);
     *       Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
     *       Assertions.assertEquals(token.toString(), response.getBody());
     *       }
     *
     **/

    @Test
    public void testCreateAccessTokenInvalidDocumentId() {
        Map<String, String> requestBody = Map.of("documentId", "invalid");
        ResponseEntity<String> response = documentAccessTokenController.createAccessToken(requestBody, null); // TODO: proper user auth
        Assertions.assertEquals(HttpStatus.PRECONDITION_FAILED, response.getStatusCode());
        Assertions.assertNull(response.getBody());
    }
}