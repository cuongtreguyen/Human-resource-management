package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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
    @Builder.Default
    private boolean archived = false;

    // Quan hệ One-to-Many với KanbanCard: 1 list có thể có nhiều card
    @OneToMany(mappedBy = "list", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<KanbanCard> cards = new ArrayList<>();
}
