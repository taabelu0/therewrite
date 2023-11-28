package ch.fhnw.therewrite.data;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.Id;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "Annotation")
public class Annotation {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "idAnnotation", columnDefinition = "BINARY(16)")
    private UUID idAnnotation;

    @ManyToOne
    @JoinColumn(name = "idUserCreator")
    private User userCreator;

    private Timestamp timeCreated = new Timestamp(System.currentTimeMillis());

    @ManyToOne
    @JoinColumn(name = "idUserLastEditor")
    private User userLastEditor;

    private Timestamp timeLastEdited = new Timestamp(System.currentTimeMillis());

    private String annotationText;

    @jakarta.persistence.Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public String toString() {
        return annotationDetail;
    }

    public UUID getIdAnnotation() {
        return idAnnotation;
    }

    public void setIdAnnotation(UUID idAnnotation) {
        this.idAnnotation = idAnnotation;
    }

    public User getUserCreator() {
        return userCreator;
    }

    public void setUserCreator(User userCreator) {
        this.userCreator = userCreator;
    }

    public Timestamp getTimeCreated() {
        return timeCreated;
    }

    public void setTimeCreated(Timestamp timeCreated) {
        this.timeCreated = timeCreated;
    }

    public User getUserLastEditor() {
        return userLastEditor;
    }

    public void setUserLastEditor(User userLastEditor) {
        this.userLastEditor = userLastEditor;
    }

    public Timestamp getTimeLastEdited() {
        return timeLastEdited;
    }

    public void setTimeLastEdited(Timestamp timeLastEdited) {
        this.timeLastEdited = timeLastEdited;
    }

    public String getAnnotationText() {
        return annotationText;
    }

    public void setAnnotationText(String annotationText) {
        this.annotationText = annotationText;
    }

    public char getAnnotationType() {
        return annotationType;
    }

    public void setAnnotationType(char annotationType) {
        this.annotationType = annotationType;
    }

    public String getAnnotationDetail() {
        return annotationDetail;
    }

    public void setAnnotationDetail(String annotationDetail) {
        this.annotationDetail = annotationDetail;
    }

    private char annotationType;

    @Column(columnDefinition = "jsonb")
    private String annotationDetail;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
