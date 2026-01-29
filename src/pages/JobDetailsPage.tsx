// import React, { useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Card, CardHeader, CardContent } from "../components/ui/Card";
// import { Button } from "../components/ui/Button";
// import { Badge } from "../components/ui/Badge";
// import { jobApi } from "../services/api";
// import { useState } from "react";
// import {
//   MapPin,
//   Clock,
//   Calendar,
//   Users,
//   ArrowLeft,
//   FileText,
//   Link as LinkIcon,
//   Building,
//   DollarSign,
//   Briefcase,
//   GraduationCap,
//   CheckCircle,
//   AlertCircle,
// } from "lucide-react";
// import { JobPost } from "../types";

// // Mock job data
// const mockJobPosts: JobPost[] = [
//   {
//     id: "1",
//     title: "Frontend Developer",
//     description:
//       "We are looking for a skilled Frontend Developer with experience in React, TypeScript, and modern web technologies to join our team. You will be responsible for building user interfaces and implementing design systems.",
//     location: "San Francisco, CA",
//     requiredSkills: [
//       "React",
//       "TypeScript",
//       "JavaScript",
//       "CSS",
//       "HTML",
//       "Redux",
//     ],
//     experience: "2+ years",
//     applicationDeadline: new Date("2025-02-15"),
//     createdAt: new Date("2025-01-01"),
//     updatedAt: new Date("2025-01-01"),
//     status: "published",
//     publicLink: "/job/frontend-dev-2025",
//   },
//   {
//     id: "2",
//     title: "Backend Engineer",
//     description:
//       "Join our backend team to build scalable APIs and microservices using Python and Django. You will work on designing and implementing robust backend systems that power our applications.",
//     location: "Remote",
//     requiredSkills: [
//       "Python",
//       "Django",
//       "REST API",
//       "PostgreSQL",
//       "Redis",
//       "Docker",
//     ],
//     experience: "3+ years",
//     applicationDeadline: new Date("2025-02-28"),
//     createdAt: new Date("2025-01-05"),
//     updatedAt: new Date("2025-01-05"),
//     status: "published",
//     publicLink: "/job/backend-eng-2025",
//   },
//   {
//     id: "3",
//     title: "Full Stack Developer",
//     description:
//       "Looking for a versatile developer to work on both frontend and backend of our web applications. You should be comfortable working with modern JavaScript frameworks and backend technologies.",
//     location: "New York, NY",
//     requiredSkills: [
//       "React",
//       "Node.js",
//       "MongoDB",
//       "Express",
//       "JavaScript",
//       "HTML/CSS",
//     ],
//     experience: "4+ years",
//     applicationDeadline: new Date("2025-03-10"),
//     createdAt: new Date("2025-01-10"),
//     updatedAt: new Date("2025-01-10"),
//     status: "published",
//     publicLink: "/job/fullstack-dev-2025",
//   },
// ];

// // interface JobDetailsPageProps {
// //   onNavigate: (view: string) => void;
// // }

// export const JobDetailsPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { jobId } = useParams<{ jobId: string }>();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Find the job by ID or default to first job
//   //const job = mockJobPosts.find((j) => j.id === jobId) || mockJobPosts[0];

//   useEffect(() => {
//     fetchDetails();
//   }, [jobId]);

//   const fetchDetails = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await jobApi.getJobById(jobId);
//       setJob(res.data);
//     } catch (error) {
//       console.error("Error fetching job details:", error);
//     }
//   };

//   if (res.success) {
//     job = res.data;
//   }

//   const handleApply = () => {
//     navigate(`/apply/${jobId}`);
//   };

//   const handleBack = () => {
//     navigate("/jobs");
//   };

//   // Calculate days until deadline
//   const daysUntilDeadline = Math.ceil(
//     (job.applicationDeadline.getTime() - new Date().getTime()) /
//       (1000 * 60 * 60 * 24),
//   );

//   const getDeadlineStatus = () => {
//     if (daysUntilDeadline < 0) return { text: "Closed", variant: "danger" };
//     if (daysUntilDeadline < 3)
//       return { text: "Closing Soon", variant: "warning" };
//     if (daysUntilDeadline < 7)
//       return { text: "Closing Soon", variant: "warning" };
//     return { text: "Open", variant: "success" };
//   };

//   const deadlineStatus = getDeadlineStatus();

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Header with Back Button */}
//       <div className="flex items-center space-x-4 mb-6">
//         <Button
//           variant="ghost"
//           icon={ArrowLeft}
//           onClick={handleBack}
//           className="rounded-xl"
//         >
//           Back to Jobs
//         </Button>
//       </div>

