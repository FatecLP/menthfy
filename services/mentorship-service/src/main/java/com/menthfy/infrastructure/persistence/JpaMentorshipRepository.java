package com.menthfy.infrastructure.persistence;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.menthfy.domain.models.Mentorship;


@Repository
public interface  JpaMentorshipRepository  extends JpaRepository<Mentorship, Long>{

    List<Mentorship> findByStudentId(Long studentId);

    List<Mentorship> findByTeacherId(Long teacherId);
    
    @Query("""
    SELECT COUNT(m) > 0 FROM Mentorship m
    WHERE m.studentId = :studentId
    AND m.teacherId = :teacherId
    AND m.status = 'PENDING'
    """)
    boolean existsPending(Long studentId, Long teacherId);

    @Query(value = """
    SELECT m.id,
        m.student_id,
        a.nome,
        m.teacher_id,
        m.status
    FROM mentorships m
    JOIN alunos a ON a.id = m.student_id
    WHERE m.teacher_id = :teacherId
    """, nativeQuery = true)
    List<Object[]> findByTeacherWithStudentName(Long teacherId);

    @Query(value = """
    SELECT 
        m.id,
        m.teacher_id,
        p.nome,
        p.foto_url,
        p.disciplina_principal,
        m.status
    FROM mentorships m
    JOIN professores p ON p.id = m.teacher_id
    WHERE m.student_id = :studentId
    """, nativeQuery = true)
List<Object[]> findByStudentWithTeacherData(Long studentId);
}
