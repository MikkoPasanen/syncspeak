package syncspeak.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import syncspeak.backend.entity.Message;
import syncspeak.backend.repository.MessageRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final MessageRepository messageRepository;

    public List<Message> getChatHistory(UUID senderId, UUID receiverId) {
        return messageRepository.findChatHistory(senderId, receiverId);
    }

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }
}
