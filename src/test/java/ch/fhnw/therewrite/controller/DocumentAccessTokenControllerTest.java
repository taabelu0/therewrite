package ch.fhnw.therewrite.controller;

import org.springframework.boot.test.context.SpringBootTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.DocumentAccessToken;
import ch.fhnw.therewrite.repository.DocumentAccessTokenRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.UserRepository;

import java.util.ArrayList;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.Assertions;

@SpringBootTest
public class DocumentAccessTokenControllerTest {

    @Autowired
    private DocumentAccessTokenController documentAccessTokenController;

    @MockBean
    private DocumentAccessTokenRepository documentAccessTokenRepository;

    @MockBean
    private DocumentRepository documentRepository;

    @MockBean
    private UserRepository userRepository;

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
        ResponseEntity<String> response = documentAccessTokenController.createAccessToken(requestBody);
        Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        Assertions.assertNull(response.getBody());
    }
}