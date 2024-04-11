package ch.fhnw.therewrite.data;

import org.springframework.boot.test.context.SpringBootTest;
import ch.fhnw.therewrite.data.Guest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

@ExtendWith(MockitoExtension.class)
public class GuestTest {

    @Test
    public void testSetAndGetId() {

        Guest guest = new Guest();

        UUID id = UUID.randomUUID();

        guest.setId(id);

        UUID retrievedId = guest.getId();

        Assertions.assertEquals(id, retrievedId);
    }

    @Test
    public void testSetAndGetDocumentId() {

        Guest guest = new Guest();

        Document document = new Document();

        guest.setDocumentId(document);

        Document retrievedDocument = guest.getDocumentId();

        Assertions.assertEquals(document, retrievedDocument);
    }

}
