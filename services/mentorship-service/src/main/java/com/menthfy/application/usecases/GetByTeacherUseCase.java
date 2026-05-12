package com.menthfy.application.usecases;

import com.menthfy.application.dto.MentorshipResponse;
import com.menthfy.infrastructure.persistence.JpaMentorshipRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class GetByTeacherUseCase {
    private final JpaMentorshipRepository repository;

    public GetByTeacherUseCase(JpaMentorshipRepository repository) {
        this.repository = repository;
    }

    public List<MentorshipResponse> execute(Long teacherId) {
        return repository.findByTeacherWithStudentName(teacherId)
                .stream()
                .map(r -> new MentorshipResponse(
                    ((Number) r[0]).longValue(),
                    ((Number) r[1]).longValue(),
                    (String) r[2],
                    ((Number) r[3]).longValue(),
                    r[4].toString()
                ))
                .toList();    
    }
}
