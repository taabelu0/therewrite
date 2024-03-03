package ch.fhnw.therewrite.controller;

import ch.fhnw.therewrite.data.Annotation;
import ch.fhnw.therewrite.data.Comment;
import ch.fhnw.therewrite.data.User;
import ch.fhnw.therewrite.repository.AnnotationRepository;
import ch.fhnw.therewrite.repository.CommentRepository;
import ch.fhnw.therewrite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private AnnotationRepository annotationRepository;

    @Autowired
    private UserRepository userRepository;

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
}