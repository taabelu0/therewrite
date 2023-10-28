package ch.fhnw.therewrite.controller;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

@RestController
public class DocumentController {
    @GetMapping("/pdf")
    @ResponseBody
    public String pdf() throws IOException {
        Resource resource = new ClassPathResource("static/index.html");
        Path path = resource.getFile().toPath();
        return new String(Files.readAllBytes(path));
    }
    @GetMapping(
            value = "/pdf/get/{pdfName}",
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    public @ResponseBody byte[] getPDF(@PathVariable(value="pdfName") String pdfName) {
        try {
            System.out.println(pdfName);
            Resource resource = new ClassPathResource("uploads/pdf/" + pdfName);
            InputStream in = resource.getInputStream();
            return in.readAllBytes();
        } catch (IOException exception) {
            // TODO: log exception
            return null;
        }
    }
    @GetMapping({"/pdf/list"})
    @ResponseBody
    public String[] GetAllPDF() throws IOException, URISyntaxException {

        ArrayList<String> alPdfNames = new ArrayList<>();

        URL url = getClass().getResource("/uploads/pdf/");
        Path path = Paths.get(url.toURI());
        if (path == null) return null; // TODO: fix exception catch -> path cannot be null: RuntimeExc is thrown on Paths.get if null

        Files.walk(path, 1).map(p -> p.getFileName().toString()).filter(s -> !s.equals("pdf")).forEach(alPdfNames::add);
        return alPdfNames.toArray(new String[alPdfNames.size()]);
    }
}
