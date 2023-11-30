package ch.fhnw.therewrite.service;

import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.repository.AnnotationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AnnotationService {

    private final AnnotationRepository annotationRepository;

    @Autowired
    public AnnotationService(AnnotationRepository annotationRepository) {
        this.annotationRepository = annotationRepository;
    }

    public List<Annotation> getAllAnnotations() {
        return annotationRepository.findAll();
    }

    public void saveAnnotation(Annotation annotation) {
        annotationRepository.save(annotation);
    }

    public void updateAnnotation(Annotation annotation, String id) {
        Annotation a = annotationRepository.findById(UUID.fromString(id)).orElseThrow(() -> new IllegalArgumentException("Invalid annotation Id:" + id));
        a.setAnnotationDetail(annotation.getAnnotationDetail());
        a.setAnnotationText(annotation.getAnnotationText());
        annotationRepository.save(a);
    }
}

