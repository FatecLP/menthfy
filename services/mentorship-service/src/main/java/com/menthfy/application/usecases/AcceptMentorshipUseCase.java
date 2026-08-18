package com.menthfy.application.usecases;

import com.menthfy.domain.models.Mentorship;
import com.menthfy.infrastructure.persistence.JpaMentorshipRepository;
import org.springframework.stereotype.Service;

@Service
public class AcceptMentorshipUseCase {
    private final JpaMentorshipRepository repository;

    public AcceptMentorshipUseCase(JpaMentorshipRepository repository) {
        this.repository = repository;
    }

    public Mentorship execute(Long id) {

        Mentorship mentorship = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mentoria não encontrada"));

        mentorship.setStatus("ACCEPTED");

        return repository.save(mentorship);
    }
}
