package ch.fhnw.therewrite.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

@RestController
public class PDFController {
    @GetMapping({"/api/all-pdf"})
    @ResponseBody
    public String[] GetAllPDF() throws IOException, URISyntaxException {

        ArrayList<String> alPdfNames = new ArrayList<>();

        URL url = getClass().getResource("/static/pdf/");
        Path path = Paths.get(url.toURI());
        if (path == null) return null;

        Files.walk(path, 1).map(p -> p.getFileName().toString()).filter(s -> !s.equals("pdf")).forEach(alPdfNames::add);
        return alPdfNames.toArray(new String[alPdfNames.size()]);
    }
}
