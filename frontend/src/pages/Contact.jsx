import React from 'react';
import { Mail, Phone, LinkedIn, Twitter } from '@mui/icons-material';

const teamMembers = [
  {
    name: "Rudra yadav",
    // role: "CEO",
    photo: "/team/rudra.png",
    email: "realrudra@raddiRaja.com",
    phone: "+91 63932 76396",
    linkedin: "https://www.linkedin.com/in/rudra-yadav/",
    twitter: "https://x.com/YadavRudra68987"
  },
  {
    name: "Aryan Mittal",
    // role: "COO",
    photo: "/team/aryan.png",
    email: "mittalaryan932@raddiRaja.com",
    phone: "+91 81096 03174",
    linkedin: "https://www.linkedin.com/in/aryan-mittal-911800214/",
    twitter: "https://x.com/mittalaryan932"
  },
  {
    name: "Sanatan Kahemeriya",
    // role: "CTO",
    photo: "/team/sanatan.png",
    email: "sanatan@kachraddiRaju.com",
    phone: "+91 7898009986",
    linkedin: "https://www.linkedin.com/in/sanatank/",
    twitter: "https://twitter.com/mikejohnson"
  },
  {
    name: "Sagar Seth",
    // role: "CMO",
    photo: "/team/sagar.png",
    email: "sagar@raddiRaja.com",
    phone: "+91 98765 43213",
    linkedin: "https://www.linkedin.com/in/sagar-seth-333926287/",
    twitter: "https://twitter.com/sarahlee"
  }
];

const ContactCard = ({ member }) => (
  <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
    <div style={{ position: 'relative', height: '12rem', width: '100%' }}>
      <img src={member.photo} alt={`Photo of ${member.name}`} style={{ objectFit: 'cover', height: '100%', width: '100%' }} />
    </div>
    <div style={{ padding: '1rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>{member.name}</h3>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <a href={`mailto:${member.email}`} style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#374151', textDecoration: 'none' }}>
          <Mail style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
          {member.email}
        </a>
        <a href={`tel:${member.phone}`} style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#374151', textDecoration: 'none' }}>
          <Phone style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
          {member.phone}
        </a>
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#374151', textDecoration: 'none' }}>
          <LinkedIn style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
          LinkedIn
        </a>
        <a href={member.twitter} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#374151', textDecoration: 'none' }}>
          <Twitter style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
          Twitter
        </a>
      </div>
    </div>
  </div>
);

export default function Contact() {
  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '1120px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '3rem', marginTop: '60px' }}>Contact Our Team</h1>
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {teamMembers.map((member) => (
            <ContactCard key={member.email} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}
