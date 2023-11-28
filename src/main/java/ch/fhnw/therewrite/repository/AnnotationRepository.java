package ch.fhnw.therewrite.repository;

import ch.fhnw.therewrite.data.Annotation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AnnotationRepository extends JpaRepository<Annotation, UUID> {
}
