package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.Guest;
import ch.fhnw.therewrite.repository.AnnotationRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@RestController
@RequestMapping("/api/annotation")
public class AnnotationController {
    private final AnnotationRepository annotationRepository;
    private final DocumentRepository documentRepository;
    private final GuestRepository guestRepository;

    @Autowired
    public AnnotationController(AnnotationRepository annotationRepository, DocumentRepository documentRepository, GuestRepository guestRepository) {
        this.annotationRepository = annotationRepository;
        this.documentRepository = documentRepository;
        this.guestRepository = guestRepository;
    }

    @GetMapping("/all/{documentId}")
    public ResponseEntity<List<Annotation>> getAnnotationsByDocumentId(@PathVariable String documentId) {
        UUID dId = UUID.fromString(documentId);
        Optional<Document> d = documentRepository.findById(dId);
        if (d.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(d.get().getAnnotations());
        }
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(null);
    }

    @PostMapping("")
    public Annotation saveAnnotation(@RequestBody Annotation annotation, HttpSession session) throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth.getPrincipal().equals("guest")) {
            String guestId = session.getAttribute("guestId").toString();
            UUID guestUUID = UUID.fromString(guestId);
            Optional<Guest> guest = guestRepository.findById(guestUUID);
            guest.ifPresent(annotation::setGuestCreator);
        } else {
            // TODO: implement userid assignment on user-management implementation
            throw new UnsupportedOperationException("Users do not exist");
        }
        return annotationRepository.save(annotation);
    }

    @Modifying
    @PatchMapping("")
    public ResponseEntity<Annotation> patchAnnotation(@RequestBody Annotation update) {
        Optional<Annotation> optionalAnno = annotationRepository.findById(update.getIdAnnotation());
        if (optionalAnno.isPresent()) {
            Annotation anno = optionalAnno.get();
            anno.patch(update);
            Annotation resp = annotationRepository.save(anno);
            return ResponseEntity.status(HttpStatus.OK).body(resp);
        }
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(null);
    }

    @DeleteMapping("/{annoId}")
    public ResponseEntity<Annotation> deleteAnnotation(@PathVariable String annoId) {
        UUID aId = UUID.fromString(annoId);
        Optional<Annotation> a = annotationRepository.findById(aId);
        if (a.isPresent()) {
            Annotation oldAnno = a.get();
            annotationRepository.delete(oldAnno);
            return ResponseEntity.status(HttpStatus.OK).body(oldAnno);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }
}
