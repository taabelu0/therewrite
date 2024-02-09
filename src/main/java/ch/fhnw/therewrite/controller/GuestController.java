package ch.fhnw.therewrite.controller;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.Guest;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/guest")
public class GuestController {
    private final GuestRepository guestRepository;
    private final DocumentRepository documentRepository;

    public GuestController(GuestRepository guestRepository, DocumentRepository documentRepository) {
        this.guestRepository = guestRepository;
        this.documentRepository = documentRepository;
    }

    @PostMapping("")
    public Guest saveGuest(@RequestBody Guest guest) {
        return guestRepository.save(guest);
    }

    public Guest createGuest(Document document) {
        Guest guest = new Guest();
        guest.setDocumentId(document);
        guest.setName(generateGuestName());
        return guestRepository.save(guest);
    }

    public String generateGuestName() {
        return UUID.randomUUID().toString();
    }

    @GetMapping("/all/{documentId}")
    public ResponseEntity<List<Guest>> getGuests(@PathVariable(value="documentId") String documentId) {
        UUID dId;
        try {
            dId = UUID.fromString(documentId);
        }
        catch(IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
        Document document = documentRepository.getReferenceById(dId);
        return ResponseEntity.status(HttpStatus.OK).body(document.getGuests());
    }
}
