


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

// interface JobBoardPageProps {
//   onNavigate: (view: string) => void;
// }

export const JobBoardPage: React.FC = () => {
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



