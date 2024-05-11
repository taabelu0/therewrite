package ch.fhnw.therewrite.repository;

import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface DocumentRepository extends JpaRepository<Document, UUID> {

}
