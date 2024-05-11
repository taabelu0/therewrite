package ch.fhnw.therewrite.data;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "Comment")
public class Comment {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id")
    private UUID idComment;

    @ManyToOne
    @JoinColumn(name = "idAnnotation")
    private Annotation annotationId;

    @ManyToOne
    @JoinColumn(name = "idUser")
    private User userId;

    @ManyToOne
    @JoinColumn(name = "idGuest")
    private Guest guestId;

    @Column(name = "commentText")
    private String commentText;

    @Column(name = "timeCreated")
    private Timestamp timeCreated = new Timestamp(System.currentTimeMillis());

    public UUID getIdComment() {
        return idComment;
    }

    public void setIdComment(UUID idComment) {
        this.idComment = idComment;
    }

    public Annotation getAnnotationId() {
        return annotationId;
    }

    public void setAnnotationId(Annotation annotationId) {
        this.annotationId = annotationId;
    }

    public User getUserId() {
        return userId;
    }

    public void setUserId(User userId) {
        this.userId = userId;
    }

    public Guest getGuestId() {
        return guestId;
    }

    public void setGuestId(Guest guestId) {
        this.guestId = guestId;
    }

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }

    public Timestamp getTimeCreated() {
        return timeCreated;
    }

    public void setTimeCreated(Timestamp timeCreated) {
        this.timeCreated = timeCreated;
    }

    public void patch(Comment update) {
        if(update.commentText != null) this.setCommentText(update.commentText);
    }
}