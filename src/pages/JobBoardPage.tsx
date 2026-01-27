// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardHeader, CardContent } from "../components/ui/Card";
// import { Button } from "../components/ui/Button";
// import { Input } from "../components/ui/Input";
// import { Badge } from "../components/ui/Badge";
// import { jobApi } from "../services/api";
// import {
//   Search,
//   MapPin,
//   Clock,
//   Users,
//   Filter,
//   ExternalLink,
//   Building,
//   Calendar,
// } from "lucide-react";
// import { JobPost } from "../types";



// // Mock job data
// // const mockJobPosts: JobPost[] = [
// //   {
// //     id: '1',
// //     title: 'Frontend Developer',
// //     description: 'We are looking for a skilled Frontend Developer with experience in React, TypeScript, and modern web technologies to join our team.',
// //     location: 'San Francisco, CA',
// //     requiredSkills: ['React', 'TypeScript', 'JavaScript', 'CSS'],
// //     experience: '2+ years',
// //     applicationDeadline: new Date('2025-02-15'),
// //     createdAt: new Date('2025-01-01'),
// //     updatedAt: new Date('2025-01-01'),
// //     status: 'published',
// //     publicLink: '/job/frontend-dev-2025'
// //   },
// //   {
// //     id: '2',
// //     title: 'Backend Engineer',
// //     description: 'Join our backend team to build scalable APIs and microservices using Python and Django.',
// //     location: 'Remote',
// //     requiredSkills: ['Python', 'Django', 'REST API', 'PostgreSQL'],
// //     experience: '3+ years',
// //     applicationDeadline: new Date('2025-02-28'),
// //     createdAt: new Date('2025-01-05'),
// //     updatedAt: new Date('2025-01-05'),
// //     status: 'published',
// //     publicLink: '/job/backend-eng-2025'
// //   },
// //   {
// //     id: '3',
// //     title: 'Full Stack Developer',
// //     description: 'Looking for a versatile developer to work on both frontend and backend of our web applications.',
// //     location: 'New York, NY',
// //     requiredSkills: ['React', 'Node.js', 'MongoDB', 'Express'],
// //     experience: '4+ years',
// //     applicationDeadline: new Date('2025-03-10'),
// //     createdAt: new Date('2025-01-10'),
// //     updatedAt: new Date('2025-01-10'),
// //     status: 'published',
// //     publicLink: '/job/fullstack-dev-2025'
// //   },
// //   {
// //     id: '4',
// //     title: 'DevOps Engineer',
// //     description: 'Help us build and maintain our cloud infrastructure and deployment pipelines.',
// //     location: 'Austin, TX',
// //     requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
// //     experience: '3+ years',
// //     applicationDeadline: new Date('2025-03-05'),
// //     createdAt: new Date('2025-01-12'),
// //     updatedAt: new Date('2025-01-12'),
// //     status: 'published',
// //     publicLink: '/job/devops-eng-2025'
// //   },
// //   {
// //     id: '5',
// //     title: 'UX Designer',
// //     description: 'Create beautiful and intuitive user experiences for our web and mobile applications.',
// //     location: 'Remote',
// //     requiredSkills: ['Figma', 'Sketch', 'User Research', 'Prototyping'],
// //     experience: '2+ years',
// //     applicationDeadline: new Date('2025-02-20'),
// //     createdAt: new Date('2025-01-08'),
// //     updatedAt: new Date('2025-01-08'),
// //     status: 'published',
// //     publicLink: '/job/ux-designer-2025'
// //   }
// // ];

// interface JobBoardPageProps {
//   onNavigate: (view: string) => void;
// }