//       {/* Job Header Card */}
//       <Card className="rounded-2xl shadow-lg mb-8">
//         <CardContent className="p-4 md:p-6">
//           <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
//             <div className="flex-1">
//               <div className="flex flex-col md:flex-row md:items-start gap-6">
//                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 flex-shrink-0 flex items-center justify-center rounded-xl md:w-24">
//                   <div className="bg-white w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center shadow-sm">
//                     <Building className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
//                   </div>
//                 </div>
//                 <div>
//                   <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
//                     {job.title}
//                   </h1>
//                   <div className="flex flex-wrap items-center gap-3 md:gap-4 text-gray-600 mb-4">
//                     <div className="flex items-center space-x-1">
//                       <MapPin className="w-4 h-4" />
//                       <span className="text-sm md:text-base">
//                         {job.location}
//                       </span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <Clock className="w-4 h-4" />
//                       <span className="text-sm md:text-base">
//                         {job.experience} experience
//                       </span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <Calendar className="w-4 h-4" />
//                       <span className="text-sm md:text-base">
//                         Apply by {job.applicationDeadline.toLocaleDateString()}
//                       </span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <AlertCircle className="w-4 h-4" />
//                       <Badge
//                         variant={deadlineStatus.variant}
//                         className="rounded-full px-2.5 py-1 text-xs font-medium"
//                       >
//                         {deadlineStatus.text}
//                       </Badge>
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-2 mt-4">
//                     {job.requiredSkills.map((skill, index) => (
//                       <Badge
//                         key={index}
//                         variant="info"
//                         className="rounded-full px-2.5 py-1 text-xs"
//                       >
//                         {skill}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col items-start md:items-end space-y-3">
//               <Button
//                 icon={FileText}
//                 onClick={handleApply}
//                 size="lg"
//                 className="rounded-xl px-4 py-2 md:px-6 md:py-3 text-sm md:text-base"
//               >
//                 Apply for this Position
//               </Button>
//               <div className="text-xs md:text-sm text-gray-500">
//                 Posted {job.createdAt.toLocaleDateString()}
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Job Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
//         <Card className="rounded-2xl">
//           <CardContent className="p-4 md:p-6">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="bg-blue-100 p-2 rounded-lg">
//                 <Briefcase className="w-5 h-5 text-blue-600" />
//               </div>
//               <h3 className="text-base md:text-lg font-semibold text-gray-900">
//                 Job Type
//               </h3>
//             </div>
//             <p className="text-gray-600 text-sm md:text-base">
//               Full-time Position
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="rounded-2xl">
//           <CardContent className="p-4 md:p-6">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="bg-green-100 p-2 rounded-lg">
//                 <DollarSign className="w-5 h-5 text-green-600" />
//               </div>
//               <h3 className="text-base md:text-lg font-semibold text-gray-900">
//                 Compensation
//               </h3>
//             </div>
//             <p className="text-gray-600 text-sm md:text-base">
//               Competitive Salary
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="rounded-2xl">
//           <CardContent className="p-4 md:p-6">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="bg-purple-100 p-2 rounded-lg">
//                 <GraduationCap className="w-5 h-5 text-purple-600" />
//               </div>
//               <h3 className="text-base md:text-lg font-semibold text-gray-900">
//                 Education
//               </h3>
//             </div>
//             <p className="text-gray-600 text-sm md:text-base">
//               Bachelor's Degree
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Job Description */}
//       <Card className="rounded-2xl mb-8">
//         <CardHeader className="pb-4">
//           <h2 className="text-lg md:text-xl font-bold text-gray-900">
//             Job Description
//           </h2>
//         </CardHeader>
//         <CardContent>
//           <div className="prose max-w-none">
//             <p className="text-gray-700 mb-4 md:mb-6 text-sm md:text-base">
//               {job.description}
//             </p>

//             <h3 className="text-base md:text-lg font-semibold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4 flex items-center">
//               <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
//               Responsibilities
//             </h3>
//             <ul className="list-disc list-inside space-y-2 md:space-y-3 text-gray-700 mb-4 md:mb-6">
//               <li className="pl-2 text-sm md:text-base">
//                 Develop and maintain user-facing features using modern frontend
//                 technologies
//               </li>
//               <li className="pl-2 text-sm md:text-base">
//                 Collaborate with designers and backend developers to implement
//                 seamless user experiences
//               </li>
//               <li className="pl-2 text-sm md:text-base">
//                 Optimize applications for maximum speed and scalability
//               </li>
//               <li className="pl-2 text-sm md:text-base">
//                 Participate in code reviews and contribute to team best
//                 practices
//               </li>
//               <li className="pl-2 text-sm md:text-base">
//                 Troubleshoot and debug issues across multiple browsers and
//                 devices
//               </li>
//               <li className="pl-2 text-sm md:text-base">
//                 Stay up-to-date with emerging technologies and industry trends
//               </li>
//             </ul>

