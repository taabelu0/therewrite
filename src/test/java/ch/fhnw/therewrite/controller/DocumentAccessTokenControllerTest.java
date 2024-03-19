package ch.fhnw.therewrite.controller;

import org.springframework.boot.test.context.SpringBootTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.DocumentAccessToken;
import ch.fhnw.therewrite.repository.DocumentAccessTokenRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;
import ch.fhnw.therewrite.repository.UserRepository;

import java.util.ArrayList;
import java.util.Map;
import java.util.UUID;

import org.aspectj.lang.annotation.Before;
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
        ResponseEntity<String> response = documentAccessTokenController.createAccessToken(requestBody);
        Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        Assertions.assertNull(response.getBody());
    }
}