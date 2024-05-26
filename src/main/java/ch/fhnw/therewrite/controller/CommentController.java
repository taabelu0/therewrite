package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.security.AccessHelper;
import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.data.Comment;
import ch.fhnw.therewrite.data.Guest;
import ch.fhnw.therewrite.data.User;
import ch.fhnw.therewrite.repository.*;
import ch.fhnw.therewrite.security.AuthTuple;
import jakarta.servlet.http.HttpSession;
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
@RequestMapping("/api/comment")
public class CommentController {


    private final CommentRepository commentRepository;
    private final AnnotationRepository annotationRepository;
    private final UserRepository userRepository;
    private final GuestRepository guestRepository;
    private final DocumentRepository documentRepository;
    private final AccessHelper accessHelper;

    public CommentController(CommentRepository commentRepository, AnnotationRepository annotationRepository, UserRepository userRepository, GuestRepository guestRepository, DocumentRepository documentRepository) {
        this.commentRepository = commentRepository;
        this.annotationRepository = annotationRepository;
        this.userRepository = userRepository;
        this.guestRepository = guestRepository;
        this.documentRepository = documentRepository;
        this.accessHelper = new AccessHelper(this.documentRepository, this.guestRepository);
    }


    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment, @AuthenticationPrincipal UserDetails currentUser, HttpSession session) {
        UUID guestId = (UUID) session.getAttribute("guestId");
        Annotation annotation = annotationRepository.getReferenceById(comment.getAnnotationId().getIdAnnotation());
        String documentId = annotation.getDocument().getId().toString();
        AuthTuple<Boolean ,Boolean> authTuple = accessHelper.getIsAuthorized(documentId, currentUser, guestId);
        if((!authTuple.userIsAuth() && !authTuple.guestIsAuth())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        if(authTuple.userIsAuth()) {
            User user = userRepository.findByUsername(currentUser.getUsername());
            comment.setUserId(user);
        } else {
            Guest guest = guestRepository.getReferenceById(guestId);
            comment.setGuestId(guest);
        }
        Comment savedComment = commentRepository.save(comment);
        return ResponseEntity.ok(savedComment);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @Modifying
    @PatchMapping("")
    public ResponseEntity<Comment> patchComment(@RequestBody Comment update, @AuthenticationPrincipal UserDetails currentUser, HttpSession session) {
        UUID guestId = (UUID) session.getAttribute("guestId");
        Optional<Comment> optionalComment = commentRepository.findById(update.getIdComment());
        if(optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            if(!canEditComment(currentUser, guestId, comment)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
            comment.patch(update);
            Comment resp = commentRepository.save(comment);
            return ResponseEntity.status(HttpStatus.OK).body(resp);
        }
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(null);
    }

    public boolean canEditComment(UserDetails currentUser, UUID guestId, Comment comment) {
        if(AccessHelper.isAdmin(currentUser)) return true;
        if (currentUser != null) {
            User user = userRepository.findByUsername(currentUser.getUsername());
            return user != null && user.getId().equals(comment.getUserId().getId());
        } else {
            return guestId != null && guestId.equals(comment.getGuestId().getId());
        }
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @DeleteMapping("/{commId}")
    public ResponseEntity<Comment> deleteComment(@PathVariable String commId, @AuthenticationPrincipal UserDetails currentUser, HttpSession session) {
        UUID guestId = (UUID) session.getAttribute("guestId");
        UUID aId = UUID.fromString(commId);
        Optional<Comment> oldComm = commentRepository.findById(aId);
        if(oldComm.isPresent()) {
            Comment comment = oldComm.get();
            if(!canDeleteComment(currentUser, guestId, comment)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
            commentRepository.delete(comment);
            Comment resp = new Comment();
            resp.setIdComment(comment.getIdComment());
            resp.setAnnotationId(comment.getAnnotationId());
            return ResponseEntity.status(HttpStatus.OK).body(resp);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    public boolean canDeleteComment(UserDetails currentUser, UUID guestId, Comment comment) {
        if(AccessHelper.isAdmin(currentUser)) return true;
        if (currentUser != null) {
            User user = userRepository.findByUsername(currentUser.getUsername());
            boolean userIsOwner = (user == null || user.getId().equals(comment.getUserId().getId()));
            return userIsOwner || comment.getGuestId() != null; // Any User can delete any guests' comment
        }
        return guestId != null && guestId.equals(comment.getGuestId().getId());
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @GetMapping("/all/{annotationId}")
    public ResponseEntity<List<Comment>> getCommentsByAnnotationId(@PathVariable String annotationId, @AuthenticationPrincipal UserDetails currentUser, HttpSession session) {
        UUID guestId = (UUID) session.getAttribute("guestId");
        UUID aId = UUID.fromString(annotationId);
        Optional<Annotation> a = annotationRepository.findById(aId);
        if(a.isPresent()) {
            Annotation annotation = a.get();
            String documentId = annotation.getDocument().getId().toString();
            if(accessHelper.isUnauthorized(documentId, currentUser, guestId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }
            List<Comment> c = commentRepository.findAllByAnnotationId(a.get());
            return ResponseEntity.status(HttpStatus.OK).body(c);
        }
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(null);
    }
}