// export const JobBoardPage: React.FC<JobBoardPageProps> = ({ onNavigate }) => {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [locationFilter, setLocationFilter] = useState("");
//   const [jobs, setJobs] = useState<JobPost[]>([]);
//   const [filteredJobs, setFilteredJobs] = useState<JobPost[]>([]);
//   const [sortBy, setSortBy] = useState<"newest" | "oldest" | "deadline">(
//     "newest",
//   );
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const fetchJobs = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await jobApi.getAll({
//         status: "published",
//         limit: 100,
//       });

//       if (response.success) {
//         const mappedJobs: JobPost[] = response.data.map((job: any) => ({
//           id: job._id,
//           title: job.title,
//           description: job.description,
//           location: job.location,
//           requiredSkills: job.requirements?.skills || [],
//           experience: job.requirements?.minExperience
//             ? `${job.requirements.minExperience}+ years`
//             : "Not specified",
//           applicationDeadline: job.applicationDeadline
//             ? new Date(job.applicationDeadline)
//             : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
//           createdAt: new Date(job.createdAt),
//           updatedAt: new Date(job.updatedAt),
//           status: job.status,
//           publicLink: `/job/${job._id}`,
//         }));

//         setJobs(mappedJobs);
//         setFilteredJobs(mappedJobs);
//       }
//     } catch (err) {
//       setError("Failed to load jobs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     handleSearch();
//   }, [searchTerm, locationFilter, sortBy, jobs]);

//   const handleSearch = () => {
//     let filtered = jobs
//       .filter(
//         (job) =>
//           job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           job.requiredSkills.some((skill) =>
//             skill.toLowerCase().includes(searchTerm.toLowerCase()),
//           ),
//       )
//       .filter((job) =>
//         locationFilter
//           ? job.location.toLowerCase().includes(locationFilter.toLowerCase())
//           : true,
//       );

//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case "newest":
//           return b.createdAt.getTime() - a.createdAt.getTime();
//         case "oldest":
//           return a.createdAt.getTime() - b.createdAt.getTime();
//         case "deadline":
//           return (
//             a.applicationDeadline.getTime() - b.applicationDeadline.getTime()
//           );
//         default:
//           return 0;
//       }
//     });

//     setFilteredJobs(filtered);
//   };

//   const clearFilters = () => {
//     setSearchTerm("");
//     setLocationFilter("");
//     setSortBy("newest");
//   };

//   // Calculate days until deadline for each job
//   const getDaysUntilDeadline = (deadline: Date) => {
//     const diff =
//       new Date(deadline).getTime() - new Date().getTime();
//     return Math.ceil(diff / (1000 * 60 * 60 * 24));
//   };

//   // Get deadline status badge
//   const getDeadlineStatus = (deadline: Date) => {
//     const days = getDaysUntilDeadline(deadline);
//     if (days < 0) return { text: 'Closed', variant: 'danger' as const };
//     if (days <= 7) return { text: 'Closing Soon', variant: 'warning' as const };
//     return { text: 'Open', variant: 'success' as const };
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white mb-8">
//         <h1 className="text-3xl md:text-4xl font-bold mb-3">
//           Find Your Dream Job
//         </h1>
//         <p className="text-blue-100 text-base md:text-lg max-w-3xl">
//           Discover exciting career opportunities with innovative companies.
//           Apply today and take the next step in your professional journey.
//         </p>
//       </div>

//       {/* Search and Filters */}
//       <Card className="rounded-2xl shadow-lg mb-8">
//         <CardContent className="p-4 md:p-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="md:col-span-2">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <Input
//                   placeholder="Search jobs, skills, or companies..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 py-2 md:py-3 text-base rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//             <div>
//               <div className="relative">
//                 <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <Input
//                   placeholder="Location"
//                   value={locationFilter}
//                   onChange={(e) => setLocationFilter(e.target.value)}
//                   className="pl-10 py-2 md:py-3 text-base rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//             <div className="flex space-x-2">
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value as any)}
//                 className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 md:px-4 md:py-3 text-base text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
//               >
//                 <option value="newest">Newest First</option>
//                 <option value="oldest">Oldest First</option>
//                 <option value="deadline">Closing Soon</option>
//               </select>
//               {(searchTerm || locationFilter) && (
//                 <Button
//                   variant="outline"
//                   onClick={clearFilters}
//                   className="px-3 py-2 md:px-4"
//                   size="sm"
//                 >
//                   Clear
//                 </Button>
//               )}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Job Listings */}
//       <div className="space-y-6">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <h2 className="text-xl md:text-2xl font-bold text-gray-900">
//             {filteredJobs.length} Job{filteredJobs.length !== 1 ? "s" : ""}{" "}
//             Available
//           </h2>
//           <div className="text-sm text-gray-600">
//             Sorted by:{" "}
//             {sortBy === "newest"
//               ? "Newest First"
//               : sortBy === "oldest"
//                 ? "Oldest First"
//                 : "Closing Soon"}
//           </div>
//         </div>

