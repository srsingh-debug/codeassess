import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { applicationApi, jobApi } from "../services/api";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  FileText,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Upload,
  Building,
  MapPin,
  Clock,
} from "lucide-react";
import { JobPost } from "../types";
import useApplyJobHook from "../hooks/candidate/useApplyJobHook";

// Mock job data
// const mockJobPosts: JobPost[] = [
//   {
//     id: '1',
//     title: 'Frontend Developer',
//     description: 'We are looking for a skilled Frontend Developer with experience in React, TypeScript, and modern web technologies to join our team.',
//     location: 'San Francisco, CA',
//     requiredSkills: ['React', 'TypeScript', 'JavaScript', 'CSS'],
//     experience: '2+ years',
//     applicationDeadline: new Date('2025-02-15'),
//     createdAt: new Date('2025-01-01'),
//     updatedAt: new Date('2025-01-01'),
//     status: 'published',
//     publicLink: '/job/frontend-dev-2025'
//   },
//   {
//     id: '2',
//     title: 'Backend Engineer',
//     description: 'Join our backend team to build scalable APIs and microservices using Python and Django.',
//     location: 'Remote',
//     requiredSkills: ['Python', 'Django', 'REST API', 'PostgreSQL'],
//     experience: '3+ years',
//     applicationDeadline: new Date('2025-02-28'),
//     createdAt: new Date('2025-01-05'),
//     updatedAt: new Date('2025-01-05'),
//     status: 'published',
//     publicLink: '/job/backend-eng-2025'
//   }
// ];

// Mock pre-screening questions
const preScreeningQuestions = [
  {
    id: "1",
    question: "How many years have you worked with React?",
    type: "multiple-choice",
    options: [
      "Less than 1 year",
      "1-2 years",
      "2-4 years",
      "More than 4 years",
    ],
  },
  {
    id: "2",
    question: "Why are you interested in this role?",
    type: "text",
  },
  {
    id: "3",
    question: "What is your expected salary range?",
    type: "text",
  },
  {
    id: "4",
    question: "Are you eligible to work in the United States?",
    type: "multiple-choice",
    options: ["Yes", "No", "Will require sponsorship"],
  },
];

interface ApplyJobPageProps {
  onNavigate: (view: string) => void;
}

