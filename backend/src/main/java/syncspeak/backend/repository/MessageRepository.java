package syncspeak.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import syncspeak.backend.entity.Message;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findBySenderIdAndReceiverId(UUID senderId, UUID receiverId);
}
