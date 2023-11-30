package ch.fhnw.therewrite.controller;
import ch.fhnw.therewrite.AppConfigProperties;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.service.DocumentService;
import ch.fhnw.therewrite.storage.StorageService;
import com.google.gson.Gson;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@Controller
public class DocumentController {
    private final StorageService storageService;
    private Document currentDocument;
    private final DocumentService documentService;
    private static final Gson gson = new Gson();

    public DocumentController(StorageService storageService, DocumentService documentService) {
        this.storageService = storageService;
        this.documentService = documentService;
    }
    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/view/{pdfName}")
    public String pdfView(@PathVariable("pdfName") String pdfName) {
        return "index";
    }

    @GetMapping(value="/pdf/list", produces="application/json")
    public @ResponseBody String getPDFList() {
        return gson.toJson(getAllPDFs());
    }

    private List getAllPDFs() {
        Stream<Document> pdfs = documentService.getAllPDF().stream();
        return pdfs.map(
                document -> List.of(
                        document.getDocumentName(),
                        document.getId()
                )).toList();
    }

    @GetMapping(
            value = "/pdf/get/{uuid}",
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    public @ResponseBody byte[] getPDF(@PathVariable(value="uuid") String uuid) {
        try {
            String pdfPath = documentService.getDocument(UUID.fromString(uuid)).getPath();
            Resource resource = storageService.loadAsResource(pdfPath);
            InputStream in = resource.getInputStream();
            return in.readAllBytes();
        } catch (IOException exception) {
            // TODO: log exception
            return new byte[0];
        }
    }
}
