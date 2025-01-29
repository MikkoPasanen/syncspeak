package syncspeak.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import syncspeak.backend.entity.Message;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    @Query(value = "SELECT * FROM messages " +
            "WHERE (sender_id = :user1 AND receiver_id = :user2) " +
            "   OR (sender_id = :user2 AND receiver_id = :user1)",
            nativeQuery = true)
    List<Message> findChatHistory(@Param("user1") UUID user1, @Param("user2") UUID user2);
}