//             <h3 className="text-base md:text-lg font-semibold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4 flex items-center">
//               <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
//               Requirements
//             </h3>
//             <ul className="list-disc list-inside space-y-2 md:space-y-3 text-gray-700 mb-4 md:mb-6">
//               <li className="pl-2 text-sm md:text-base">
//                 Bachelor's degree in Computer Science or related field (or
//                 equivalent experience)
//               </li>
//               <li className="pl-2 text-sm md:text-base">
//                 Proven experience as a Frontend Developer or similar role
//               </li>
//               <li className="pl-2 text-sm md:text-base">
//                 Proficiency with React.js and its core principles
//               </li>
//               <li className="pl-2 text-sm md:text-base">
//                 Experience with state management libraries (Redux, Context API)
//               </li>
//               <li className="pl-2 text-sm md:text-base">
//                 Knowledge of modern authorization mechanisms (JWT, OAuth)
//               </li>
//               <li className="pl-2 text-sm md:text-base">
//                 Familiarity with RESTful APIs and asynchronous request handling
//               </li>
//             </ul>

//             <h3 className="text-base md:text-lg font-semibold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4 flex items-center">
//               <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
//               Benefits
//             </h3>
//             <ul className="list-disc list-inside space-y-2 md:space-y-3 text-gray-700">
//               <li className="pl-2 text-sm md:text-base">
//                 Competitive salary and equity package
//               </li>
//               <li className="pl-2 text-sm md:text-base">
//                 Health, dental, and vision insurance
//               </li>
//               <li className="pl-2 text-sm md:text-base">
//                 Flexible working hours and remote work options
//               </li>
//               <li className="pl-2 text-sm md:text-base">
//                 Professional development budget and conference attendance
//               </li>
//               <li className="pl-2 text-sm md:text-base">
//                 Generous vacation and sick leave policies
//               </li>
//               <li className="pl-2 text-sm md:text-base">
//                 401(k) matching program
//               </li>
//             </ul>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Additional Information */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
//         <Card className="rounded-2xl">
//           <CardHeader className="pb-4">
//             <h2 className="text-lg md:text-xl font-bold text-gray-900">
//               Additional Information
//             </h2>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3 md:space-y-4">
//               <div className="flex justify-between py-2 md:py-3 border-b border-gray-100">
//                 <span className="text-gray-600 text-sm md:text-base">
//                   Experience Level
//                 </span>
//                 <span className="font-medium text-gray-900 text-sm md:text-base">
//                   {job.experience}
//                 </span>
//               </div>
//               <div className="flex justify-between py-2 md:py-3 border-b border-gray-100">
//                 <span className="text-gray-600 text-sm md:text-base">
//                   Location
//                 </span>
//                 <span className="font-medium text-gray-900 text-sm md:text-base">
//                   {job.location}
//                 </span>
//               </div>
//               <div className="flex justify-between py-2 md:py-3 border-b border-gray-100">
//                 <span className="text-gray-600 text-sm md:text-base">
//                   Application Deadline
//                 </span>
//                 <span className="font-medium text-gray-900 text-sm md:text-base">
//                   {job.applicationDeadline.toLocaleDateString()}
//                 </span>
//               </div>
//               <div className="flex justify-between py-2 md:py-3">
//                 <span className="text-gray-600 text-sm md:text-base">
//                   Posted Date
//                 </span>
//                 <span className="font-medium text-gray-900 text-sm md:text-base">
//                   {job.createdAt.toLocaleDateString()}
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="rounded-2xl">
//           <CardHeader className="pb-4">
//             <h2 className="text-lg md:text-xl font-bold text-gray-900">
//               How to Apply
//             </h2>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3 md:space-y-4">
//               <div className="flex items-start space-x-3">
//                 <div className="bg-blue-100 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                   <span className="text-blue-600 font-bold text-xs md:text-sm">
//                     1
//                   </span>
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-gray-900 text-sm md:text-base">
//                     Submit Your Application
//                   </h3>
//                   <p className="text-gray-600 text-xs md:text-sm mt-1">
//                     Click the "Apply for this Position" button and complete the
//                     application form.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start space-x-3">
//                 <div className="bg-blue-100 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                   <span className="text-blue-600 font-bold text-xs md:text-sm">
//                     2
//                   </span>
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-gray-900 text-sm md:text-base">
//                     Pre-Screening
//                   </h3>
//                   <p className="text-gray-600 text-xs md:text-sm mt-1">
//                     Our team will review your application and may reach out for
//                     additional information.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start space-x-3">
//                 <div className="bg-blue-100 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                   <span className="text-blue-600 font-bold text-xs md:text-sm">
//                     3
//                   </span>
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-gray-900 text-sm md:text-base">
//                     Interview Process
//                   </h3>
//                   <p className="text-gray-600 text-xs md:text-sm mt-1">
//                     Qualified candidates will be invited for technical and
//                     cultural interviews.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start space-x-3">
//                 <div className="bg-blue-100 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                   <span className="text-blue-600 font-bold text-xs md:text-sm">
//                     4
//                   </span>
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-gray-900 text-sm md:text-base">
//                     Final Decision
//                   </h3>
//                   <p className="text-gray-600 text-xs md:text-sm mt-1">
//                     Successful candidates will receive an offer letter with
//                     details.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Apply Button Section */}
//       <div className="text-center py-6 md:py-8">
//         <Button
//           icon={FileText}
//           onClick={handleApply}
//           size="lg"
//           className="rounded-xl px-6 py-3 md:px-8 md:py-4 text-base md:text-lg"
//         >
//           Apply for this Position
//         </Button>
//         <p className="text-gray-600 mt-4 text-sm md:text-base">
//           Ready to take the next step in your career? Apply now!
//         </p>
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { jobApi } from "../services/api";

