package syncspeak.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import syncspeak.backend.entity.Message;
import syncspeak.backend.service.ChatService;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatService chatService;

    // Get chat history between 2 users
    @GetMapping("/{senderId}/{receiverId}")
    public List<Message> getChatHistory(@PathVariable UUID senderId, @PathVariable UUID receiverId) {
        return chatService.getChatHistory(senderId, receiverId);
    }
}
