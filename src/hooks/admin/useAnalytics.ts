import { useState, useEffect } from 'react';

interface AnalyticsData {
  overview: {
    totalAssessments: number;
    totalCandidates: number;
    averageScore: number;
    completionRate: number;
    averageTime: number;
  };
  trends: {
    assessmentsThisMonth: number;
    assessmentsLastMonth: number;
    candidatesThisMonth: number;
    candidatesLastMonth: number;
    scoreImprovement: number;
    completionImprovement: number;
  };
  topPerformingAssessments: Array<{
    name: string;
    candidates: number;
    avgScore: number;
    completionRate: number;
  }>;
  scoreDistribution: {
    excellent: number; // 90-100
    good: number;      // 80-89
    average: number;   // 70-79
    poor: number;      // <70
  };
  monthlyData: Array<{
    month: string;
    assessments: number;
    candidates: number;
    avgScore: number;
  }>;
}

export const useAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');
  const [assessmentFilter, setAssessmentFilter] = useState('all');

  // Mock data initialization
  useEffect(() => {
    // In a real app, this would come from an API
    const mockData: AnalyticsData = {
      overview: {
        totalAssessments: 156,
        totalCandidates: 1247,
        averageScore: 78.5,
        completionRate: 87.3,
        averageTime: 65 // minutes
      },
      trends: {
        assessmentsThisMonth: 42,
        assessmentsLastMonth: 38,
        candidatesThisMonth: 156,
        candidatesLastMonth: 142,
        scoreImprovement: 2.3,
        completionImprovement: 4.2
      },
      topPerformingAssessments: [
        { name: 'Frontend React Test', candidates: 89, avgScore: 82.4, completionRate: 91.2 },
        { name: 'Backend Python Assessment', candidates: 67, avgScore: 79.8, completionRate: 88.1 },
        { name: 'Full Stack Challenge', candidates: 45, avgScore: 76.2, completionRate: 84.4 }
      ],
      scoreDistribution: {
        excellent: 23, // 90-100
        good: 45,      // 80-89
        average: 52,   // 70-79
        poor: 36       // <70
      },
      monthlyData: [
        { month: 'Jan', assessments: 32, candidates: 98, avgScore: 76.2 },
        { month: 'Feb', assessments: 28, candidates: 87, avgScore: 77.8 },
        { month: 'Mar', assessments: 35, candidates: 112, avgScore: 78.9 },
        { month: 'Apr', assessments: 42, candidates: 134, avgScore: 79.2 },
        { month: 'May', assessments: 38, candidates: 125, avgScore: 80.1 },
        { month: 'Jun', assessments: 45, candidates: 156, avgScore: 78.5 }
      ]
    };

    setAnalyticsData(mockData);
    setLoading(false);
  }, []);

  const getTrendValue = (current: number, previous: number) => {
    return current - previous;
  };

  const getTrendPercentage = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return {
    analyticsData,
    loading,
    timeRange,
    setTimeRange,
    assessmentFilter,
    setAssessmentFilter,
    getTrendValue,
    getTrendPercentage
  };
};