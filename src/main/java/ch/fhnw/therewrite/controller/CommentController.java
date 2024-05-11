package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.AccessHelper;
import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.data.Comment;
import ch.fhnw.therewrite.data.Guest;
import ch.fhnw.therewrite.data.User;
import ch.fhnw.therewrite.repository.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private AnnotationRepository annotationRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private DocumentRepository documentRepository;


    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment, @AuthenticationPrincipal UserDetails currentUser, HttpSession session) {
        UUID guestId = (UUID) session.getAttribute("guestId");
        Annotation annotation = annotationRepository.getReferenceById(comment.getAnnotationId().getIdAnnotation());
        String documentId = annotation.getDocument().getId().toString();
        boolean unauthUser = currentUser == null || !AccessHelper.verifyUserRights(currentUser.getUsername(), documentId, documentRepository);
        boolean unauthGuest = guestId == null || !AccessHelper.verifyGuest(guestId.toString(), documentId, documentRepository, guestRepository);
        if((unauthUser && unauthGuest)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        if(currentUser != null) {
            User user = userRepository.findByUsername(currentUser.getUsername());
            comment.setUserId(user);
        } else if(guestId != null) {
            Guest guest = guestRepository.getReferenceById(guestId);
            comment.setGuestId(guest);
        }

        Comment savedComment = commentRepository.save(comment);
        return ResponseEntity.ok(savedComment);
        //} else {
        //    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        //}
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @Modifying
    @PatchMapping("")
    public ResponseEntity<Comment> patchComment(@RequestBody Comment update, @AuthenticationPrincipal UserDetails currentUser, HttpSession session) {
        UUID guestId = (UUID) session.getAttribute("guestId");
        Optional<Comment> optionalComment = commentRepository.findById(update.getIdComment());
        if(optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            if(currentUser != null) {
                User user = userRepository.findByUsername(currentUser.getUsername());
                if(user == null || !user.getId().equals(comment.getUserId().getId())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
                }
            } else if(guestId != null) {
                Guest guest = guestRepository.getReferenceById(guestId);
                if(guest == null || !guest.getId().equals(comment.getGuestId().getId())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
                }
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }
            comment.patch(update);
            Comment resp = commentRepository.save(comment);
            return ResponseEntity.status(HttpStatus.OK).body(resp);
        }
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(null);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @DeleteMapping("/{commId}")
    public ResponseEntity<Comment> deleteComment(@PathVariable String commId, @AuthenticationPrincipal UserDetails currentUser, HttpSession session) {
        UUID guestId = (UUID) session.getAttribute("guestId");
        UUID aId = UUID.fromString(commId);
        Optional<Comment> oldComm = commentRepository.findById(aId);
        if(oldComm.isPresent()) {
            Comment comment = oldComm.get();
            if(currentUser != null) {
                User user = userRepository.findByUsername(currentUser.getUsername());
                if(user == null || !user.getId().equals(comment.getUserId().getId())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
                }
            } else if(guestId != null) {
                Guest guest = guestRepository.getReferenceById(guestId);
                if(guest == null || !guest.getId().equals(comment.getGuestId().getId())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
                }
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }
            commentRepository.delete(comment);
            Comment resp = new Comment();
            resp.setIdComment(comment.getIdComment());
            resp.setAnnotationId(comment.getAnnotationId());
            return ResponseEntity.status(HttpStatus.OK).body(resp);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @GetMapping("/all/{annotationId}")
    public ResponseEntity<List<Comment>> getCommentsByAnnotationId(@PathVariable String annotationId, @AuthenticationPrincipal UserDetails currentUser, HttpSession session) {
        UUID guestId = (UUID) session.getAttribute("guestId");
        UUID aId = UUID.fromString(annotationId);
        Optional<Annotation> a = annotationRepository.findById(aId);
        if(a.isPresent()) {
            Annotation annotation = a.get();
            String documentId = annotation.getDocument().getId().toString();
            boolean unauthUser = currentUser == null || !AccessHelper.verifyUserRights(currentUser.getUsername(), documentId, documentRepository);
            boolean unauthGuest = guestId == null || !AccessHelper.verifyGuest(guestId.toString(), documentId, documentRepository, guestRepository);
            if((unauthUser && unauthGuest)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }
            List<Comment> c = commentRepository.findAllByAnnotationId(a.get());
            return ResponseEntity.status(HttpStatus.OK).body(c);
        }
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(null);
    }
}