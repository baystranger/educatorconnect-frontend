import {
  Briefcase,
  CalendarDays,
  Sparkles,
  PlayCircle,
  Home,
  GraduationCap,
  Building2,
  UserPlus,
  LogIn,
  UserRound,
  ClipboardList,
  Search,
  Settings,
  Users,
  MessageSquare,
  ShieldCheck,
  BarChart3,
  FilePlus2,
  BookOpen,
} from 'lucide-vue-next'

export const publicNavItems = [
  { label: 'Home', href: '#childcare', icon: Home },
  { label: 'Browse Jobs', href: '#jobs', icon: Briefcase },
  { label: 'Educators', href: '#testimonials', icon: GraduationCap },
  { label: 'Centers', href: '#centres', icon: Building2 },
  { label: 'dayCares', href: '#childcare', icon: Home },
  { label: 'Sign Up', href: '/register', icon: UserPlus },
  { label: 'Login', href: '/login', icon: LogIn },
]

export const roleNavItems = {
  childcare: [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Centre Profile', href: '/childcare/profile', icon: Building2 },
    { label: 'Post a Job', href: '/childcare/jobs/new', icon: FilePlus2 },
    { label: 'Applicants', href: '/childcare/applications', icon: Users },
    { label: 'Parent Inquiries', href: '/childcare/inquiries', icon: MessageSquare },
    { label: 'Practicum', href: '/childcare/practicum', icon: GraduationCap },
    { label: 'Account Settings', href: '/account/settings', icon: Settings },
  ],

  educator: [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Update Profile', href: '/educator/profile', icon: UserRound },
    { label: 'Browse Jobs', href: '/jobs', icon: Search },
    { label: 'Applications', href: '/educator/applications', icon: ClipboardList },
    { label: 'Saved Jobs', href: '/educator/saved-jobs', icon: Briefcase },
    { label: 'Practicum', href: '/educator/practicum', icon: GraduationCap },
    { label: 'Account Settings', href: '/account/settings', icon: Settings },
  ],

  professional: [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Directory Profile', href: '/professional/profile', icon: UserRound },
    { label: 'Claim a Profile', href: '/professionals/claim', icon: ShieldCheck },
    { label: 'Find Professionals', href: '/professionals', icon: Search },
    { label: 'Account Settings', href: '/account/settings', icon: Settings },
  ],

  admin: [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Centres', href: '/admin/centres', icon: Building2 },
    { label: 'Educators', href: '/admin/educators', icon: GraduationCap },
    { label: 'Jobs', href: '/admin/jobs', icon: Briefcase },
    { label: 'Directory', href: '/admin/directory', icon: BookOpen },
    { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
  ],
}