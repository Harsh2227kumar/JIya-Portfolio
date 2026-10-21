export interface ProfileInfo {
  name: string;
  headline: string;
  bio: string;
  shortIntro: string;
  location: string;
  institution: string;
  degree: string;
  specialization: string;
  semesterCgpa: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  resumeAvailable: boolean;
  resumePlaceholderNotice: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: {
    name: string;
    level: 'Familiar' | 'Intermediate' | 'Proficient';
    iconName?: string;
  }[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'AI/ML' | 'Software' | 'Embedded & Systems' | 'Hackathon';
  description: string;
  technologies: string[];
  status: 'Completed' | 'In Progress';
  githubRepoUrl?: string;
  demoUrl?: string;
  hasVerifiedRepo: boolean;
}

export interface AchievementItem {
  id: string;
  title: string;
  role: string;
  category: 'Leadership' | 'Technical' | 'Sports' | 'Arts';
  description: string;
  tags: string[];
  isEditableNote?: boolean;
}

export interface PortfolioData {
  profile: ProfileInfo;
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  achievements: AchievementItem[];
}

export interface VisitorLog {
  id: string;
  ip: string;
  timestamp: string;
  country?: string;
  region?: string;
  city?: string;
  postalCode?: string;
  isp?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  referrer?: string;
  userAgent?: string;
  deviceType?: string;
  browser?: string;
  screenResolution?: string;
  language?: string;
  pagePath?: string;
  emailSent: boolean;
  emailError?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  ip: string;
  consentGiven: boolean;
  emailSent: boolean;
}

export interface AnalyticsSummary {
  totalVisits: number;
  uniqueIps: number;
  countries: Record<string, number>;
  devices: Record<string, number>;
  recentVisits: VisitorLog[];
  contactMessages: ContactMessage[];
  resendConfigured: boolean;
  targetEmail: string;
}