//         {filteredJobs.length === 0 ? (
//           <Card className="rounded-2xl shadow-lg">
//             <CardContent className="text-center py-12 md:py-16">
//               <Users className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4 md:mb-6" />
//               <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 md:mb-3">
//                 No jobs found
//               </h3>
//               <p className="text-gray-600 mb-4 md:mb-6 max-w-md mx-auto">
//                 Try adjusting your search or filter criteria to find more
//                 opportunities.
//               </p>
//               <Button
//                 onClick={clearFilters}
//                 className="px-4 py-2 md:px-6 md:py-3 rounded-xl"
//               >
//                 Clear All Filters
//               </Button>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="grid grid-cols-1 gap-6">
//             {filteredJobs.map((job) => {
//               const deadlineStatus = getDeadlineStatus(job.applicationDeadline);
//               const daysUntilDeadline = getDaysUntilDeadline(
//                 job.applicationDeadline,
//               );

//               return (
//                 <Card
//                   key={job.id}
//                   className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
//                   hover={true}
//                 >
//                   <CardContent className="p-0">
//                     <div className="flex flex-col md:flex-row">
//                       {/* Job Icon */}
//                       <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex-shrink-0 flex items-center justify-center md:w-32">
//                         <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm">
//                           <Building className="w-8 h-8 text-blue-600" />
//                         </div>
//                       </div>

//                       {/* Job Details */}
//                       <div className="flex-1 p-6">
//                         <div className="flex flex-col md:flex-row md:items-start justify-between">
//                           <div className="flex-1">
//                             <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
//                               <h3 className="text-lg md:text-xl font-bold text-gray-900">
//                                 {job.title}
//                               </h3>
//                               <Badge
//                                 variant={deadlineStatus.variant}
//                                 className="rounded-full px-3 py-1 text-xs font-medium"
//                               >
//                                 {deadlineStatus.text}
//                               </Badge>
//                             </div>

//                             <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
//                               <div className="flex items-center space-x-1">
//                                 <MapPin className="w-4 h-4" />
//                                 <span className="text-sm">{job.location}</span>
//                               </div>
//                               <div className="flex items-center space-x-1">
//                                 <Clock className="w-4 h-4" />
//                                 <span className="text-sm">
//                                   {job.experience}
//                                 </span>
//                               </div>
//                               <div className="flex items-center space-x-1">
//                                 <Calendar className="w-4 h-4" />
//                                 <span className="text-sm">
//                                   Apply by{" "}
//                                   {job.applicationDeadline.toLocaleDateString()}
//                                   {daysUntilDeadline >= 0 &&
//                                     daysUntilDeadline <= 7 && (
//                                       <span className="ml-1 font-medium">
//                                         ({daysUntilDeadline}{" "}
//                                         {daysUntilDeadline === 1
//                                           ? "day"
//                                           : "days"}{" "}
//                                         left)
//                                       </span>
//                                     )}
//                                 </span>
//                               </div>
//                             </div>

//                             <p className="text-gray-700 mb-4 text-sm md:text-base line-clamp-2">
//                               {job.description}
//                             </p>

//                             <div className="flex flex-wrap gap-2 mb-4">
//                               {job.requiredSkills
//                                 .slice(0, 4)
//                                 .map((skill, index) => (
//                                   <Badge
//                                     key={index}
//                                     variant="info"
//                                     className="rounded-full px-2.5 py-1 text-xs"
//                                   >
//                                     {skill}
//                                   </Badge>
//                                 ))}
//                               {job.requiredSkills.length > 4 && (
//                                 <Badge
//                                   variant="secondary"
//                                   className="rounded-full px-2.5 py-1 text-xs"
//                                 >
//                                   +{job.requiredSkills.length - 4} more
//                                 </Badge>
//                               )}
//                             </div>
//                           </div>

