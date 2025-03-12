package syncspeak.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import syncspeak.backend.entity.Message;
import syncspeak.backend.service.ChatService;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;


    // Get chat history between 2 users
    @GetMapping("/{senderId}/{receiverId}")
    public ResponseEntity<List<Message>> getChatHistory(@PathVariable UUID senderId, @PathVariable UUID receiverId) {
        List<Message> messages = chatService.getChatHistory(senderId, receiverId);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    // Mark old messages as read
    @PostMapping("/mark-read")
    public ResponseEntity<?> markMessagesAsRead(@RequestBody List<UUID> messageIds) {
        List<Message> updatedMessages = new ArrayList<>();

        for (UUID messageId : messageIds) {
            chatService.findById(messageId).ifPresent(message -> {
                if (!message.isHasBeenRead()) {
                    message.setHasBeenRead(true);
                    chatService.saveMessage(message);
                    updatedMessages.add(message);
                }
            });
        }

        // Notify sender that the messages have been read
        for (Message msg : updatedMessages) {
            String destination = "/user/" + msg.getSenderId().toString() + "/" + msg.getReceiverId().toString() + "/queue/messages";
            messagingTemplate.convertAndSend(destination, msg);
        }

        return ResponseEntity.ok().build();
    }
}
