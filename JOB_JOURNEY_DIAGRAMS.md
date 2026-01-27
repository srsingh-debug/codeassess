# Job Journey Visual Diagrams

> **📖 How to View These Diagrams:**
> 
> **Option 1: VS Code** - Install the "Markdown Preview Mermaid Support" extension
> - Open Command Palette (Cmd/Ctrl + Shift + P)
> - Type "Markdown: Open Preview"
> - Diagrams will render automatically
> 
> **Option 2: GitHub/GitLab** - Diagrams render automatically when viewing on GitHub/GitLab
> 
> **Option 3: Online Viewer** - Copy Mermaid code and paste at [mermaid.live](https://mermaid.live)
> 
> **Option 4: Browser Extension** - Install "Markdown Viewer" extension for Chrome/Firefox

---

## Complete Job Lifecycle - Swimlane Diagram

This diagram shows how each role interacts throughout the job lifecycle.

```mermaid
graph TB
    subgraph "Phase 1: Job Creation"
        A1[Recruiter/Hiring Manager<br/>Creates Job] --> A2{Job Validation}
        A2 -->|Pass| A3[Hiring Manager<br/>Approves]
        A3 --> A4[Recruiter<br/>Publishes]
        A2 -->|Fail| A1
    end
    
    subgraph "Phase 2: Candidate Discovery"
        B1[Job on Job Board] --> B2[Candidate Views Job]
        B2 --> B3{Candidate Decision}
        B3 -->|Apply| B4[Submit Application]
        B3 -->|Skip| B1
    end
    
    subgraph "Phase 3: Application Processing"
        C1[Application Received] --> C2[Auto Pre-Screening]
        C2 -->|Pass| C3[Recruiter/Admin<br/>Assigns Assessment]
        C2 -->|Fail| C4[Auto-Reject]
        C3 --> C5[System Sends<br/>Assessment Link]
    end
    
    subgraph "Phase 4: Assessment"
        D1[Candidate Takes<br/>Assessment] --> D2[System Auto-Grades]
        D2 --> D3{Score Check}
        D3 -->|>=70%| D4[Recruiter/HR<br/>Reviews]
        D3 -->|<70%| D5[Auto-Reject]
        D4 -->|Approve| D6[Shortlist Candidate]
        D4 -->|Reject| D5
    end
    
    subgraph "Phase 5: Interview"
        E1[Recruiter/HR<br/>Schedules Interview] --> E2[Interviewer<br/>Conducts Interview]
        E2 --> E3[Interviewer<br/>Evaluates]
        E3 --> E4{Evaluation<br/>Check}
        E4 -->|Pass| E5[Send to Hiring<br/>Manager]
        E4 -->|Fail| E6[Reject]
    end
    
    subgraph "Phase 6: Decision"
        F1[Hiring Manager<br/>Reviews All Data] --> F2{Final Decision}
        F2 -->|Approve| F3[HR Makes Offer]
        F2 -->|Reject| F4[Reject Candidate]
        F3 --> F5{Candidate<br/>Response}
        F5 -->|Accept| F6[Background Check]
        F5 -->|Reject| F7[Close Position]
    end
    
    subgraph "Phase 7: Onboarding"
        G1[Background Check] --> G2{Background<br/>Pass?}
        G2 -->|Pass| G3[HR/Admin<br/>Onboarding]
        G2 -->|Fail| G4[Revoke Offer]
        G3 --> G5[Hired]
    end
    
    A4 --> B1
    B4 --> C1
    C5 --> D1
    D6 --> E1
    E5 --> F1
    F6 --> G1
    
    style A2 fill:#fff9c4
    style C2 fill:#fff9c4
    style D3 fill:#fff9c4
    style E4 fill:#fff9c4
    style F2 fill:#fff9c4
    style F5 fill:#fff9c4
    style G2 fill:#fff9c4
```

---

## Role-Based Swimlane Diagram

```mermaid
graph LR
    subgraph Admin["👤 Admin"]
        A1[Setup System] --> A2[Monitor Process]
        A2 --> A3[Assign Assessments]
        A3 --> A4[Review Results]
    end
    
    subgraph Recruiter["👤 Recruiter"]
        R1[Create Job] --> R2[Publish Job]
        R2 --> R3[Review Applications]
        R3 --> R4[Assign Assessment]
        R4 --> R5[Schedule Interview]
        R5 --> R6[Recommend Candidate]
    end
    
    subgraph HR["👤 HR"]
        H1[Screen Applications] --> H2[Review Assessments]
        H2 --> H3[Coordinate Interview]
        H3 --> H4[Verify Background]
        H4 --> H5[Process Onboarding]
    end
    
    subgraph Interviewer["👤 Interviewer"]
        I1[Receive Interview] --> I2[Conduct Interview]
        I2 --> I3[Evaluate Candidate]
        I3 --> I4[Submit Evaluation]
    end
    
    subgraph HiringManager["👤 Hiring Manager"]
        HM1[Approve Job] --> HM2[Review Candidates]
        HM2 --> HM3[Make Final Decision]
    end
    
    subgraph Candidate["👤 Candidate"]
        C1[View Job] --> C2[Apply]
        C2 --> C3[Take Assessment]
        C3 --> C4[Attend Interview]
        C4 --> C5[Respond to Offer]
    end
    
    R1 -.->|Approval| HM1
    R2 --> C1
    C2 --> H1
    A3 --> C3
    C3 --> H2
    R5 --> I1
    I4 --> HM2
    HM3 --> C5
    C5 --> H4
```

---

## Decision Tree - Complete Flow

```mermaid
flowchart TD
    Start([Job Lifecycle Start]) --> JobCreate[Create Job Posting]
    
    JobCreate --> JobValid{Job Valid?}
    JobValid -->|No| JobCreate
    JobValid -->|Yes| JobPublish[Publish Job]
    
    JobPublish --> CandidateApplies{Candidate<br/>Applies?}
    CandidateApplies -->|No| JobPublish
    CandidateApplies -->|Yes| AppValidation{Application<br/>Valid?}
    
    AppValidation -->|No| RequestInfo[Request Info]
    RequestInfo --> CandidateApplies
    AppValidation -->|Yes| PreScreen{Auto Pre-Screen<br/>Pass?}
    
    PreScreen -->|No| Reject1[Reject Application]
    PreScreen -->|Yes| AssignAssess[Assign Assessment]
    
    AssignAssess --> CandidateTakes{Candidate<br/>Takes Assessment?}
    CandidateTakes -->|No| Remind[Send Reminder]
    Remind --> CandidateTakes
    CandidateTakes -->|Yes| GradeAssess{Score >= 70%?}
    
    GradeAssess -->|No| Reject2[Reject - Low Score]
    GradeAssess -->|Yes| ReviewAssess{Review<br/>Approved?}
    
    ReviewAssess -->|No| Reject3[Reject After Review]
    ReviewAssess -->|Yes| ScheduleInt[Schedule Interview]
    
    ScheduleInt --> InterviewDone{Interview<br/>Completed?}
    InterviewDone -->|No| Reschedule[Reschedule]
    Reschedule --> InterviewDone
    InterviewDone -->|Yes| EvalCheck{Rating >= 3.5?}
    
    EvalCheck -->|No| Reject4[Reject After Interview]
    EvalCheck -->|Yes| HiringMgrReview{Hiring Manager<br/>Approves?}
    
    HiringMgrReview -->|No| Reject5[Final Rejection]
    HiringMgrReview -->|Yes| MakeOffer[Make Offer]
    
    MakeOffer --> OfferResponse{Candidate<br/>Accepts?}
    OfferResponse -->|No| ClosePosition[Close Position]
    OfferResponse -->|Yes| BackgroundCheck{Background<br/>Check Pass?}
    
    BackgroundCheck -->|No| RevokeOffer[Revoke Offer]
    BackgroundCheck -->|Yes| Onboard[Onboard Candidate]
    
    Onboard --> End([Hired - Process Complete])
    
    Reject1 --> End
    Reject2 --> End
    Reject3 --> End
    Reject4 --> End
    Reject5 --> End
    ClosePosition --> End
    RevokeOffer --> End
    
    style JobValid fill:#fff9c4
    style AppValidation fill:#fff9c4
    style PreScreen fill:#fff9c4
    style GradeAssess fill:#fff9c4
    style ReviewAssess fill:#fff9c4
    style EvalCheck fill:#fff9c4
    style HiringMgrReview fill:#fff9c4
    style OfferResponse fill:#fff9c4
    style BackgroundCheck fill:#fff9c4
```

---

## Checkpoint Validation Flow

```mermaid
graph TB
    subgraph "Checkpoint 1: Job Creation"
        CP1[Job Created] --> V1{Validate Fields}
        V1 -->|Missing| E1[Error: Missing Fields]
        V1 -->|Complete| V2{Validate Budget}
        V2 -->|Over Budget| E2[Error: Budget Exceeded]
        V2 -->|Within Budget| V3{Validate Approval}
        V3 -->|Not Approved| E3[Error: Not Approved]
        V3 -->|Approved| P1[✅ Pass Checkpoint 1]
    end
    
    subgraph "Checkpoint 2: Application"
        CP2[Application Submitted] --> V4{Validate Required Fields}
        V4 -->|Missing| E4[Error: Incomplete Application]
        V4 -->|Complete| V5{Validate File Uploads}
        V5 -->|Invalid Format| E5[Error: Invalid File Format]
        V5 -->|Valid| V6{Validate Email/Phone}
        V6 -->|Invalid| E6[Error: Invalid Contact Info]
        V6 -->|Valid| P2[✅ Pass Checkpoint 2]
    end
    
    subgraph "Checkpoint 3: Pre-Screening"
        CP3[Pre-Screening] --> V7{Skill Match >= 60%?}
        V7 -->|No| E7[❌ Fail: Low Skill Match]
        V7 -->|Yes| V8{Experience Match?}
        V8 -->|No| E8[❌ Fail: Experience Mismatch]
        V8 -->|Yes| V9{Pre-Screen Answers OK?}
        V9 -->|No| E9[❌ Fail: Poor Answers]
        V9 -->|Yes| P3[✅ Pass Checkpoint 3]
    end
    
    subgraph "Checkpoint 4: Assessment"
        CP4[Assessment Submitted] --> V10{Score >= 70%?}
        V10 -->|No| E10[❌ Fail: Low Score]
        V10 -->|Yes| V11{Plagiarism Check}
        V11 -->|Detected| E11[❌ Fail: Plagiarism]
        V11 -->|Clean| V12{Time Limit OK?}
        V12 -->|Exceeded| E12[❌ Fail: Time Exceeded]
        V12 -->|OK| P4[✅ Pass Checkpoint 4]
    end
    
    subgraph "Checkpoint 5: Interview"
        CP5[Interview Completed] --> V13{Rating >= 3.5?}
        V13 -->|No| E13[❌ Fail: Low Rating]
        V13 -->|Yes| V14{All Evaluations Complete?}
        V14 -->|No| E14[Error: Incomplete Evaluation]
        V14 -->|Yes| V15{Consensus Reached?}
        V15 -->|No| E15[Error: No Consensus]
        V15 -->|Yes| P5[✅ Pass Checkpoint 5]
    end
    
    subgraph "Checkpoint 6: Final Decision"
        CP6[Hiring Manager Review] --> V16{All Data Reviewed?}
        V16 -->|No| E16[Error: Incomplete Review]
        V16 -->|Yes| V17{Budget Available?}
        V17 -->|No| E17[Error: Budget Exceeded]
        V17 -->|Yes| V18{Team Fit OK?}
        V18 -->|No| E18[❌ Fail: Poor Team Fit]
        V18 -->|Yes| P6[✅ Pass Checkpoint 6]
    end
    
    subgraph "Checkpoint 7: Offer"
        CP7[Offer Extended] --> V19{Offer Within Budget?}
        V19 -->|No| E19[Error: Offer Exceeds Budget]
        V19 -->|Yes| V20{Candidate Accepts?}
        V20 -->|No| E20[❌ Offer Rejected]
        V20 -->|Yes| P7[✅ Pass Checkpoint 7]
    end
    
    subgraph "Checkpoint 8: Background"
        CP8[Background Check] --> V21{Employment Verified?}
        V21 -->|No| E21[❌ Fail: Employment Issue]
        V21 -->|Yes| V22{Education Verified?}
        V22 -->|No| E22[❌ Fail: Education Issue]
        V22 -->|Yes| V23{References Positive?}
        V23 -->|No| E23[❌ Fail: Poor References]
        V23 -->|Yes| P8[✅ Pass Checkpoint 8]
    end
    
    P1 --> CP2
    P2 --> CP3
    P3 --> CP4
    P4 --> CP5
    P5 --> CP6
    P6 --> CP7
    P7 --> CP8
    P8 --> Success[🎉 Hired]
    
    style V1 fill:#fff9c4
    style V2 fill:#fff9c4
    style V3 fill:#fff9c4
    style V4 fill:#fff9c4
    style V5 fill:#fff9c4
    style V6 fill:#fff9c4
    style V7 fill:#fff9c4
    style V8 fill:#fff9c4
    style V9 fill:#fff9c4
    style V10 fill:#fff9c4
    style V11 fill:#fff9c4
    style V12 fill:#fff9c4
    style V13 fill:#fff9c4
    style V14 fill:#fff9c4
    style V15 fill:#fff9c4
    style V16 fill:#fff9c4
    style V17 fill:#fff9c4
    style V18 fill:#fff9c4
    style V19 fill:#fff9c4
    style V20 fill:#fff9c4
    style V21 fill:#fff9c4
    style V22 fill:#fff9c4
    style V23 fill:#fff9c4
```

---

## Timeline View - Job Lifecycle

```mermaid
gantt
    title Job Lifecycle Timeline
    dateFormat YYYY-MM-DD
    section Job Setup
    Job Creation           :a1, 2024-01-01, 2d
    Job Approval           :a2, after a1, 1d
    Job Publishing         :a3, after a2, 1d
    
    section Application
    Job Posted             :b1, after a3, 7d
    Applications Received  :b2, after b1, 14d
    Pre-Screening          :b3, after b2, 2d
    
    section Assessment
    Assessment Assigned    :c1, after b3, 1d
    Assessment Period      :c2, after c1, 7d
    Assessment Review     :c3, after c2, 3d
    
    section Interview
    Interview Scheduling   :d1, after c3, 2d
    Interview Period       :d2, after d1, 7d
    Interview Evaluation  :d3, after d2, 2d
    
    section Decision
    Hiring Manager Review  :e1, after d3, 3d
    Offer Creation         :e2, after e1, 1d
    Offer Response         :e3, after e2, 5d
    
    section Onboarding
    Background Check       :f1, after e3, 5d
    Onboarding Process     :f2, after f1, 7d
```

---

## Status Transition Diagram

```mermaid
stateDiagram-v2
    [*] --> Draft: Job Created
    
    Draft --> PendingApproval: Submit
    PendingApproval --> Published: Approved
    PendingApproval --> Draft: Rejected
    
    Published --> ApplicationReceived: Candidate Applies
    ApplicationReceived --> PreScreening: Validated
    PreScreening --> Rejected: Failed
    PreScreening --> AssessmentAssigned: Passed
    
    AssessmentAssigned --> AssessmentInProgress: Started
    AssessmentInProgress --> AssessmentCompleted: Submitted
    AssessmentCompleted --> AssessmentReviewed: Graded
    
    AssessmentReviewed --> Rejected: Low Score
    AssessmentReviewed --> Shortlisted: Passed
    
    Shortlisted --> InterviewScheduled: Scheduled
    InterviewScheduled --> InterviewCompleted: Done
    InterviewCompleted --> InterviewEvaluated: Evaluated
    
    InterviewEvaluated --> Rejected: Failed
    InterviewEvaluated --> PendingDecision: Passed
    
    PendingDecision --> OfferExtended: Approved
    PendingDecision --> Rejected: Rejected
    
    OfferExtended --> OfferAccepted: Accepted
    OfferExtended --> OfferRejected: Rejected
    
    OfferAccepted --> BackgroundCheck: Verification
    BackgroundCheck --> Onboarding: Passed
    BackgroundCheck --> OfferRevoked: Failed
    
    Onboarding --> Hired: Complete
    Hired --> [*]
    Rejected --> [*]
    OfferRejected --> [*]
    OfferRevoked --> [*]
```

---

## Role Interaction Matrix

| Phase | Admin | Recruiter | HR | Interviewer | Hiring Manager | Candidate |
|-------|:-----:|:---------:|:--:|:-----------:|:--------------:|:---------:|
| **1. Job Creation** | Setup | Create | - | - | Approve | - |
| **2. Job Posting** | Publish | Manage | - | - | - | View |
| **3. Application** | Monitor | Review | Screen | - | - | Submit |
| **4. Assessment** | Assign | Assign | Review | - | - | Take |
| **5. Interview** | Schedule | Schedule | Coordinate | Conduct | - | Attend |
| **6. Decision** | Support | Recommend | Verify | Evaluate | Decide | Respond |
| **7. Onboarding** | Setup | - | Process | - | Welcome | Complete |

---

## Key Validation Rules

### **Checkpoint 1: Job Creation**
- ✅ All required fields present
- ✅ Job description length >= 100 characters
- ✅ Required skills defined (min 3)
- ✅ Budget within approved limits
- ✅ Hiring Manager approval received

### **Checkpoint 2: Application**
- ✅ Email format valid
- ✅ Phone format valid (if provided)
- ✅ Resume uploaded (PDF/DOC, max 5MB)
- ✅ All pre-screening questions answered
- ✅ No duplicate application

### **Checkpoint 3: Pre-Screening**
- ✅ Skill match >= 60%
- ✅ Experience level matches minimum
- ✅ Location compatible (if required)
- ✅ Pre-screening answers meet criteria

### **Checkpoint 4: Assessment**
- ✅ Assessment completed within time limit
- ✅ Score >= 70%
- ✅ No plagiarism detected
- ✅ All questions attempted
- ✅ Code compiles and runs

### **Checkpoint 5: Interview**
- ✅ Interview conducted
- ✅ Evaluation form completed
- ✅ Overall rating >= 3.5/5
- ✅ All required fields filled
- ✅ Consensus reached (if multiple interviewers)

### **Checkpoint 6: Final Decision**
- ✅ All candidate data reviewed
- ✅ Budget available
- ✅ Team fit assessed
- ✅ Hiring Manager approval

### **Checkpoint 7: Offer**
- ✅ Offer within budget
- ✅ All terms defined
- ✅ Legal compliance verified
- ✅ Candidate accepts offer

### **Checkpoint 8: Background Check**
- ✅ Employment history verified
- ✅ Education verified
- ✅ References checked
- ✅ No red flags found

---

**Last Updated:** December 2024  
**Version:** 1.0