import {
  MapPin,
  Clock,
  Calendar,
  ArrowLeft,
  FileText,
  Building,
  DollarSign,
  Briefcase,
  GraduationCap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { JobPost } from "../types";

export const JobDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: jobId } = useParams<{ id: string }>();

  const [job, setJob] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("job id", jobId);
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

  const handleApply = () => {
    navigate(`/apply/${jobId}`);
  };

  const handleBack = () => {
    navigate("/jobs");
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600">Loading job...</div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-20 text-red-600">
        {error || "Job not found"}
      </div>
    );
  }

  const daysUntilDeadline = Math.ceil(
    (job.applicationDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  const getDeadlineStatus = () => {
    if (daysUntilDeadline < 0) return { text: "Closed", variant: "danger" };
    if (daysUntilDeadline <= 7)
      return { text: "Closing Soon", variant: "warning" };
    return { text: "Open", variant: "success" };
  };

  const deadlineStatus = getDeadlineStatus();

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
          Back to Jobs
        </Button>
      </div>

      {/* Job Header Card */}
      <Card className="rounded-2xl shadow-lg mb-8">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 flex-shrink-0 flex items-center justify-center rounded-xl md:w-24">
                  <div className="bg-white w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center shadow-sm">
                    <Building className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  </div>
                </div>

                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                    {job.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 md:gap-4 text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm md:text-base">
                        {job.location}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm md:text-base">
                        {job.experience} experience
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm md:text-base">
                        Apply by {job.applicationDeadline.toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <Badge
                        variant={deadlineStatus.variant}
                        className="rounded-full px-2.5 py-1 text-xs font-medium"
                      >
                        {deadlineStatus.text}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.requiredSkills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="info"
                        className="rounded-full px-2.5 py-1 text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end space-y-3">
              <Button
                icon={FileText}
                onClick={handleApply}
                size="lg"
                className="rounded-xl px-4 py-2 md:px-6 md:py-3 text-sm md:text-base"
              >
                Apply for this Position
              </Button>
              <div className="text-xs md:text-sm text-gray-500">
                Posted {job.createdAt.toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <Card className="rounded-2xl">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">
                Job Type
              </h3>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              {job.jobType}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">
                Compensation
              </h3>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              {job.compensation}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">
                Education
              </h3>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              {job.education}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Job Description */}
      <Card className="rounded-2xl mb-8">
        <CardHeader className="pb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Job Description
          </h2>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4 md:mb-6 text-sm md:text-base">
              {job.description}
            </p>

            <h3 className="text-base md:text-lg font-semibold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4 flex items-center">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
              Responsibilities
            </h3>

            <ul className="list-disc list-inside space-y-2 md:space-y-3 text-gray-700 mb-4 md:mb-6">
              <li className="pl-2 text-sm md:text-base">
                Develop and maintain user-facing features using modern frontend
                technologies
              </li>
              <li className="pl-2 text-sm md:text-base">
                Collaborate with designers and backend developers to implement
                seamless user experiences
              </li>
              <li className="pl-2 text-sm md:text-base">
                Optimize applications for maximum speed and scalability
              </li>
              <li className="pl-2 text-sm md:text-base">
                Participate in code reviews and contribute to team best
                practices
              </li>
              <li className="pl-2 text-sm md:text-base">
                Troubleshoot and debug issues across multiple browsers and
                devices
              </li>
              <li className="pl-2 text-sm md:text-base">
                Stay up-to-date with emerging technologies and industry trends
              </li>
            </ul>

            <h3 className="text-base md:text-lg font-semibold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4 flex items-center">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
              Requirements
            </h3>

            <ul className="list-disc list-inside space-y-2 md:space-y-3 text-gray-700 mb-4 md:mb-6">
              <li className="pl-2 text-sm md:text-base">
                Bachelor's degree in Computer Science or related field (or
                equivalent experience)
              </li>
              <li className="pl-2 text-sm md:text-base">
                Proven experience as a Frontend Developer or similar role
              </li>
              <li className="pl-2 text-sm md:text-base">
                Proficiency with React.js and its core principles
              </li>
              <li className="pl-2 text-sm md:text-base">
                Experience with state management libraries (Redux, Context API)
              </li>
              <li className="pl-2 text-sm md:text-base">
                Knowledge of modern authorization mechanisms (JWT, OAuth)
              </li>
              <li className="pl-2 text-sm md:text-base">
                Familiarity with RESTful APIs and asynchronous request handling
              </li>
            </ul>

            <h3 className="text-base md:text-lg font-semibold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4 flex items-center">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
              Benefits
            </h3>

            <ul className="list-disc list-inside space-y-2 md:space-y-3 text-gray-700">
              <li className="pl-2 text-sm md:text-base">
                Competitive salary and equity package
              </li>
              <li className="pl-2 text-sm md:text-base">
                Health, dental, and vision insurance
              </li>
              <li className="pl-2 text-sm md:text-base">
                Flexible working hours and remote work options
              </li>
              <li className="pl-2 text-sm md:text-base">
                Professional development budget and conference attendance
              </li>
              <li className="pl-2 text-sm md:text-base">
                Generous vacation and sick leave policies
              </li>
              <li className="pl-2 text-sm md:text-base">
                401(k) matching program
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
        <Card className="rounded-2xl">
          <CardHeader className="pb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              Additional Information
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between py-2 md:py-3 border-b border-gray-100">
                <span className="text-gray-600 text-sm md:text-base">
                  Experience Level
                </span>
                <span className="font-medium text-gray-900 text-sm md:text-base">
                  {job.experience}
                </span>
              </div>
              <div className="flex justify-between py-2 md:py-3 border-b border-gray-100">
                <span className="text-gray-600 text-sm md:text-base">
                  Location
                </span>
                <span className="font-medium text-gray-900 text-sm md:text-base">
                  {job.location}
                </span>
              </div>
              <div className="flex justify-between py-2 md:py-3 border-b border-gray-100">
                <span className="text-gray-600 text-sm md:text-base">
                  Application Deadline
                </span>
                <span className="font-medium text-gray-900 text-sm md:text-base">
                  {job.applicationDeadline.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between py-2 md:py-3">
                <span className="text-gray-600 text-sm md:text-base">
                  Posted Date
                </span>
                <span className="font-medium text-gray-900 text-sm md:text-base">
                  {job.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              How to Apply
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-bold text-xs md:text-sm">
                    1
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm md:text-base">
                    Submit Your Application
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm mt-1">
                    Click the "Apply for this Position" button and complete the
                    application form.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-bold text-xs md:text-sm">
                    2
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm md:text-base">
                    Pre-Screening
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm mt-1">
                    Our team will review your application and may reach out for
                    additional information.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-bold text-xs md:text-sm">
                    3
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm md:text-base">
                    Interview Process
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm mt-1">
                    Qualified candidates will be invited for technical and
                    cultural interviews.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-bold text-xs md:text-sm">
                    4
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm md:text-base">
                    Final Decision
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm mt-1">
                    Successful candidates will receive an offer letter with
                    details.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Apply Button Section */}
      <div className="text-center py-6 md:py-8">
        <Button
          icon={FileText}
          onClick={handleApply}
          size="lg"
          className="rounded-xl px-6 py-3 md:px-8 md:py-4 text-base md:text-lg"
        >
          Apply for this Position
        </Button>
        <p className="text-gray-600 mt-4 text-sm md:text-base">
          Ready to take the next step in your career? Apply now!
        </p>
      </div>
    </div>
  );
};
