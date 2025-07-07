/**
 * Profile Creation Validation Test
 * This file tests the profile creation validation logic to ensure all sections must be filled
 */

// Test data for candidate profile validation
const incompleteProfile = {
  currentRole: "Software Engineer",
  // Missing experience, location, summary, skills, workExperience, etc.
};

const completeProfile = {
  currentRole: "Software Engineer",
  experience: "5",
  location: "San Francisco, CA",
  summary: "Experienced software engineer with 5+ years in full-stack development, passionate about building scalable applications and mentoring junior developers.",
  skills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
  workExperience: [
    {
      company: "Tech Corp",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2020-01",
      endDate: "2023-12",
      description: "Led development of microservices architecture, mentored 3 junior developers, and improved system performance by 40%.",
      isCurrentJob: false
    }
  ],
  education: [
    {
      institution: "Stanford University",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2015-09",
      endDate: "2019-05",
      grade: "3.8/4.0"
    }
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Built a full-stack e-commerce platform using React, Node.js, and MongoDB with payment integration and real-time inventory management.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/user/ecommerce"
    }
  ],
  achievements: [
    {
      title: "Employee of the Year",
      description: "Recognized for outstanding performance and leadership in Q4 2022",
      date: "2022-12",
      organization: "Tech Corp",
      url: "https://example.com/award"
    }
  ],
  languages: ["English - Native", "Spanish - Fluent"],
  socialLinks: {
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    portfolio: "https://johndoe.dev"
  }
};

// Test function to validate candidate profile
function validateCandidateProfile(formData) {
  const errors = [];

  // Basic Information validation
  if (!formData.currentRole?.trim()) errors.push("Current Role is required");
  if (!formData.experience || formData.experience === '' || parseInt(formData.experience) < 0) errors.push("Years of Experience is required");
  if (!formData.location?.trim()) errors.push("Location is required");

  // Professional Summary validation
  if (!formData.summary?.trim()) errors.push("Professional Summary is required");
  if (formData.summary?.trim() && formData.summary.trim().length < 50) errors.push("Professional Summary must be at least 50 characters");

  // Skills validation
  if (!formData.skills || formData.skills.length === 0) errors.push("At least one skill is required");

  // Work Experience validation
  if (!formData.workExperience || formData.workExperience.length === 0) {
    errors.push("At least one work experience is required");
  } else {
    formData.workExperience.forEach((exp, index) => {
      if (!exp.company?.trim()) errors.push(`Work Experience ${index + 1}: Company is required`);
      if (!exp.position?.trim()) errors.push(`Work Experience ${index + 1}: Position is required`);
      if (!exp.startDate?.trim()) errors.push(`Work Experience ${index + 1}: Start Date is required`);
      if (!exp.description?.trim()) errors.push(`Work Experience ${index + 1}: Description is required`);
      if (exp.description?.trim().length < 10) errors.push(`Work Experience ${index + 1}: Description must be at least 10 characters`);
    });
  }

  // Education validation
  if (!formData.education || formData.education.length === 0) {
    errors.push("At least one education entry is required");
  } else {
    formData.education.forEach((edu, index) => {
      if (!edu.institution?.trim()) errors.push(`Education ${index + 1}: Institution is required`);
      if (!edu.degree?.trim()) errors.push(`Education ${index + 1}: Degree is required`);
      if (!edu.fieldOfStudy?.trim()) errors.push(`Education ${index + 1}: Field of Study is required`);
      if (!edu.startDate?.trim()) errors.push(`Education ${index + 1}: Start Date is required`);
    });
  }

  // Projects validation
  if (!formData.projects || formData.projects.length === 0) {
    errors.push("At least one project is required");
  } else {
    formData.projects.forEach((project, index) => {
      if (!project.name?.trim()) errors.push(`Project ${index + 1}: Name is required`);
      if (!project.description?.trim()) errors.push(`Project ${index + 1}: Description is required`);
      if (project.description?.trim().length < 10) errors.push(`Project ${index + 1}: Description must be at least 10 characters`);
      if (!project.technologies || project.technologies.length === 0) errors.push(`Project ${index + 1}: At least one technology is required`);
    });
  }

  // Achievements validation
  if (!formData.achievements || formData.achievements.length === 0) {
    errors.push("At least one achievement is required");
  } else {
    formData.achievements.forEach((achievement, index) => {
      if (!achievement.title?.trim()) errors.push(`Achievement ${index + 1}: Title is required`);
      if (!achievement.description?.trim()) errors.push(`Achievement ${index + 1}: Description is required`);
      if (!achievement.date?.trim()) errors.push(`Achievement ${index + 1}: Date is required`);
      if (!achievement.organization?.trim()) errors.push(`Achievement ${index + 1}: Organization is required`);
    });
  }

  // Languages validation
  if (!formData.languages || formData.languages.length === 0) {
    errors.push("At least one language is required");
  }

  // Social Links validation
  const hasProfileLink = formData.socialLinks?.linkedin || formData.socialLinks?.github || formData.socialLinks?.portfolio;
  if (!hasProfileLink) {
    errors.push("At least one professional social link (LinkedIn, GitHub, or Portfolio) is required");
  }

  return errors;
}

// Test the validation
console.log("=== Profile Creation Validation Test ===");
console.log("");

console.log("1. Testing incomplete profile (should have many errors):");
const incompleteErrors = validateCandidateProfile(incompleteProfile);
console.log(`   Found ${incompleteErrors.length} errors:`);
incompleteErrors.forEach(error => console.log(`   - ${error}`));
console.log("");

console.log("2. Testing complete profile (should have no errors):");
const completeErrors = validateCandidateProfile(completeProfile);
console.log(`   Found ${completeErrors.length} errors:`);
if (completeErrors.length > 0) {
  completeErrors.forEach(error => console.log(`   - ${error}`));
} else {
  console.log("   ✅ Profile is valid and ready for creation!");
}
console.log("");

console.log("=== Test Results ===");
console.log(`Incomplete profile validation: ${incompleteErrors.length > 0 ? '✅ PASS' : '❌ FAIL'} (should fail)`);
console.log(`Complete profile validation: ${completeErrors.length === 0 ? '✅ PASS' : '❌ FAIL'} (should pass)`);
