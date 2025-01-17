package ch.fhnw.therewrite.repository;

import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.data.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findAllByAnnotationId(Annotation annotationId);
}