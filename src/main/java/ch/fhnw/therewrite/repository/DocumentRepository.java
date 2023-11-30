package ch.fhnw.therewrite.repository;

import ch.fhnw.therewrite.data.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DocumentRepository extends JpaRepository<Document, UUID> {
}
