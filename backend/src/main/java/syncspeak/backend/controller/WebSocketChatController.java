package syncspeak.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import syncspeak.backend.entity.Message;
import syncspeak.backend.service.ChatService;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class WebSocketChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void sendMessage(@Payload Message message) {
        chatService.saveMessage(message);

        // Send the message to the specific user based on the receiver's UUID
        String destination = "/user/" + message.getReceiverId().toString() + "/" +  message.getSenderId().toString() + "/queue/messages";
        messagingTemplate.convertAndSend(destination, message);
    }

    @MessageMapping("/mark-read")
    public void markMessageAsRead(@Payload UUID messageId) {
        chatService.findById(messageId).ifPresent(message -> {
            if (!message.isHasBeenRead()) {
                message.setHasBeenRead(true);
                chatService.saveMessage(message);

                String destination = "/user/" + message.getReceiverId().toString() + "/" +  message.getSenderId().toString() + "/queue/messages";
                messagingTemplate.convertAndSend(destination, message);
            }
        });
    }
}
