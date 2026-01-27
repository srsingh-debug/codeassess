# Job Creation Flow - Hiring Manager & Recruiter Perspective

## 📋 Overview

This document outlines the complete job creation flow from the perspective of Hiring Managers and Recruiters, including all steps, validations, and transitions.

---

## 🎯 Job Creation Workflow

### Phase 1: Job Creation (Draft)

**Actors:** Recruiter, Hiring Manager

#### Step 1.1: Initiate Job Creation
- **Who:** Recruiter or Hiring Manager
- **Action:** Navigate to "Create Job" page
- **Form Fields:**
  - Basic Information (title, description, location)
  - Work Type (employment type, location type)
  - Requirements (skills, experience, education)
  - Compensation (optional at this stage)
  - Application Settings

#### Step 1.2: Fill Job Details
- **Required Fields:**
  - ✅ Title (5-200 characters)
  - ✅ Description (min 100 characters)
  - ✅ Location
  - ✅ Work Location Type (remote/onsite/hybrid)
  - ✅ Employment Type (full-time/part-time/etc.)
  - ✅ At least one required skill
  - ✅ Created By (auto-filled from auth)
  - ✅ Created By Role (auto-filled from auth)

- **Optional Fields:**
  - Short Description
  - Compensation details
  - Application deadline
  - Department, Team, Reporting To
  - Tags
  - Internal Notes

#### Step 1.3: Save as Draft
- **Status:** `draft`
- **Action:** Save job without submitting
- **Allowed Actions:**
  - Edit all fields
  - Delete job
  - Submit for approval
  - Cancel job

---

### Phase 2: Submission for Approval

**Actors:** Recruiter, Hiring Manager

#### Step 2.1: Submit for Approval
- **Who:** Recruiter or Hiring Manager
- **Action:** Click "Submit for Approval"
- **Validations:**
  - ✅ All required fields filled
  - ✅ Description meets minimum length
  - ✅ At least one skill specified
  - ✅ If application deadline set, must be in future
  - ✅ If compensation provided, min < max

#### Step 2.2: Status Change
- **Status:** `draft` → `pending_approval`
- **Approval Status:** `not_required` → `pending`
- **System Action:**
  - Notify Hiring Manager (if submitted by Recruiter)
  - Job appears in Hiring Manager's "Pending Approvals" dashboard

---

### Phase 3: Hiring Manager Review

**Actors:** Hiring Manager

#### Step 3.1: Review Job Posting
- **Who:** Hiring Manager
- **Location:** Hiring Manager Dashboard → Pending Approvals
- **Can View:**
  - All job details
  - Internal notes
  - Application settings
  - Created by information

#### Step 3.2: Decision Point

**Option A: Approve Job**
- **Action:** Click "Approve"
- **Status:** `pending_approval` → `approved`
- **Approval Status:** `pending` → `approved`
- **System Updates:**
  - `approvedBy` = Hiring Manager user ID
  - `approvedAt` = Current timestamp
  - Job appears in Recruiter's "Approved Jobs" list
- **Notification:** Recruiter notified of approval

**Option B: Reject Job**
- **Action:** Click "Reject" + Provide rejection reason
- **Status:** `pending_approval` → `draft`
- **Approval Status:** `pending` → `rejected`
- **System Updates:**
  - `rejectedBy` = Hiring Manager user ID
  - `rejectedAt` = Current timestamp
  - `rejectionReason` = Provided reason
  - Job returns to creator's drafts
- **Notification:** Creator notified with rejection reason

**Option C: Request Changes**
- **Action:** Add comments and reject
- **Status:** `pending_approval` → `draft`
- **Approval Status:** `pending` → `rejected`
- **Comments:** Stored in `approvalStatus.comments`
- **Notification:** Creator notified with feedback

---

### Phase 4: Publishing Job

**Actors:** Recruiter, Admin

#### Step 4.1: Publish Job
- **Who:** Recruiter or Admin
- **Prerequisites:**
  - ✅ Status = `approved`
  - ✅ Approval Status = `approved`
  - ✅ All required fields complete
- **Action:** Click "Publish to Job Board"

#### Step 4.2: Status Change
- **Status:** `approved` → `published`
- **System Updates:**
  - `isActive` = `true`
  - `publishedBy` = User ID
  - `publishedAt` = Current timestamp
  - `publicLink` = Auto-generated slug (if not set)
- **Result:** Job appears on public job board

#### Step 4.3: Job Board Visibility
- **Public URL:** `/jobs/{publicLink}` or `/jobs/{id}`
- **Visible To:** All candidates (authenticated and unauthenticated)
- **Features:**
  - Job details view
  - Apply button
  - Share functionality
  - Save for later (if authenticated)

---

## 🔄 Status Transition Diagram

