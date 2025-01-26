package syncspeak.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import syncspeak.backend.entity.Message;
import syncspeak.backend.service.ChatService;

@Controller
@RequiredArgsConstructor
public class WebSocketChatController {

    private final ChatService chatService;

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public Message sendMessage(@Payload Message message) {
        return chatService.saveMessage(message);
    }
}
