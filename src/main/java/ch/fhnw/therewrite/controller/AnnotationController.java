package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.service.AnnotationService;
import ch.fhnw.therewrite.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/annotation")
public class AnnotationController {
    private final AnnotationService annotationService;
    private final DocumentService documentService;

    @Autowired
    public AnnotationController(AnnotationService annotationService, DocumentService documentService) {
        this.annotationService = annotationService;
        this.documentService = documentService;
    }

    @GetMapping("/list")
    public List<Annotation> getAllAnnotations() {
        return annotationService.getAllAnnotations();
    }

    @GetMapping("/list/{uuid}")
    public List<Annotation> getAnnotationsByDocumentId(@PathVariable String uuid) {
        UUID documentId = UUID.fromString(uuid);
        return annotationService.getAnnotationsByDocumentId(documentId);
    }

    //    @GetMapping("/annotation/list")
    //    public String getAllAnnotations() {
    //        return gson.toJson(annotationService.getAllAnnotations());
    //    }

    @PostMapping("/save/{documentId}")
    public String saveAnnotation(@RequestBody Annotation annotation, @PathVariable String documentId) {
        annotation.setDocument(documentService.getDocument(UUID.fromString(documentId)));
        annotationService.saveAnnotation(annotation);
        return annotation.getIdAnnotation().toString();
    }

    @Modifying
    @PutMapping("/update/{id}")
    public void updateAnnotation(@RequestBody Annotation annotation, @PathVariable String id) {
        annotationService.updateAnnotation(annotation, id);
    }

    @Modifying
    @PutMapping("/updateText/{id}")
    public void updateAnnotationText(@RequestBody Annotation annotation, @PathVariable String id) {
        annotationService.updateAnnotationText(annotation, id);
    }

}
