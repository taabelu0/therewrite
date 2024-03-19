package ch.fhnw.therewrite.data;

import org.springframework.boot.test.context.SpringBootTest;
import ch.fhnw.therewrite.data.Annotation;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.UUID;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@SpringBootTest
public class AnnotationTest {

    @Test
    public void testSetAndGetId() {

        Annotation annotation = new Annotation();

        UUID id = UUID.randomUUID();

        annotation.setIdAnnotation(id);

        UUID retrievedId = annotation.getIdAnnotation();

        Assertions.assertEquals(id, retrievedId);
    }

    @Test
    public void testSetAndGetDocumentId() {

        Annotation annotation = new Annotation();

        Document document = new Document();

        annotation.setDocument(document);

        Document retrievedDocument = annotation.getDocument();

        Assertions.assertEquals(document, retrievedDocument);
    }

    @Test
    public void testSetAndGetUserId() {

        Annotation annotation = new Annotation();

        User user = new User();

        annotation.setUserCreator(user);

        User retrievedUser = annotation.getUserCreator();

        Assertions.assertEquals(user, retrievedUser);
    }

    @Test
    public void testSetAndGetTimeCreated() {

        Annotation annotation = new Annotation();

        LocalDateTime timeCreated = LocalDateTime.of(1970, 1, 1, 0, 0, 0);

        Timestamp timestamp = Timestamp.valueOf(timeCreated);

        annotation.setTimeCreated(timestamp);

        Timestamp retrievedTimeCreated = annotation.getTimeCreated();

        Assertions.assertEquals(timestamp, retrievedTimeCreated);
    }

}