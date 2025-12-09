package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "kanban_lists")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KanbanList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "board_id")
    private Board board;

    @Column(name = "name", length = 50)
    private String name;

    @Column(name = "position")
    private Double position;

    @Column(name = "is_archived")
    private boolean archived = false;
}
