package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.User;
import ch.fhnw.therewrite.repository.GuestRepository;
import ch.fhnw.therewrite.repository.UserRepository;
import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.repository.AnnotationRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;

import jakarta.servlet.http.HttpSession;
import org.checkerframework.checker.units.qual.A;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
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

    private Document document;

    private UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
            .username("test")
            .password("test")
            .authorities(List.of(new SimpleGrantedAuthority("ROLE_USER")))
            .build();

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        annotationController = new AnnotationController(annotationRepository, documentRepository, userRepository, guestRepository);
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername(userDetails.getUsername());
        when(userRepository.findByUsername(any(String.class))).thenReturn(user);
        document = new Document();
        document.setId(UUID.randomUUID());
        document.setUsers(List.of(user));
        when(documentRepository.findById(any(UUID.class))).thenReturn(Optional.of(document));
    }

    @Test
    public void testSaveAnnotation() {
        Annotation annotation = new Annotation();
        annotation.setIdAnnotation(UUID.randomUUID());
        annotation.setAnnotationDetail("test");
        annotation.setDocument(document);
        when(annotationRepository.save(any(Annotation.class))).thenReturn(annotation);
        Annotation savedAnnotation = annotationController.saveAnnotation(annotation, userDetails, session);
        assertEquals(annotation, savedAnnotation);
    }

    @Test
    public void testPatchAnnotation() {
        Annotation annotation = new Annotation();
        annotation.setIdAnnotation(UUID.randomUUID());
        annotation.setDocument(document);
        annotation.setUserCreator(document.getUsers().get(0));
        Annotation update = new Annotation();
        update.setIdAnnotation(annotation.getIdAnnotation());
        update.setDocument(annotation.getDocument());
        update.setUserCreator(annotation.getUserCreator());
        update.setAnnotationDetail("new");
        when(annotationRepository.findById(annotation.getIdAnnotation())).thenReturn(Optional.of(annotation));
        when(annotationRepository.save(any(Annotation.class))).thenReturn(update);
        ResponseEntity<Annotation> response = annotationController.patchAnnotation(update, userDetails, session);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(update.getAnnotationDetail(), response.getBody().getAnnotationDetail());
    }

    @Test
    public void testDeleteAnnotation() {
        Annotation annotation = new Annotation();
        annotation.setIdAnnotation(UUID.randomUUID());
        annotation.setDocument(document);
        annotation.setUserCreator(document.getUsers().get(0));
        when(annotationRepository.findById(annotation.getIdAnnotation())).thenReturn(Optional.of(annotation));
        ResponseEntity<Annotation> response = annotationController.deleteAnnotation(annotation.getIdAnnotation().toString(), userDetails, session);
        //when(annotationRepository.findById(annotation.getIdAnnotation())).thenReturn(Optional.of(annotation));
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(annotation, response.getBody());
    }

}
