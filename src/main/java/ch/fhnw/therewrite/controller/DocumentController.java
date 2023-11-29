package ch.fhnw.therewrite.controller;
import ch.fhnw.therewrite.AppConfigProperties;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.storage.StorageService;
import com.google.gson.Gson;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

@Controller
public class DocumentController {
    private final StorageService storageService;
    private Document currentDocument;

    private final Gson gson = new Gson();

    public DocumentController(StorageService storageService, AppConfigProperties acp) {
        this.storageService = storageService;

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
        Stream<Path> pdfs = storageService.loadAll();
        return pdfs.map(
                path -> List.of(
                        path.getFileName().toString(),
                        "/view/"
                                + path.getFileName())).toList();
    }

    @GetMapping(
            value = "/pdf/get/{pdfName}",
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    public @ResponseBody byte[] getPDF(@PathVariable(value="pdfName") String pdfName) {
        try {
            Resource resource = storageService.loadAsResource(pdfName);
            InputStream in = resource.getInputStream();
            return in.readAllBytes();
        } catch (IOException exception) {
            // TODO: log exception
            return new byte[0];
        }
    }
}
