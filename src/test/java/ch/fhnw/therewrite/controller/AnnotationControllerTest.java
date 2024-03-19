package ch.fhnw.therewrite.controller;

import org.springframework.boot.test.context.SpringBootTest;
import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.repository.AnnotationRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import jakarta.annotation.security.RunAs;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Optional;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AnnotationControllerTest {

    @Mock
    private AnnotationRepository annotationRepository;

    @Mock
    private DocumentRepository documentRepository;

    private AnnotationController annotationController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        annotationController = new AnnotationController(annotationRepository, documentRepository);
    }

    @Test
    public void testSaveAnnotation() {

        Annotation annotation = new Annotation();
        when(annotationRepository.save(annotation)).thenReturn(annotation);

        Annotation savedAnnotation = annotationController.saveAnnotation(annotation);

        assertEquals(annotation, savedAnnotation);
    }

    @Test
    public void testPatchAnnotation() {

        Annotation update = new Annotation();
        when(annotationRepository.findById(update.getIdAnnotation())).thenReturn(Optional.of(update));

        ResponseEntity<Annotation> response = annotationController.patchAnnotation(update);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(update.getAnnotationDetail(), response.getBody());
    }

    @Test
    public void testDeleteAnnotation() {

        UUID annoId = UUID.randomUUID();
        Annotation annotation = new Annotation();
        when(annotationRepository.findById(annoId)).thenReturn(Optional.of(annotation));

        ResponseEntity<Annotation> response = annotationController.deleteAnnotation(annoId.toString());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(annotation, response.getBody());
        verify(annotationRepository, times(1)).delete(annotation);
    }

}
