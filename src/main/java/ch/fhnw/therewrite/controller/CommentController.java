package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.AccessHelper;
import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.data.Comment;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.User;
import ch.fhnw.therewrite.repository.AnnotationRepository;
import ch.fhnw.therewrite.repository.CommentRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;
import ch.fhnw.therewrite.repository.UserRepository;
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
@RequestMapping("/api/comment")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private AnnotationRepository annotationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DocumentRepository documentRepository;


    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment, @AuthenticationPrincipal UserDetails currentUser) {
        Annotation annotation = annotationRepository.getReferenceById(comment.getAnnotationId().getIdAnnotation());
        if(currentUser == null || !AccessHelper.verifyUserRights(currentUser.getUsername(), annotation.getDocument().getId().toString(), documentRepository)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        User user = userRepository.findByUsername(currentUser.getUsername());
        //if (user.isPresent()) {
        comment.setUserId(user);
        Comment savedComment = commentRepository.save(comment);
        return ResponseEntity.ok(savedComment);
        //} else {
        //    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        //}
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @Modifying
    @PatchMapping("")
    public ResponseEntity<Comment> patchComment(@RequestBody Comment update, @AuthenticationPrincipal UserDetails currentUser) {
        if(currentUser == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        User user = userRepository.findByUsername(currentUser.getUsername());
        Comment comment = commentRepository.findById(update.getIdComment()).orElseThrow();
        if(user == null || !user.getIdUser().equals(comment.getUserId().getIdUser())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Optional<Comment> optionalComment = commentRepository.findById(update.getIdComment());
        if(optionalComment.isPresent()) {
            Comment comm = optionalComment.get();
            comm.patch(update);
            Comment resp = commentRepository.save(comm);
            return ResponseEntity.status(HttpStatus.OK).body(resp);
        }
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(null);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_GUEST')")
    @DeleteMapping("/{commId}")
    public ResponseEntity<Comment> deleteComment(@PathVariable String commId, @AuthenticationPrincipal UserDetails currentUser) {
        if(currentUser == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        User user = userRepository.findByUsername(currentUser.getUsername());
        Comment comment = commentRepository.getReferenceById(UUID.fromString(commId));
        if(user == null || !user.getIdUser().equals(comment.getUserId().getIdUser())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        UUID aId = UUID.fromString(commId);
        Comment oldComm = commentRepository.getReferenceById(aId);
        if(oldComm != null) {
            commentRepository.delete(oldComm);
            Comment resp = new Comment();
            resp.setIdComment(oldComm.getIdComment());
            resp.setAnnotationId(oldComm.getAnnotationId());
            return ResponseEntity.status(HttpStatus.OK).body(resp);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @GetMapping("/all/{annotationId}")
    public ResponseEntity<List<Comment>> getCommentsByAnnotationId(@PathVariable String annotationId, @AuthenticationPrincipal UserDetails currentUser) {
        UUID aId = UUID.fromString(annotationId);
        Optional<Annotation> a = annotationRepository.findById(aId);
        if(a.isPresent()) {
            if(currentUser == null || !AccessHelper.verifyUserRights(currentUser.getUsername(), a.get().getDocument().getId().toString(), documentRepository)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
            List<Comment> c = commentRepository.findAllByAnnotationId(a.get());
            return ResponseEntity.status(HttpStatus.OK).body(c);
        }
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(null);
    }
}