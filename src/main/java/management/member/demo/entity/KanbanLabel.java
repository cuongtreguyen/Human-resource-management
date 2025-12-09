package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "kanban_labels")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KanbanLabel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "board_id")
    private Board board;

    @Column(name = "name", length = 50)
    private String name;

    @Column(name = "color", length = 20)
    private String color;
}
