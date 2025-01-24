package syncspeak.backend.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private Long userId;
    private String username;
    private String role;

    public LoginResponse() {
        this.userId = null;
        this.username = null;
        this.role = null;
    }
}
