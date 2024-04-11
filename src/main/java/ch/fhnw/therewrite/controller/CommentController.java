package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.data.Comment;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.data.User;
import ch.fhnw.therewrite.repository.AnnotationRepository;
import ch.fhnw.therewrite.repository.CommentRepository;
import ch.fhnw.therewrite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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


    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment) {
        //Optional<User> user = userRepository.findById(comment.getUserId().getId());
        //if (user.isPresent()) {
            //comment.setUserId(user.get());
            Comment savedComment = commentRepository.save(comment);
            return ResponseEntity.ok(savedComment);
        //} else {
        //    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        //}
    }

    @Modifying
    @PatchMapping("")
    public ResponseEntity<Comment> patchComment(@RequestBody Comment update) {
        Optional<Comment> optionalComment = commentRepository.findById(update.getIdComment());
        if(optionalComment.isPresent()) {
            Comment comm = optionalComment.get();
            comm.patch(update);
            Comment resp = commentRepository.save(comm);
            return ResponseEntity.status(HttpStatus.OK).body(resp);
        }
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(null);
    }

    @DeleteMapping("/{commId}")
    public ResponseEntity<Comment> deleteComment(@PathVariable String commId) {
        UUID aId = UUID.fromString(commId);
        Optional<Comment> a = commentRepository.findById(aId);
        if(a.isPresent()) {
            Comment oldComm = a.get();
            commentRepository.delete(oldComm);
            return ResponseEntity.status(HttpStatus.OK).body(oldComm);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @GetMapping("/all/{annotationId}")
    public ResponseEntity<List<Comment>> getAnnotationsByDocumentId(@PathVariable String annotationId) {
        UUID aId = UUID.fromString(annotationId);
        Optional<Annotation> a = annotationRepository.findById(aId);
        if(a.isPresent()) {
            List<Comment> c = commentRepository.findAllByAnnotationId(a.get());
            return ResponseEntity.status(HttpStatus.OK).body(c);
        }
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(null);
    }
}