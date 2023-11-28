package ch.fhnw.therewrite.service;

import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.repository.AnnotationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
}

