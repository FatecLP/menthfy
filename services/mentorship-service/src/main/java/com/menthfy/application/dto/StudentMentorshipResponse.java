package com.menthfy.application.dto;

public record StudentMentorshipResponse(
    Long id,
    Long teacherId,
    String teacherName,
    String teacherPhoto,
    String disciplina,
    String status
) {}