import React from 'react';

const teamMembers = [
  {
    name: "Dev Dharrshan S",
    role: "CEO",
    title: "Head of Innovation & Technology",
  },
  {
    name: "Avaneesh R",
    role: "CTO",
    title: "Lead Mobile Application Architect",
  },
  {
    name: "Arvind",
    role: "CDO",
    title: "Head of UI/UX & Product Design",
  },
  {
    name: "Anusree D",
    role: "CAIO",
    title: "Head of AI Research & Automation",
  },
  {
    name: "Karupuchaamy Aishwarya",
    role: "CCO",
    title: "Brand Strategy & Creative Director",
  },
  {
    name: "Divya Dharshini S",
    role: "CMO",
    title: "Head of Digital Growth & Client Relations",
  },
];

export default function TeamShowcase() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Leadership Team
          </h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {teamMembers.map((member, index) => (
            <div key={index} className="group relative p-8 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500/50 transition-all duration-300 bg-slate-50/50 dark:bg-slate-900/50 hover:shadow-xl">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {member.name} <span className="text-lg font-medium text-slate-500 dark:text-slate-400">({member.role})</span>
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium border-t border-slate-200 dark:border-slate-800 pt-4 mt-4">
                {member.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
