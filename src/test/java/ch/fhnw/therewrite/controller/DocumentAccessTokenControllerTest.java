package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.DocumentAccessToken;
import ch.fhnw.therewrite.data.User;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedConstruction;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import ch.fhnw.therewrite.repository.DocumentAccessTokenRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;
import java.util.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import static org.mockito.Mockito.*;


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


    private UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
            .username("test")
            .password("test")
            .authorities(List.of(new SimpleGrantedAuthority("ROLE_USER")))
            .build();

    @Mock
    private HttpSession session;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        documentAccessTokenController = new DocumentAccessTokenController(documentAccessTokenRepository,
            documentRepository, guestRepository);
    }

      @Test
        public void testCreateAccessToken() throws Exception {
            Document document = new Document();
            UUID documentId = UUID.randomUUID();
            document.setId(documentId);
            DocumentAccessToken dat = new DocumentAccessToken();
            dat.setDocumentId(document);
            UUID token = UUID.randomUUID();
            dat.setToken(token);
            ArrayList<DocumentAccessToken> datList = new ArrayList<>();
            datList.add(dat);
            document.setAccessTokens(datList);
            Map<String, String> requestBody = Map.of("documentId", documentId.toString());
            User user = new User();
            user.setUsername(userDetails.getUsername());
            document.setUsers(List.of(user));
            when(documentRepository.findById(any(UUID.class))).thenReturn(Optional.of(document));
            try (MockedConstruction<DocumentAccessToken> mocked = mockConstruction(DocumentAccessToken.class, (mock, context) -> {
                when(mock.getToken()).thenReturn(dat.getToken());
            })) {
                ResponseEntity<String> response = documentAccessTokenController.createAccessToken(requestBody, userDetails);
                Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
                Assertions.assertEquals(token.toString(), response.getBody());
            }
        }



    @Test
    public void testCreateAccessTokenInvalidDocumentId() {
        Map<String, String> requestBody = Map.of("documentId", "invalid");
        ResponseEntity<String> response = documentAccessTokenController.createAccessToken(requestBody, userDetails);
        Assertions.assertEquals(HttpStatus.PRECONDITION_FAILED, response.getStatusCode());
        Assertions.assertNull(response.getBody());
    }
}