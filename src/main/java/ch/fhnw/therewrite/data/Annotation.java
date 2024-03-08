package ch.fhnw.therewrite.data;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.ColumnTransformer;
import org.hibernate.annotations.GenericGenerator;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "Annotation")
public class Annotation implements Serializable {

    @jakarta.persistence.Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id")
    @JsonProperty
    private UUID idAnnotation;

    @Column(columnDefinition = "jsonb")
    @ColumnTransformer(write = "?::jsonb")
    @JsonProperty
    private String annotationDetail;

    @ManyToOne
    @JoinColumn(name = "idUserCreator")
    @JsonProperty
    private User userCreator;

    @ManyToOne
    @JoinColumn(name = "idGuestCreator")
    @JsonProperty
    private Guest guestCreator;
    @ManyToOne(fetch = FetchType.EAGER) // needs eager
    @JoinColumn(name = "documentId", nullable = false)
    @JsonProperty
    private Document documentId;

    @JsonProperty
    private Timestamp timeCreated = new Timestamp(System.currentTimeMillis());

    @JsonProperty
    private String annotationType;

    @ManyToOne
    @JoinColumn(name = "idUserLastEditor")
    @JsonProperty
    private User userLastEditor;

    @JsonProperty
    private Timestamp timeLastEdited = new Timestamp(System.currentTimeMillis());

    @JsonProperty
    private String annotationText;

    public UUID getIdAnnotation() {
        return idAnnotation;
    }

    public void setIdAnnotation(UUID idAnnotation) {
        this.idAnnotation = idAnnotation;
    }

    public Document getDocument() {
        return documentId;
    }
    public void setDocument(Document document) {
        this.documentId = document;
    }

    public User getUserCreator() {
        return userCreator;
    }

    public void setUserCreator(User userCreator) {
        this.userCreator = userCreator;
    }

    public Guest getGuestCreator() {
        return guestCreator;
    }

    public void setGuestCreator(Guest guestCreator) {
        this.guestCreator = guestCreator;
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

    public String getAnnotationType() {
        return annotationType;
    }

    public void setAnnotationType(String annotationType) {
        this.annotationType = annotationType;
    }

    public String getAnnotationDetail() {
        return annotationDetail;
    }

    public void setAnnotationDetail(String annotationDetail) {
        this.annotationDetail = annotationDetail;
    }

    // gets UUID of the annotations owner ignoring whether the user is logged in or a guest
    public UUID getOwner() {
        return userCreator != null ? userCreator.getId() : guestCreator.getId();
    }

    public void patch(Annotation update) {
        // id, creator, document, type, timeCreated cannot change
        if(update.annotationDetail != null) this.setAnnotationDetail(update.annotationDetail);
        if(update.annotationText != null) this.setAnnotationText(update.annotationText); // Remove the isEmpty check

        this.setUserLastEditor(update.userLastEditor);
        this.setTimeLastEdited(update.timeLastEdited);
    }

    public String toString() {
        return "Annotation{" +
                "idAnnotation=" + idAnnotation +
                ", userCreator=" + userCreator +
                ", timeCreated=" + timeCreated +
                ", userLastEditor=" + userLastEditor +
                ", timeLastEdited=" + timeLastEdited +
                ", annotationText='" + annotationText + '\'' +
                ", annotationType=" + annotationType +
                ", annotationDetail='" + annotationDetail + '\'' +
                '}';
    }
}