package ch.fhnw.therewrite.repository;

import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.DocumentAccessToken;
import ch.fhnw.therewrite.data.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GuestRepository extends JpaRepository<Guest, UUID> {
    Guest findById(Guest guest);
    List<Guest> findByDocumentId(Document document);
}
