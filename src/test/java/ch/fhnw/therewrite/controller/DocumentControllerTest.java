package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.repository.GuestRepository;
import ch.fhnw.therewrite.repository.UserRepository;
import ch.fhnw.therewrite.security.AccessHelper;
import ch.fhnw.therewrite.security.AuthTuple;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.repository.AnnotationRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.storage.StorageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class DocumentControllerTest {

    @Autowired
    private DocumentController documentController;

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private AnnotationRepository annotationRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    GuestRepository guestRepository;
    @Mock
    private StorageService storageService;

    @BeforeEach
    public void setup() {
        documentController = new DocumentController(documentRepository, storageService, userRepository, guestRepository);
    }

    @Test
    public void testGetAllDocuments() {

        Document document = new Document();

        List<Document> documents = List.of(document);

        when(documentRepository.findAll()).thenReturn(documents);

        List<Document> response = documentController.getDocumentList();

        Assertions.assertEquals(documents, response);
    }

}