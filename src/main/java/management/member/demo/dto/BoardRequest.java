package management.member.demo.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BoardRequest {
    String name;
}