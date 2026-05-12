package com.menthfy.application.usecases;


import com.menthfy.domain.models.Mentorship;
import com.menthfy.infrastructure.persistence.JpaMentorshipRepository;
import org.springframework.stereotype.Service;

@Service
public class CreateMentorshipUseCase {
    private final JpaMentorshipRepository repository;

    public CreateMentorshipUseCase(JpaMentorshipRepository repository) {
        this.repository = repository;
    }

    public Mentorship execute(Long studentId, Long teacherId) {

        Mentorship mentorship = Mentorship.builder()
                .studentId(studentId)
                .teacherId(teacherId)
                .status("PENDING")
                .build();

        if(repository.existsPending(studentId, teacherId)){
            throw new RuntimeException("Você já solicitou este professor.");
        }

        return repository.save(mentorship);
    }
}