export const ApplyJobPage: React.FC<ApplyJobPageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { id: jobId } = useParams<{ id: string }>();
  console.log({ jobId });
  const [job, setJob] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("job id blaa", jobId);
    if (jobId) {
      fetchDetails();
    }
  }, [jobId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await jobApi.getById(jobId);

      const mappedJob: JobPost = {
        id: res.data._id,
        title: res.data.title,
        description: res.data.description,
        location: res.data.location,
        requiredSkills: res.data.requirements?.skills || [],
        experience: res.data.requirements?.minExperience
          ? `${res.data.requirements.minExperience}+ years`
          : "Not specified",
        compensation:
          res.data.compensation?.min && res.data.compensation?.max
            ? `${res.data.compensation.currency} ${res.data.compensation.min.toLocaleString()} - ${res.data.compensation.max.toLocaleString()} / ${res.data.compensation.period}`
            : "Competitive Salary",
        jobType: res.data.employmentType
          ? res.data.employmentType.charAt(0).toUpperCase() +
            res.data.employmentType.slice(1)
          : "Not specified",
        education: res.data.education
          ? res.data.education.charAt(0).toUpperCase() +
            res.data.education.slice(1)
          : "Not specified",
        applicationDeadline: new Date(res.data.applicationDeadline),
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
        status: res.data.status,
        publicLink: `/job/${res.data._id}`,
      };

      setJob(mappedJob);
    } catch (err) {
      setError("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };
  // useApplyJobHook({jobId});

  // Find the job by ID or default to first job
  //const job = mockJobPosts.find(j => j.id === jobId) || mockJobPosts[0];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    resume: null as File | null,
  });

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate required questions
    preScreeningQuestions.forEach((question) => {
      if (question.type === "text" && !answers[question.id]?.trim()) {
        newErrors[`question-${question.id}`] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("submit application button clicked");
    e.preventDefault();

    if (!validateForm() || !jobId) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Map frontend data to backend interface
      const applicationData = {
        jobId: jobId,
        candidateName: formData.name,
        candidateEmail: formData.email,
        candidatePhone: formData.phone || undefined,
        linkedinUrl: formData.linkedin || undefined,
        githubUrl: formData.github || undefined,
        resumeUrl: "https://example.com/mock-resume.pdf", 
        roleInterest: answers["2"] || "Not provided",
        expectedSalaryRange: answers["3"] || "Not specified",
        preScreeningAnswers: answers,
      };

      await applicationApi.apply(jobId, applicationData);

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Failed to submit application:", err);
      setError("Failed to submit application. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/job/${job.id}`);
  };

  // ⬇️ PLACE THIS BEFORE `if (isSubmitted)`

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600">{error || "Job not found"}</p>
        <Button onClick={() => navigate("/jobs")} className="mt-4">
          Back to Jobs
        </Button>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="text-center py-12 md:py-16">
            <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-2 text-base md:text-lg max-w-2xl mx-auto">
              Thank you for applying for the{" "}
              <span className="font-semibold">{job.title}</span> position at our
              company.
            </p>
            <p className="text-gray-600 mb-8 text-base md:text-lg max-w-2xl mx-auto">
              We'll review your application and get back to you soon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/jobs")}
                size="lg"
                className="rounded-xl px-6 py-3 md:px-8 md:py-3"
              >
                Browse More Jobs
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                size="lg"
                className="rounded-xl px-6 py-3 md:px-8 md:py-3"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          icon={ArrowLeft}
          onClick={handleBack}
          className="rounded-xl"
        >
          Back to Job Details
        </Button>
      </div>

      {/* Job Header */}
      <Card className="rounded-2xl shadow-lg mb-8">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 flex-shrink-0 flex items-center justify-center rounded-xl md:w-24">
              <div className="bg-white w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center shadow-sm">
                <Building className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Apply for {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm md:text-base">{job.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm md:text-base">
                    {job.experience} experience
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-600 mt-4 text-sm md:text-base">
            Please fill out the form below to apply for this position. All
            fields marked with * are required.
          </p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        {/* Personal Information */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader className="pb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-3" />
              Personal Information
            </h2>
            <p className="text-gray-600 text-xs md:text-sm mt-1">
              Provide your basic contact information
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`rounded-xl py-2 md:py-3 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className={`rounded-xl py-2 md:py-3 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="rounded-xl py-2 md:py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <Input
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/username"
                  className="rounded-xl py-2 md:py-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Profile
              </label>
              <Input
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                placeholder="https://github.com/username"
                className="rounded-xl py-2 md:py-3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Resume Upload */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader className="pb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-3" />
              Resume
            </h2>
            <p className="text-gray-600 text-xs md:text-sm mt-1">
              Upload your resume in PDF, DOC, or DOCX format
            </p>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 md:p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                Drag and drop your resume here, or click to browse
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm md:text-base"
              >
                <Upload className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Choose File
              </label>
              {formData.resume && (
                <p className="mt-4 text-sm text-gray-600">
                  Selected:{" "}
                  <span className="font-medium">{formData.resume.name}</span>
                </p>
              )}
              <p className="mt-3 text-xs text-gray-500">
                Supported formats: PDF, DOC, DOCX (Max file size: 5MB)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pre-screening Questions */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader className="pb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              Pre-screening Questions
            </h2>
            <p className="text-gray-600 text-xs md:text-sm mt-1">
              Please answer the following questions to help us understand your
              fit for this role
            </p>
          </CardHeader>
          <CardContent className="space-y-6 md:space-y-8">
            {preScreeningQuestions.map((question) => (
              <div
                key={question.id}
                className="border-b border-gray-100 pb-6 md:pb-8 last:border-b-0 last:pb-0"
              >
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {question.question}{" "}
                  {question.type === "text" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                {question.type === "multiple-choice" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {question.options?.map((option, index) => (
                      <div
                        key={index}
                        className={`border rounded-xl p-3 md:p-4 cursor-pointer transition-all ${
                          answers[question.id] === option
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleAnswerChange(question.id, option)}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id={`${question.id}-${index}`}
                            name={`question-${question.id}`}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={() =>
                              handleAnswerChange(question.id, option)
                            }
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`${question.id}-${index}`}
                            className="ml-3 block text-sm text-gray-700 cursor-pointer"
                          >
                            {option}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <Textarea
                      value={answers[question.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      rows={4}
                      placeholder="Your answer..."
                      className={`rounded-xl ${errors[`question-${question.id}`] ? "border-red-500" : ""}`}
                    />
                    {errors[`question-${question.id}`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`question-${question.id}`]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 rounded-2xl p-4 md:p-6">
          <div className="flex items-center text-sm text-gray-600">
            <AlertCircle className="w-4 h-4 mr-2" />
            All fields marked with * are required
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleBack}
              type="button"
              className="rounded-xl px-4 py-2 md:px-6 md:py-3"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              size="lg"
              className="rounded-xl px-6 py-2 md:px-8 md:py-3"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
