package syncspeak.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import syncspeak.backend.entity.Message;
import syncspeak.backend.repository.MessageRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final MessageRepository messageRepository;

    public List<Message> getChatHistory(UUID senderId, UUID receiverId) {
        return messageRepository.findChatHistory(senderId, receiverId);
    }

    public void saveMessage(Message message) {
        messageRepository.save(message);
    }

    public Optional<Message> findById(UUID messageId) {
        return messageRepository.findById(messageId);
    }
}