//                           {/* Action Buttons */}
//                           <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end space-y-3">
//                             <Button
//                               icon={ExternalLink}
//                               onClick={() => handleViewJob(job.id)}
//                               className="rounded-xl px-4 py-2 text-sm"
//                               size="sm"
//                             >
//                               View Details
//                             </Button>
//                             <div className="text-xs text-gray-500">
//                               Posted {job.createdAt.toLocaleDateString()}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { jobApi } from "../services/api";
import {
  Search,
  MapPin,
  Clock,
  Users,
  ExternalLink,
  Building,
  Calendar,
} from "lucide-react";
import { JobPost } from "../types";

interface JobBoardPageProps {
  onNavigate: (view: string) => void;
}

export const JobBoardPage: React.FC<JobBoardPageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPost[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "deadline">(
    "newest"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH JOBS ================= */

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await jobApi.getAll({
        status: "published", // backend must match this
        limit: 100,
      });

      if (response.success) {
        const mappedJobs: JobPost[] = response.data.map((job: any) => ({
          id: job._id,
          title: job.title,
          description: job.description,
          location: job.location,
          requiredSkills: job.requirements?.skills || [],
          experience: job.requirements?.minExperience
            ? `${job.requirements.minExperience}+ years`
            : "Not specified",
          applicationDeadline: job.applicationDeadline
            ? new Date(job.applicationDeadline)
            : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          createdAt: new Date(job.createdAt),
          updatedAt: new Date(job.updatedAt),
          status: job.status,
          publicLink: `/job/${job._id}`,
        }));

        setJobs(mappedJobs);
        setFilteredJobs(mappedJobs);
      }
    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER + SORT ================= */

  useEffect(() => {
    handleSearch();
  }, [searchTerm, locationFilter, sortBy, jobs]);

  const handleSearch = () => {
    let filtered = jobs
      .filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.requiredSkills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
      .filter((job) =>
        locationFilter
          ? job.location.toLowerCase().includes(locationFilter.toLowerCase())
          : true
      );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "deadline":
          return (
            a.applicationDeadline.getTime() -
            b.applicationDeadline.getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setSortBy("newest");
    setFilteredJobs(jobs);
  };

  /* ================= HELPERS ================= */

  const handleViewJob = (jobId: string) => {
    console.log("this is job id", jobId);
    //onNavigate("job-details");
    navigate(`/job/${jobId}`);
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const diff = deadline.getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getDeadlineStatus = (deadline: Date) => {
    const days = getDaysUntilDeadline(deadline);
    if (days < 0) return { text: "Closed", variant: "danger" as const };
    if (days <= 7) return { text: "Closing Soon", variant: "warning" as const };
    return { text: "Open", variant: "success" as const };
  };

  /* ================= UI ================= */

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Dream Job</h1>
        <p className="text-blue-100">
          Discover exciting career opportunities and apply today.
        </p>
      </div>

      {/* Search & Filters */}
      <Card className="rounded-2xl shadow-lg mb-6">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search jobs, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 rounded-xl border px-3"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="deadline">Closing Soon</option>
            </select>

            {(searchTerm || locationFilter) && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <CardContent className="text-red-700 text-center py-4">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Clock className="w-10 h-10 mx-auto mb-4 animate-spin text-gray-400" />
            <p className="text-gray-600">Loading jobs...</p>
          </CardContent>
        </Card>
      )}

      {/* Jobs */}
      {!loading && filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredJobs.map((job) => {
            const deadlineStatus = getDeadlineStatus(
              job.applicationDeadline
            );

            return (
              <Card key={job.id} className="rounded-2xl shadow-md">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                  <div className="flex items-center justify-center w-20 h-20 bg-blue-50 rounded-xl">
                    <Building className="w-8 h-8 text-blue-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-bold">{job.title}</h3>
                      <Badge variant={deadlineStatus.variant}>
                        {deadlineStatus.text}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.experience}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {job.applicationDeadline.toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.slice(0, 4).map((skill, i) => (
                        <Badge key={i} variant="info">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end">
                    <Button
                      size="sm"
                      icon={ExternalLink}
                      onClick={() => handleViewJob(job.id)}
                    >
                      View Details
                    </Button>
                    <span className="text-xs text-gray-500 mt-2">
                      Posted {job.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};



