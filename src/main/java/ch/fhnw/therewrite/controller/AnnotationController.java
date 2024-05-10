package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.AccessHelper;
import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.Guest;
import ch.fhnw.therewrite.data.User;
import ch.fhnw.therewrite.repository.AnnotationRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.GuestRepository;
import ch.fhnw.therewrite.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


@RestController
@RequestMapping("/api/annotation")
public class AnnotationController {
    private final AnnotationRepository annotationRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final GuestRepository guestRepository;

    @Autowired
    public AnnotationController(AnnotationRepository annotationRepository, DocumentRepository documentRepository, UserRepository userRepository, GuestRepository guestRepository) {
        this.annotationRepository = annotationRepository;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.guestRepository = guestRepository;
    }
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @GetMapping("/all/{documentId}")
    public ResponseEntity<List<Annotation>> getAnnotationsByDocumentId(@PathVariable String documentId, @AuthenticationPrincipal UserDetails currentUser, HttpSession session) {
        UUID guestId = (UUID) session.getAttribute("guestId");
        boolean unauthUser = currentUser == null || !AccessHelper.verifyUserRights(currentUser.getUsername(), documentId, documentRepository);
        boolean unauthGuest = guestId == null || !AccessHelper.verifyGuest(guestId.toString(), documentId, documentRepository, guestRepository);
        if(unauthUser && unauthGuest) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        System.out.println("hell?");
        UUID dId = UUID.fromString(documentId);
        Optional<Document> d = documentRepository.findById(dId);
        if(d.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(d.get().getAnnotations());
        }
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(null);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @PostMapping("")
    public Annotation saveAnnotation(@RequestBody Annotation annotation, @AuthenticationPrincipal UserDetails currentUser, HttpSession session) {
        UUID guestId = (UUID) session.getAttribute("guestId");
        String documentId = annotation.getDocument().getId().toString();
        boolean unauthUser = currentUser == null || !AccessHelper.verifyUserRights(currentUser.getUsername(), documentId, documentRepository);
        boolean unauthGuest = guestId == null || !AccessHelper.verifyGuest(guestId.toString(), documentId, documentRepository, guestRepository);
        if(unauthUser && unauthGuest) {
            return null;
        }
        if(currentUser != null) {
            User user = userRepository.findByUsername(currentUser.getUsername());
            annotation.setUserCreator(user);
        }
        if(guestId != null) {
            Guest guest = guestRepository.getReferenceById(guestId);
            annotation.setGuestCreator(guest);
        }
        return annotationRepository.save(annotation);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @Modifying
    @PatchMapping("")
    public ResponseEntity<Annotation> patchAnnotation(@RequestBody Annotation update, @AuthenticationPrincipal UserDetails currentUser, HttpSession session) {
        UUID guestId = (UUID) session.getAttribute("guestId");
        Optional<Annotation> optionalAnno = annotationRepository.findById(update.getIdAnnotation());
        if(optionalAnno.isPresent()) {
            String documentId =  optionalAnno.get().getDocument().getId().toString();
            boolean unauthUser = currentUser == null || !AccessHelper.verifyUserRights(currentUser.getUsername(), documentId, documentRepository);
            boolean unauthGuest = guestId == null || !AccessHelper.verifyGuest(guestId.toString(), documentId, documentRepository, guestRepository);
            if((unauthUser && unauthGuest)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }
            Annotation anno = optionalAnno.get();
            if(!unauthGuest && (anno.getGuestCreator() == null || !guestId.equals(anno.getGuestCreator().getId()))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
            anno.patch(update);
            Annotation resp = annotationRepository.save(anno);
            return ResponseEntity.status(HttpStatus.OK).body(resp);
        }
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(null);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @DeleteMapping("/{annoId}")
    public ResponseEntity<Annotation> deleteAnnotation(@PathVariable String annoId, @AuthenticationPrincipal UserDetails currentUser, HttpSession session) {
        UUID guestId = (UUID) session.getAttribute("guestId");
        UUID aId = UUID.fromString(annoId);
        Optional<Annotation> a = annotationRepository.findById(aId);
        if(a.isPresent()) {
            String documentId = a.get().getDocument().getId().toString();
            boolean unauthUser = currentUser == null || !AccessHelper.verifyUserRights(currentUser.getUsername(), documentId, documentRepository);
            boolean unauthGuest = guestId == null || !AccessHelper.verifyGuest(guestId.toString(), documentId, documentRepository, guestRepository);
            if((unauthUser && unauthGuest)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }
            Annotation oldAnno = a.get();
            if(!unauthGuest && (oldAnno.getGuestCreator() == null || !guestId.equals(oldAnno.getGuestCreator().getId()))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
            annotationRepository.delete(oldAnno);
            return ResponseEntity.status(HttpStatus.OK).body(oldAnno);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }
}
