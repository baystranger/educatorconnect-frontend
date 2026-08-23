<template>
  <div class="page-layout">
    <AppHeader :logo="educatorLogo" :nav-items="navItems" />
    
      <!-- HERO ONLY -->
      <section class="hero-background">
        <div class="container-xxl">
          <HeroSection
            :filter-tips="dashboardFilter"
            :highlights="featuredHighlights"
          />
        </div>
      </section>

    <main class="container-xxl py-3 py-lg-4">      
      <section class="section" id="childcare">
        <child-care :day-cares="daycares" />
      </section>

      <section id="centres">
        <CenterCard />
      </section>

      <VideoSection :tips="videoTips" />

      <HowItWorksings :steps="steps" />
      
      <section id="jobs" class="py-3 py-lg-4">
        <div class="row g-4">
          <div class="col-lg-8">
            <JobList :jobs="jobs" />
          </div>
          <div class="col-lg-4">
            <div class="card border-0 shadow-sm rounded-4 p-4 p-lg-5 bg-primary text-white h-100">
              <p class="text-2xs fw-semibold text-uppercase text-white mb-2">Showcase your profile</p>
              <h2 class="h3 mb-3 text-white">
                Stand out and upload a quick video to your online educator profile!
              </h2>
              <p class="text-white mb-4">
                Create an account and get hired fast with a polished profile that helps centres discover your
                experience.
              </p>
              <a href="https://educatorconnect.ca/sign-up" class="btn btn-light rounded-pill px-4">Create an account</a>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection :testimonials="testimonials" />

      <AboutAndSubscribeings :stats="stats" />
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth.store.js'

import AppHeader from './LandingPageCompoent/AppHeader.vue'
import HeroSection from './LandingPageCompoent/HeroSection.vue'
import JobList from './LandingPageCompoent/JobList.vue'
import VideoSection from './LandingPageCompoent/VideoSection.vue'
import HowItWorksings from './LandingPageCompoent/HowItWorksings.vue'
import TestimonialsSection from './LandingPageCompoent/TestimonialsSection.vue'
import AboutAndSubscribeings from './LandingPageCompoent/AboutAndSubscribeings.vue'
import AppFooter from './LandingPageCompoent/AppFooter.vue'

import educatorLogo from '../assets/educatorlogo.png';
import {
  Briefcase,
  CalendarDays,
  Sparkles,
  PlayCircle,
  Home,
  GraduationCap,
  Building2,
  Layers,
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
  BookOpen
} from 'lucide-vue-next';
import ChildCare from './LandingPageCompoent/ChildCare.vue'
import CenterCard from './LandingPageCompoent/CenterCard.vue'

const authStore = useAuthStore()

const publicNavItems = [
  { label: 'Home', href: '#childcare', icon: Home },
  { label: 'Browse Jobs', href: '#jobs', icon: Briefcase },
  { label: 'Educators', href: '#testimonials', icon: GraduationCap },
  { label: 'Centers', href: '#centres', icon: Building2 },
  { label: 'dayCares', href: '#childcare', icon: Home },
  { label: 'Sign Up', href: '/register', icon: UserPlus },
  { label: 'Login', href: '/login', icon: LogIn }
]

const roleNavItems = {
  childcare: [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Centre Profile', href: '/childcare/profile', icon: Building2 },
    { label: 'Post a Job', href: '/childcare/jobs/new', icon: FilePlus2 },
    { label: 'Applicants', href: '/childcare/applications', icon: Users },
    { label: 'Parent Inquiries', href: '/childcare/inquiries', icon: MessageSquare },
    { label: 'Practicum', href: '/childcare/practicum', icon: GraduationCap },
    { label: 'Account Settings', href: '/account/settings', icon: Settings }
  ],
  educator: [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Update Profile', href: '/educator/profile', icon: UserRound },
    { label: 'Browse Jobs', href: '/jobs', icon: Search },
    { label: 'Applications', href: '/educator/applications', icon: ClipboardList },
    { label: 'Saved Jobs', href: '/educator/saved-jobs', icon: Briefcase },
    { label: 'Practicum', href: '/educator/practicum', icon: GraduationCap },
    { label: 'Account Settings', href: '/account/settings', icon: Settings }
  ],
  professional: [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Directory Profile', href: '/professional/profile', icon: UserRound },
    { label: 'Claim a Profile', href: '/professionals/claim', icon: ShieldCheck },
    { label: 'Find Professionals', href: '/professionals', icon: Search },
    { label: 'Account Settings', href: '/account/settings', icon: Settings }
  ],
  admin: [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Centres', href: '/admin/centres', icon: Building2 },
    { label: 'Educators', href: '/admin/educators', icon: GraduationCap },
    { label: 'Jobs', href: '/admin/jobs', icon: Briefcase },
    { label: 'Directory', href: '/admin/directory', icon: BookOpen },
    { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 }
  ]
}

