package syncspeak.backend.entity.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class LoginResponse {
    private UUID userId;
    private String username;
    private String role;

    public LoginResponse() {
        this.userId = null;
        this.username = null;
        this.role = null;
    }
}
