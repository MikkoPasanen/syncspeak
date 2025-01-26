package syncspeak.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import syncspeak.backend.entity.Message;
import syncspeak.backend.entity.User;
import syncspeak.backend.entity.response.UserResponse;
import syncspeak.backend.mapper.UserMapper;
import syncspeak.backend.repository.MessageRepository;
import syncspeak.backend.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public List<UserResponse> getAllUsers() {
        return userRepository
                .findAll()
                .stream()
                .map(user -> userMapper.toUserResponse(user))
                .toList();
    }
}