const navItems = computed(() => {
  if (!authStore.isAuthenticated) return publicNavItems

  return [
    ...(roleNavItems[authStore.role] || roleNavItems.educator),
    { label: 'Log out', href: '#', icon: LogIn, action: 'logout' }
  ]
})

const featuredHighlights = [
  { title: 'Preschool Manager', meta: 'Manager • Published 1 year ago', badge: 'Open' },
  { title: 'Early Childhood Educator', meta: 'Full time • Published 1 year ago', badge: 'Open' },
  { title: 'Full Stack Developer', meta: 'Manager • Published 2 months ago', badge: 'Open' }
];

const steps = [
  { title: 'Create a free profile', description: 'Build your educator profile and share your experience with hiring centres.', icon: Briefcase },
  { title: 'Add your details', description: 'Include your background, certifications, and professional interests.', icon: Sparkles },
  { title: 'Upload your video resume', description: 'Show your personality and approach in a short, engaging introduction.', icon: PlayCircle },
  { title: 'Apply and connect', description: 'Start applying for roles and join the growing educator community.', icon: CalendarDays }
];

const dashboardFilter = [
  { title: 'Parents search without an account' },
  { title: 'Location-based discovery' }
];

const videoTips = [
  { title: 'Keep it clear and concise', description: 'Introduce yourself, your experience, and what kind of role you are seeking.' },
  { title: 'Show your personality', description: 'Let your tone, warmth, and teaching approach come through naturally.' },
  { title: 'Highlight your strengths', description: 'Mention your qualifications, specialisations, and what makes you stand out.' }
];

const jobs = [
  { title: 'Preschool Manager', type: 'Manager', published: '1 year ago', description: 'Lead a nurturing early learning environment with strong teaching support.' },
  { title: 'Full Stack Developer', type: 'Manager', published: '2 months ago', description: 'A creative role that supports digital growth and community engagement.' },
  { title: 'ECE Preschool Teacher Wanted', type: 'Full time', published: '1 year ago', description: 'Join a team focused on quality care, learning, and development.' },
  { title: 'Early Childhood Educator', type: 'Full time', published: '1 year ago', description: 'Support children with care, play-based learning, and daily routines.' }
];


const daycares = [
  {
    title: 'Little Sprouts Daycare',
    location: 'Vancouver, BC',
    distance: '2.4 km',
    ages: '6 months – 5 years',
    type: 'Licensed Childcare',
    published: '2 days ago',
    description: 'A warm and nurturing early learning centre focused on play-based learning and child development.',
  },
  {
    title: 'Happy Hearts Early Learning Centre',
    location: 'Toronto, ON',
    distance: '3.1 km',
    ages: '1 – 5 years',
    type: 'Preschool & Daycare',
    published: '5 days ago',
    description: 'A welcoming environment offering engaging programs that support children’s learning, creativity, and growth.',
  },
  {
    title: 'Bright Beginnings Childcare',
    location: 'Calgary, AB',
    distance: '4.8 km',
    ages: '12 months – 6 years',
    type: 'Childcare Centre',
    published: '1 week ago',
    description: 'Quality childcare with a focus on safe environments, meaningful relationships, and hands-on learning.',
  },
  {
    title: 'Sunshine Kids Learning Centre',
    location: 'Ottawa, ON',
    distance: '5.2 km',
    ages: '2 – 5 years',
    type: 'Early Learning',
    published: '1 week ago',
    description: 'An inclusive early learning community providing creative activities, outdoor play, and supportive care.',
  },
];

const testimonials = [
  { name: 'Kim Burton', location: 'Richmond, BC', initials: 'KB', quote: 'The Portfolio feature is awesome. This is better than any job site. It really gives educators a platform to shine.' },
  { name: 'Sooyung Jung', location: 'Richmond, BC', initials: 'SJ', quote: 'Best site for ECEs. I got hired quickly and found a centre that was right for me.' },
  { name: 'Mira Suhen', location: 'Coquitlam, BC', initials: 'MS', quote: 'I love this job bank. I was able to move up to a director position and build a stronger network.' }
];

const stats = [
  { label: 'Jobs shared', value: '120+' },
  { label: 'Educators supported', value: '5k+' },
  { label: 'Events hosted', value: '200+' },
  { label: 'Community growth', value: '98%' }
];
</script>