package ch.fhnw.therewrite.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.repository.AnnotationRepository;
import ch.fhnw.therewrite.repository.DocumentRepository;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Assertions;

@SpringBootTest
public class DocumentControllerTest {

    @Autowired
    private DocumentController documentController;

    @MockBean
    private DocumentRepository documentRepository;

    @MockBean
    private AnnotationRepository annotationRepository;

    @Test
    public void testGetAllDocuments() {

        Document document = new Document();

        List<Document> documents = List.of(document);

        Mockito.when(documentRepository.findAll()).thenReturn(documents);

        List<Document> response = documentController.getDocumentList();

        Assertions.assertEquals(documents, response);

    }

}