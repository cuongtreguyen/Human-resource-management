package management.member.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import management.member.demo.enums.KanbanCardPriority;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "kanban_cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KanbanCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "list_id")
    private KanbanList list;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private Employee creator;

    @Column(name = "title")
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "position")
    private Double position;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private KanbanCardPriority priority = KanbanCardPriority.MEDIUM;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "reminder_date")
    private LocalDateTime reminderDate;

    @ElementCollection
    @CollectionTable(name = "kanban_card_assignees", joinColumns = @JoinColumn(name = "card_id"))
    @Column(name = "assignee_id")
    private List<Long> assigneeIds = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "kanban_card_labels", joinColumns = @JoinColumn(name = "card_id"))
    @Column(name = "label_id")
    private List<Long> labelIds = new ArrayList<>();

    @Column(name = "attachment_count")
    private int attachmentCount = 0;

    @Column(name = "comment_count")
    private int commentCount = 0;

    @Column(name = "check_item_status")
    private String checkItemStatus;

    @Column(name = "is_archived")
    private boolean archived = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
