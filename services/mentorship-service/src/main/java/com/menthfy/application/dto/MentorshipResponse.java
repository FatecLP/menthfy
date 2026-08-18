package com.menthfy.application.dto;

public class MentorshipResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long teacherId;
    private String status;

        public MentorshipResponse(Long id, Long studentId, String studentName, Long teacherId, String status) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.teacherId = teacherId;
        this.status = status;
    }

    public Long getId() { return id; }
    public Long getStudentId() { return studentId; }
    public String getStudentName() { return studentName; }
    public Long getTeacherId() { return teacherId; }
    public String getStatus() { return status; }
}
