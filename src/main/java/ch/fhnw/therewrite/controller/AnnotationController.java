package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.service.AnnotationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api")
public class AnnotationController {
    private final AnnotationService annotationService;

    @Autowired
    public AnnotationController(AnnotationService annotationService) {
        this.annotationService = annotationService;
    }

    @GetMapping("/getAnnotations")
    public List<Annotation> getAllAnnotations() {
        return annotationService.getAllAnnotations();
    }

    @PostMapping("/saveAnnotation")
    public String saveAnnotation(@RequestBody Annotation annotation) {
        annotationService.saveAnnotation(annotation);
        return annotation.getIdAnnotation().toString();
    }

    @Modifying
    @PutMapping("/updateAnnotation/{id}")
    public void saveAnnotation(@RequestBody Annotation annotation, @PathVariable String id) {
        annotationService.updateAnnotation(annotation, id);
    }
}
