package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.repository.GuestRepository;
import ch.fhnw.therewrite.repository.UserRepository;
import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.repository.AnnotationRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;

import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Optional;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AnnotationControllerTest {

    @Mock
    private AnnotationRepository annotationRepository;

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private AnnotationController annotationController;
    @Mock
    private UserRepository userRepository;
    @Mock
    private GuestRepository guestRepository;

    @Mock
    private HttpSession session;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        annotationController = new AnnotationController(annotationRepository, documentRepository, userRepository, guestRepository);
    }

    @Test
    public void testSaveAnnotation() {

        Annotation annotation = new Annotation();
        annotation.setIdAnnotation(UUID.randomUUID());
        annotation.setAnnotationDetail("test");

        session.setAttribute("guestId", UUID.randomUUID());

        Document document = new Document();
        document.setId(UUID.randomUUID());
        annotation.setDocument(document);

        Annotation savedAnnotation = annotationController.saveAnnotation(annotation, null, session);

        assertNull(savedAnnotation);
    }

    @Test
    public void testPatchAnnotation() {

        Annotation update = new Annotation();
        update.setIdAnnotation(UUID.randomUUID());

        when(annotationRepository.findById(update.getIdAnnotation())).thenReturn(Optional.of(update));
        Document document = new Document();
        document.setId(UUID.randomUUID());
        update.setDocument(document);

        session.setAttribute("guestId", UUID.randomUUID());

        ResponseEntity<Annotation> response = annotationController.patchAnnotation(update, null, session);


        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals(update.getAnnotationDetail(), response.getBody());
    }

    @Test
    public void testDeleteAnnotation() {

        Annotation annotation = new Annotation();
        annotation.setIdAnnotation(UUID.randomUUID());

        ResponseEntity<Annotation> response = annotationController.deleteAnnotation(annotation.getIdAnnotation().toString(), null, session); // TODO: proper auth
        //when(annotationRepository.findById(annotation.getIdAnnotation())).thenReturn(Optional.of(annotation));

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());
    }

}