```
┌─────────┐
│  DRAFT  │ ← Initial creation
└────┬────┘
     │ Submit for Approval
     ↓
┌─────────────────┐
│ PENDING_APPROVAL │ ← Awaiting hiring manager
└────┬────────────┘
     │
     ├─→ APPROVE → ┌──────────┐
     │             │ APPROVED  │ ← Ready to publish
     │             └─────┬─────┘
     │                   │ Publish
     │                   ↓
     │             ┌───────────┐
     │             │ PUBLISHED │ ← Live on job board
     │             └─────┬─────┘
     │                   │
     │                   ├─→ CLOSED (deadline passed/manual)
     │                   └─→ FILLED (candidate hired)
     │
     └─→ REJECT → ┌─────────┐
                  │  DRAFT   │ ← Returned for revision
                  └─────────┘
```

---

## 📝 Form Fields Reference

### Basic Information
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Title | String | Yes | 5-200 chars |
| Description | String | Yes | Min 100 chars |
| Short Description | String | No | Max 500 chars |
| Location | String | Yes | - |
| Work Location Type | Enum | Yes | remote/onsite/hybrid |
| Employment Type | Enum | Yes | full-time/part-time/etc. |

### Requirements
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Skills | Array[String] | Yes | Min 1 item |
| Min Experience | Number | No | Min 0 |
| Max Experience | Number | No | Min 0, > minExperience |
| Education | Array[String] | No | - |
| Certifications | Array[String] | No | - |
| Languages | Array[String] | No | - |
| Visa Sponsorship | Boolean | No | Default: false |

### Compensation (Optional)
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Min | Number | No | - |
| Max | Number | No | > min |
| Currency | String | Yes (if provided) | Default: USD |
| Period | Enum | Yes (if provided) | hourly/monthly/yearly |
| Equity | String | No | - |
| Benefits | Array[String] | No | - |

### Application Settings
| Field | Type | Required | Default |
|-------|------|----------|---------|
| Require Cover Letter | Boolean | No | false |
| Require Portfolio | Boolean | No | false |
| Require References | Boolean | No | false |
| Max Applications | Number | No | - |
| Auto Reject Threshold | Number | No | - |
| Assessment Required | Boolean | No | true |
| Assessment ID | String | No | - |

---

## 🎯 Role-Based Permissions

### Hiring Manager
**Can:**
- ✅ Create jobs
- ✅ Edit own draft jobs
- ✅ Submit jobs for approval (self-approval possible)
- ✅ Approve/reject jobs
- ✅ View all job details including internal notes
- ✅ Close jobs
- ✅ Mark jobs as filled

**Cannot:**
- ❌ Publish jobs (unless also has recruiter role)

### Recruiter
**Can:**
- ✅ Create jobs
- ✅ Edit draft jobs
- ✅ Submit jobs for approval
- ✅ Publish approved jobs
- ✅ View job statistics
- ✅ Manage applications
- ✅ Close jobs

**Cannot:**
- ❌ Approve jobs (unless also has hiring-manager role)
- ❌ View internal notes (unless created by them)

---

## 🔔 Notifications & Events

### Job Created
- **Trigger:** Job saved as draft
- **Recipients:** Creator (if saved as draft)

### Job Submitted for Approval
- **Trigger:** Status changes to `pending_approval`
- **Recipients:** Hiring Manager(s)

### Job Approved
- **Trigger:** Hiring Manager approves
- **Recipients:** Job creator (Recruiter)

### Job Rejected
- **Trigger:** Hiring Manager rejects
- **Recipients:** Job creator
- **Includes:** Rejection reason and comments

### Job Published
- **Trigger:** Job published to job board
- **Recipients:** Job creator, Hiring Manager
- **Public:** Job appears on job board

### Application Deadline Approaching
- **Trigger:** 7 days before deadline
- **Recipients:** Recruiter, Hiring Manager

### Application Deadline Passed
- **Trigger:** Deadline date passed
- **Action:** Auto-close job (optional)
- **Recipients:** Recruiter, Hiring Manager

---

## ✅ Validation Checklist

### Before Submission
- [ ] Title is clear and descriptive (5-200 chars)
- [ ] Description is comprehensive (min 100 chars)
- [ ] Location is specified
- [ ] Work location type selected
- [ ] Employment type selected
- [ ] At least one skill required
- [ ] If compensation provided, min < max
- [ ] If deadline set, it's in the future

### Before Publishing
- [ ] Job is approved by Hiring Manager
- [ ] All required fields complete
- [ ] Public link generated (or provided)
- [ ] Application settings configured
- [ ] Assessment assigned (if required)

---

## 🚀 Next Steps After Job Creation

1. **Job Published** → Candidates can view and apply
2. **Applications Received** → Recruiter reviews
3. **Assessment Assigned** → Candidates take assessment
4. **Interviews Scheduled** → Interviewer evaluates
5. **Hiring Manager Decision** → Final approval
6. **Offer Extended** → HR sends offer
7. **Candidate Accepts** → Background check
8. **Onboarding** → Job marked as "Filled"

---

## 📊 Job Statistics Tracking

Once published, the system tracks:
- **Views Count:** Number of times job was viewed
- **Applications Count:** Number of applications received
- **Conversion Rate:** Applications / Views
- **Time to Fill:** Days from publish to filled
- **Source Analytics:** Where candidates found the job

---

This flow ensures proper approval workflow while maintaining flexibility for different organizational structures.

