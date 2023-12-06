package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.repository.AnnotationRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


@RestController
@RequestMapping("/api/annotation")
public class AnnotationController {
    private final AnnotationRepository annotationRepository;
    private final DocumentRepository documentRepository;

    @Autowired
    public AnnotationController(AnnotationRepository annotationRepository, DocumentRepository documentRepository) {
        this.annotationRepository = annotationRepository;
        this.documentRepository = documentRepository;
    }

    @GetMapping("/all/{documentId}")
    public ResponseEntity<List<Annotation>> getAnnotationsByDocumentId(@PathVariable String documentId) {
        UUID dId = UUID.fromString(documentId);
        Optional<Document> d = documentRepository.findById(dId);
        if(d.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(d.get().getAnnotations());
        }
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(null);
    }

    @PostMapping("")
    public Annotation saveAnnotation(@RequestBody Annotation annotation) {
        return annotationRepository.save(annotation);
    }

    @Modifying
    @PatchMapping("")
    public ResponseEntity<Annotation> patchAnnotation(@RequestBody Annotation update) {
        Optional<Annotation> optionalAnno = annotationRepository.findById(update.getIdAnnotation());
        if(optionalAnno.isPresent()) {
            Annotation anno = optionalAnno.get();
            anno.patch(update);
            annotationRepository.save(anno);
            return ResponseEntity.status(HttpStatus.OK).body(anno);
        }
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(null);
    }

    @DeleteMapping("")
    public void deleteAnnotation(@RequestBody Annotation annotation) {
        annotationRepository.delete(annotation);
    }
}
