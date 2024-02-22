package ch.fhnw.therewrite.repository;

import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.data.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface AnnotationRepository extends JpaRepository<Annotation, UUID> {
    @Query("SELECT a FROM Annotation a WHERE a.documentId = :d")
    List<Annotation> findAllByDocument(@Param("d") Document d);
}
