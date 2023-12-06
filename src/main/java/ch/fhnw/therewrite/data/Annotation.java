package ch.fhnw.therewrite.data;

import ch.fhnw.therewrite.data.deserialize.CustomDocumentDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.persistence.*;
import org.hibernate.annotations.ColumnTransformer;
import org.hibernate.annotations.GenericGenerator;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "Annotation")
public class Annotation {

    @jakarta.persistence.Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id")
    private UUID idAnnotation;

    @Column(columnDefinition = "jsonb")
    @ColumnTransformer(write = "?::jsonb")
    private String annotationDetail;

    @ManyToOne
    @JoinColumn(name = "idUserCreator")
    private User userCreator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "documentId", nullable = false)
    @JsonDeserialize(using = CustomDocumentDeserializer.class)
    private Document documentId;

    private Timestamp timeCreated = new Timestamp(System.currentTimeMillis());

    private String annotationType;

    @ManyToOne
    @JoinColumn(name = "idUserLastEditor")
    private User userLastEditor;

    private Timestamp timeLastEdited = new Timestamp(System.currentTimeMillis());

    private String annotationText;

    public UUID getIdAnnotation() {
        return idAnnotation;
    }

    public void setIdAnnotation(UUID idAnnotation) {
        this.idAnnotation = idAnnotation;
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

    public void patch(Annotation update) {
        // id, creator, document, type, timeCreated cannot change
        if(update.annotationDetail != null) this.setAnnotationDetail(update.annotationDetail);
        if(update.annotationText != null) this.setAnnotationText(update.annotationText);

        this.setUserLastEditor(update.userLastEditor);
        this.setTimeLastEdited(update.timeLastEdited);
    }
}