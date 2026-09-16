import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import ResumeData from './ResumeData';
import './Resume.css';

const renderSummary = (summary) => {
  const parts = summary.split(/\{\{(.+?)\}\}/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="emphasis">{part}</strong> : part
  );
};

const Resume = () => {
  const data = ResumeData;

  return (
    <div className="resume-page">
      <div className="resume-toolbar no-print">
        <Link className="resume-back-link" to="/">&larr; back to site</Link>
        <a
          className="resume-print-button"
          href="/assets/Nate-Sheridan-Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Resume (PDF)
        </a>
      </div>

      <div className="resume-sheet">
        <div className="resume-col-main">
          <header className="resume-header">
            <h1 className="resume-name">{data.name}</h1>
            <h2 className="resume-title">{data.title}</h2>
            <p className="resume-summary">
              <em className="resume-tagline">{data.tagline}</em> {'–'} {renderSummary(data.summary)}
            </p>
          </header>

          <section className="resume-section">
            <h3 className="resume-section-title">Experience</h3>
            {data.experience.map((job, i) => (
              <div className="resume-job" key={i}>
                <p className="resume-job-title">
                  <span className="resume-company">{job.company}</span> {'–'}{' '}
                  <span className="resume-role">{job.role}</span>
                </p>
                <p className="resume-dates">{job.dates}</p>
                <ul className="resume-bullets">
                  {job.bullets.map((bullet, j) => (
                    <li key={j}>{bullet}</li>
                  ))}
                </ul>
                {job.techStack && (
                  <p className="resume-tech-stack">Tech Stack: {job.techStack}</p>
                )}
              </div>
            ))}
          </section>

          <section className="resume-section">
            <h3 className="resume-section-title">Educational Projects</h3>
            <div className="resume-projects">
              {data.educationalProjects.map((project, i) => (
                <div className="resume-project" key={i}>
                  <p className="resume-project-name">{project.name} {'–'} {project.type}</p>
                  <p className="resume-project-date">{project.date}</p>
                  {project.description.map((line, j) => (
                    <p className="resume-project-desc" key={j}>{line}</p>
                  ))}
                  <p className="resume-project-tech"><strong>Tech Used:</strong> {project.techUsed}</p>
                  <a
                    className="resume-project-link"
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub aria-hidden="true" /> view code on github
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="resume-col-side">
          <section className="resume-section">
            <h3 className="resume-section-title">Contact</h3>
            <p className="resume-contact-line">{data.contact.phone}</p>
            <p className="resume-contact-line">{data.contact.email}</p>
            <a className="resume-contact-line resume-link" href={data.contact.siteUrl} target="_blank" rel="noopener noreferrer">
              {data.contact.site}
            </a>
            <div className="resume-social-icons">
              <a href={data.contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </section>

          <section className="resume-section">
            <h3 className="resume-section-title">Skillset</h3>
            <ul className="resume-pill-list">
              {data.skillset.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>

          <section className="resume-section">
            <h3 className="resume-section-title">Technologies</h3>
            <ul className="resume-pill-list">
              {data.technologies.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>

          <section className="resume-section">
            <h3 className="resume-section-title">Tools</h3>
            <ul className="resume-pill-list">
              {data.tools.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>

          <section className="resume-section">
            <h3 className="resume-section-title">Education</h3>
            <p className="resume-school">{data.education.school}</p>
            <p className="resume-program">{data.education.program}</p>
            <p className="resume-edu-range">
              {data.education.startDate.month} {data.education.startDate.year}
              <span className="resume-edu-arrow">{'→'}</span>
              {data.education.endDate.month} {data.education.endDate.year}
            </p>
          </section>
        </aside>

        <footer className="resume-footer">
          <p className="resume-footer-name">{data.name}</p>
          <a className="resume-footer-link" href={data.contact.siteUrl} target="_blank" rel="noopener noreferrer">
            {data.contact.site}
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Resume;
