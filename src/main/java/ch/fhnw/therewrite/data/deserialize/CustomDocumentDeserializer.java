package ch.fhnw.therewrite.data.deserialize;
import ch.fhnw.therewrite.data.Document;
import ch.fhnw.therewrite.repository.DocumentRepository;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.context.ApplicationContext;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.UUID;

public class CustomDocumentDeserializer extends JsonDeserializer<Document> {
    private DocumentRepository getDocumentRepository() {
        ApplicationContext ctx = ApplicationContextProvider.getApplicationContext();
        DocumentRepository documentRepository = ctx.getBean(DocumentRepository.class);
        return documentRepository;
    }
    @Override
    public Document deserialize(JsonParser jsonParser, DeserializationContext context) throws IOException {
        JsonNode node = jsonParser.getCodec().readTree(jsonParser);
        UUID id = UUID.fromString(node.asText());
        return getDocumentRepository().findById(id).orElse(null);
    }
}

@Component
class ApplicationContextProvider implements ApplicationContextAware {
    private static ApplicationContext context;

    public static ApplicationContext getApplicationContext() {
        return context;
    }
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        context = applicationContext;
    }
}