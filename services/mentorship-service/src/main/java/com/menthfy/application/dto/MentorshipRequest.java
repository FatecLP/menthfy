package com.menthfy.application.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MentorshipRequest {
    private Long studentId;
    private Long teacherId;
}
