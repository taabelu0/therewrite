package ch.fhnw.therewrite.service;
import ch.fhnw.therewrite.data.Document;
import org.springframework.stereotype.Service;
import ch.fhnw.therewrite.repository.DocumentRepository;

import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;

    DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public List<Document> getAllPDF() {
        return documentRepository.findAll();
    }

    public Document getDocument(UUID id) {
        return documentRepository.findById(id).get();
    }
}