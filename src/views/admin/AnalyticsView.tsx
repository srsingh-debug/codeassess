import React from 'react';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { StatCard } from '../../components/admin/StatCard';
import { AnalyticsChart } from '../../components/admin/AnalyticsChart';
import { useAnalytics } from '../../hooks/admin/useAnalytics';
import { 
  Download,
  FileText,
  Users,
  Target,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface AnalyticsViewProps {
  onNavigate: (view: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onNavigate }) => {
  const {
    analyticsData,
    loading,
    timeRange,
    setTimeRange,
    assessmentFilter,
    setAssessmentFilter,
    getTrendValue
  } = useAnalytics();

  const timeRangeOptions = [
    { value: '1month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' }
  ];

  const assessmentFilterOptions = [
    { value: 'all', label: 'All Assessments' },
    { value: 'frontend', label: 'Frontend Tests' },
    { value: 'backend', label: 'Backend Tests' },
    { value: 'fullstack', label: 'Full Stack Tests' }
  ];

  if (loading || !analyticsData) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col h-full">
      {/* Main Content - Optimized for space */}
      <main className="flex-1">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Comprehensive insights into assessment performance and candidate metrics
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select
              options={timeRangeOptions}
              value={timeRange}
              onChange={setTimeRange}
            />
            <Select
              options={assessmentFilterOptions}
              value={assessmentFilter}
              onChange={setAssessmentFilter}
            />
            <Button variant="outline" icon={Download} size="sm">
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
          <StatCard
            title="Total Assessments"
            value={analyticsData.overview.totalAssessments}
            icon={FileText}
            iconColor="bg-blue-500"
            trend={{
              value: getTrendValue(
                analyticsData.trends.assessmentsThisMonth, 
                analyticsData.trends.assessmentsLastMonth
              ),
              label: 'this month'
            }}
          />
          <StatCard
            title="Total Candidates"
            value={analyticsData.overview.totalCandidates}
            icon={Users}
            iconColor="bg-green-500"
            trend={{
              value: getTrendValue(
                analyticsData.trends.candidatesThisMonth, 
                analyticsData.trends.candidatesLastMonth
              ),
              label: 'this month'
            }}
          />
          <StatCard
            title="Average Score"
            value={`${analyticsData.overview.averageScore}%`}
            icon={Target}
            iconColor="bg-indigo-500"
            trend={{
              value: analyticsData.trends.scoreImprovement,
              label: 'improvement'
            }}
          />
          <StatCard
            title="Completion Rate"
            value={`${analyticsData.overview.completionRate}%`}
            icon={TrendingUp}
            iconColor="bg-teal-500"
            trend={{
              value: analyticsData.trends.completionImprovement,
              label: 'improvement'
            }}
          />
          <StatCard
            title="Avg. Time"
            value={`${analyticsData.overview.averageTime}m`}
            icon={BarChart3}
            iconColor="bg-purple-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
          <AnalyticsChart
            title="Assessments Over Time"
            data={analyticsData.monthlyData.map(d => ({ label: d.month, value: d.assessments }))}
            type="line"
            color="bg-blue-500"
          />
          <AnalyticsChart
            title="Candidates Over Time"
            data={analyticsData.monthlyData.map(d => ({ label: d.month, value: d.candidates }))}
            type="bar"
            color="bg-green-500"
          />
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Top Performing Assessments */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Performing Assessments
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analyticsData.topPerformingAssessments.map((assessment, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-2">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                        {assessment.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {assessment.candidates} candidates
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-300">
                        Avg. Score: {assessment.avgScore}%
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        Completion: {assessment.completionRate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Score Distribution
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Excellent (90-100%)</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {analyticsData.scoreDistribution.excellent} candidates
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Good (80-89%)</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {analyticsData.scoreDistribution.good} candidates
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Average (70-79%)</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {analyticsData.scoreDistribution.average} candidates
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Poor (&lt;70%)</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {analyticsData.scoreDistribution.poor} candidates
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};