package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.security.AuthTuple;
import ch.fhnw.therewrite.security.AccessHelper;
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
    private final AccessHelper accessHelper;

    @Autowired
    public AnnotationController(AnnotationRepository annotationRepository, DocumentRepository documentRepository, UserRepository userRepository, GuestRepository guestRepository) {
        this.annotationRepository = annotationRepository;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.guestRepository = guestRepository;
        this.accessHelper = new AccessHelper(documentRepository, guestRepository);
    }
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @GetMapping("/all/{documentId}")
    public ResponseEntity<List<Annotation>> getAnnotationsByDocumentId(@PathVariable String documentId, @AuthenticationPrincipal UserDetails currentUser, HttpSession session) {
        UUID guestId = (UUID) session.getAttribute("guestId");
        if(accessHelper.isUnauthorized(documentId, currentUser, guestId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
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
        AuthTuple<Boolean, Boolean> authTuple = accessHelper.getIsAuthorized(documentId, currentUser, guestId);
        if(authTuple.userIsAuth()) {
            User user = userRepository.findByUsername(currentUser.getUsername());
            annotation.setUserCreator(user);
        } else if(authTuple.guestIsAuth()) {
            Guest guest = guestRepository.getReferenceById(guestId);
            annotation.setGuestCreator(guest);
        } else {
            return null;
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
            AuthTuple<Boolean, Boolean> authTuple = accessHelper.getIsAuthorized(documentId, currentUser, guestId);
            if(!authTuple.userIsAuth() && !authTuple.guestIsAuth()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }

            Annotation anno = optionalAnno.get();
            if (AccessHelper.isAdmin(currentUser)) {
                return performPatch(anno, update);
            }

            if (authTuple.userIsAuth()) {
                UUID userId = userRepository.findByUsername(currentUser.getUsername()).getId();
                boolean userIsOwner = anno.getUserCreator() != null && userId.equals(anno.getUserCreator().getId());
                if(!userIsOwner && anno.getGuestCreator() == null) { // Any user can edit any annotation that is created by a guest
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
                }
            } else if(anno.getGuestCreator() == null || !guestId.equals(anno.getGuestCreator().getId())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
            return performPatch(anno, update);
        }
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(null);
    }

    public ResponseEntity<Annotation> performPatch(Annotation annotation, Annotation update) {
        annotation.patch(update);
        Annotation resp = annotationRepository.save(annotation);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @DeleteMapping("/{annoId}")
    public ResponseEntity<Annotation> deleteAnnotation(@PathVariable String annoId, @AuthenticationPrincipal UserDetails currentUser, HttpSession session) {
        UUID guestId = (UUID) session.getAttribute("guestId");
        UUID aId = UUID.fromString(annoId);
        Optional<Annotation> a = annotationRepository.findById(aId);
        System.out.println(AccessHelper.isAdmin(currentUser));
        if(a.isPresent()) {
            String documentId = a.get().getDocument().getId().toString();
            AuthTuple<Boolean, Boolean> authTuple = accessHelper.getIsAuthorized(documentId, currentUser, guestId);
            if(!authTuple.userIsAuth() && !authTuple.guestIsAuth()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }

            Annotation oldAnno = a.get();
            System.out.println("ADMIN?");
            System.out.println(AccessHelper.isAdmin(currentUser));
            System.out.println("--");
            if (AccessHelper.isAdmin(currentUser)) {
                return performDeletion(oldAnno);
            }

            if (authTuple.userIsAuth()) {
                UUID userId = userRepository.findByUsername(currentUser.getUsername()).getId();
                boolean userIsOwner = oldAnno.getUserCreator() != null && userId.equals(oldAnno.getUserCreator().getId());
                if(!userIsOwner && oldAnno.getGuestCreator() == null) { // Any user can delete any annotation that is created by a guest
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
                }
            } else if(oldAnno.getGuestCreator() == null || !guestId.equals(oldAnno.getGuestCreator().getId())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
            return performDeletion(oldAnno);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    private ResponseEntity<Annotation> performDeletion(Annotation annotation) {
        annotationRepository.delete(annotation);
        return ResponseEntity.status(HttpStatus.OK).body(annotation);
    }
}
