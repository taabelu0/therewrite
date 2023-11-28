package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.service.AnnotationService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/annotations")
    public List<Annotation> getAllAnnotations() {
        return annotationService.getAllAnnotations();
    }

    @PostMapping("/saveAnnotation")
    public void saveAnnotation(@RequestBody Annotation annotation) {
        System.out.println(annotation.toString());
        annotationService.saveAnnotation(annotation);

    }
}
