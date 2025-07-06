// Test script for profile completion tracking
console.log('=== Profile Completion Tracking Test ===');

// Simulate the completion calculation functions
function calculateCandidateCompletion(formData) {
  const sections = {
    basicInfo: 0,
    summary: 0,
    skills: 0,
    workExperience: 0,
    education: 0,
    projects: 0,
    achievements: 0,
    languages: 0,
    socialLinks: 0
  };

  // 1. Basic Information (Current Role, Experience, Location)
  if (formData.currentRole?.trim() && formData.experience && formData.location?.trim()) {
    sections.basicInfo = 1;
  }

  // 2. Professional Summary
  if (formData.summary?.trim() && formData.summary.trim().length >= 50) {
    sections.summary = 1;
  }

  // 3. Skills
  if (formData.skills && formData.skills.length > 0) {
    sections.skills = 1;
  }

  // 4. Work Experience
  if (formData.workExperience && formData.workExperience.length > 0) {
    const hasValidExperience = formData.workExperience.some(exp => 
      exp.company?.trim() && exp.position?.trim() && exp.startDate?.trim() && exp.description?.trim()
    );
    if (hasValidExperience) {
      sections.workExperience = 1;
    }
  }

  // 5. Education
  if (formData.education && formData.education.length > 0) {
    const hasValidEducation = formData.education.some(edu => 
      edu.institution?.trim() && edu.degree?.trim() && edu.fieldOfStudy?.trim() && edu.startDate?.trim()
    );
    if (hasValidEducation) {
      sections.education = 1;
    }
  }

  // 6. Projects
  if (formData.projects && formData.projects.length > 0) {
    const hasValidProject = formData.projects.some(project => 
      project.name?.trim() && project.description?.trim() && project.technologies && project.technologies.length > 0
    );
    if (hasValidProject) {
      sections.projects = 1;
    }
  }

  // 7. Achievements
  if (formData.achievements && formData.achievements.length > 0) {
    const hasValidAchievement = formData.achievements.some(achievement => 
      achievement.title?.trim() && achievement.description?.trim() && achievement.date?.trim() && achievement.organization?.trim()
    );
    if (hasValidAchievement) {
      sections.achievements = 1;
    }
  }

  // 8. Languages
  if (formData.languages && formData.languages.length > 0) {
    sections.languages = 1;
  }

  // 9. Social Links
  if (formData.socialLinks?.linkedin || formData.socialLinks?.github || formData.socialLinks?.portfolio) {
    sections.socialLinks = 1;
  }

  const completedSections = Object.values(sections).reduce((sum, val) => sum + val, 0);
  const percentage = Math.round((completedSections / 9) * 100);
  
  return { sections, completedSections, percentage };
}

// Test with empty profile
console.log('\n1. Testing empty profile (should be 0%):');
const emptyProfile = {};
const emptyResult = calculateCandidateCompletion(emptyProfile);
console.log(`   Completed sections: ${emptyResult.completedSections}/9`);
console.log(`   Completion percentage: ${emptyResult.percentage}%`);
console.log(`   Button text should be: "Save Progress"`);

// Test with partial profile (3 sections completed)
console.log('\n2. Testing partial profile (should be ~33%):');
const partialProfile = {
  currentRole: 'Software Engineer',
  experience: '3',
  location: 'San Francisco, CA',
  summary: 'A passionate software engineer with 3 years of experience in full-stack development. Skilled in React, Node.js, and cloud technologies.',
  skills: ['JavaScript', 'React', 'Node.js']
};
const partialResult = calculateCandidateCompletion(partialProfile);
console.log(`   Completed sections: ${partialResult.completedSections}/9`);
console.log(`   Completion percentage: ${partialResult.percentage}%`);
console.log(`   Button text should be: "Save Progress"`);

// Test with complete profile
console.log('\n3. Testing complete profile (should be 100%):');
const completeProfile = {
  currentRole: 'Software Engineer',
  experience: '3',
  location: 'San Francisco, CA',
  summary: 'A passionate software engineer with 3 years of experience in full-stack development. Skilled in React, Node.js, and cloud technologies.',
  skills: ['JavaScript', 'React', 'Node.js'],
  workExperience: [{
    company: 'Tech Corp',
    position: 'Software Engineer',
    startDate: '2021-01',
    description: 'Developed web applications using React and Node.js'
  }],
  education: [{
    institution: 'University of Technology',
    degree: 'Bachelor of Science',
    fieldOfStudy: 'Computer Science',
    startDate: '2017-09'
  }],
  projects: [{
    name: 'E-commerce Platform',
    description: 'Built a full-stack e-commerce platform',
    technologies: ['React', 'Node.js', 'MongoDB']
  }],
  achievements: [{
    title: 'Employee of the Month',
    description: 'Recognized for outstanding performance',
    date: '2023-06',
    organization: 'Tech Corp'
  }],
  languages: ['English', 'Spanish'],
  socialLinks: {
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe'
  }
};
const completeResult = calculateCandidateCompletion(completeProfile);
console.log(`   Completed sections: ${completeResult.completedSections}/9`);
console.log(`   Completion percentage: ${completeResult.percentage}%`);
console.log(`   Button text should be: "Create Profile" or "Update Profile"`);

console.log('\n=== Test Results ===');
console.log(`Empty profile: ✅ ${emptyResult.percentage === 0 ? 'PASS' : 'FAIL'} (${emptyResult.percentage}%)`);
console.log(`Partial profile: ✅ ${partialResult.percentage === 33 ? 'PASS' : 'FAIL'} (${partialResult.percentage}%)`);
console.log(`Complete profile: ✅ ${completeResult.percentage === 100 ? 'PASS' : 'FAIL'} (${completeResult.percentage}%)`);
