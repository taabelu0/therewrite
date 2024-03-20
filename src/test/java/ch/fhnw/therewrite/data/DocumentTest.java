package ch.fhnw.therewrite.data;

import org.springframework.boot.test.context.SpringBootTest;
import ch.fhnw.therewrite.data.Document;

import org.hibernate.mapping.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.UUID;
import java.util.ArrayList;

@SpringBootTest
public class DocumentTest {

    @Test
    public void testSetAndGetId() {

        Document document = new Document();

        UUID id = UUID.randomUUID();

        document.setId(id);

        UUID retrievedId = document.getId();

        Assertions.assertEquals(id, retrievedId);
    }

    @Test
    public void testSetAndGetDocumentName() {

        Document document = new Document();

        String documentName = "documentName";

        document.setDocumentName(documentName);

        String retrievedDocumentName = document.getDocumentName();

        Assertions.assertEquals(documentName, retrievedDocumentName);
    }

    @Test
    public void testSetAndGetPath() {

        Document document = new Document();

        String path = "path";

        document.setPath(path);

        String retrievedPath = document.getPath();

        Assertions.assertEquals(path, retrievedPath);
    }

    @Test
    public void testSetAndGetAnnotations() {

        Document document = new Document();

        ArrayList<Annotation> annotations = new ArrayList<Annotation>();

        Annotation annotation1 = new Annotation();
        Annotation annotation2 = new Annotation();
        Annotation annotation3 = new Annotation();

        annotations.add(annotation1);
        annotations.add(annotation2);
        annotations.add(annotation3);

        document.setAnnotations(annotations);

        ArrayList<Annotation> retrievedAnnotations = (ArrayList<Annotation>) document.getAnnotations();

        Assertions.assertEquals(annotations, retrievedAnnotations);
    }

    @Test
    public void testSetAndGetGuests() {

        Document document = new Document();

        ArrayList<Guest> guests = new ArrayList<Guest>();

        Guest guest1 = new Guest();
        Guest guest2 = new Guest();
        Guest guest3 = new Guest();

        guests.add(guest1);
        guests.add(guest2);
        guests.add(guest3);

        document.setGuests(guests);

        ArrayList<Guest> retrievedGuests = (ArrayList<Guest>) document.getGuests();

        Assertions.assertEquals(guests, retrievedGuests);
    }

}
