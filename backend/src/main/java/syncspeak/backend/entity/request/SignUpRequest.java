package syncspeak.backend.entity.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignUpRequest {
    @NotBlank
    @Size(max = 30, message = "Username cannot be over 30 charecters long")
    private String username;

    @NotBlank
    @Size(min = 8, message = "Password needs to be at least 8 characters")
    private String password;
}
