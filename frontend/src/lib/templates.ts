export type TemplateType = 'blank' | 'essay' | 'notes' | 'journal' | 'meeting-notes';

interface Template {
    title: string;
    content: string;
}

export const generateTemplate = (templateName: TemplateType): Template => {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const templates: Record<TemplateType, Template> = {
        blank: {
            title: 'Untitled Document',
            content: '',
        },

        essay: {
            title: 'Title of Your Essay',
            content: `
        <h1 style="text-align: center; font-family: 'Source Serif 4', Georgia, serif; font-weight: bold; margin-bottom: 2rem;">Title of Your Essay</h1>
        
        <h2 style="color: #0057D8; margin-top: 2rem; margin-bottom: 1rem;">Introduction</h2>
        <p style="line-height: 1.8;">Start with a compelling opening that introduces your topic and sets the tone.</p>
        
        <h2 style="color: #0057D8; margin-top: 2rem; margin-bottom: 1rem;">Body Paragraphs</h2>
        <p style="line-height: 1.8;">Use clear arguments, transitions, and supporting evidence. Keep paragraphs focused and readable.</p>
        
        <h2 style="color: #0057D8; margin-top: 2rem; margin-bottom: 1rem;">Conclusion</h2>
        <p style="line-height: 1.8;">Summarize key points and leave the reader with something meaningful to think about.</p>
      `,
        },

        notes: {
            title: 'Quick Notes',
            content: `
        <h1 style="margin-bottom: 1.5rem;">Quick Notes</h1>
        
        <ul style="line-height: 1.7;">
          <li>Write your ideas here</li>
          <li>Add bullet points</li>
          <li>Capture quick thoughts</li>
          <li>Keep track of tasks or reminders</li>
        </ul>
      `,
        },

        journal: {
            title: `Daily Journal — ${today}`,
            content: `
        <h1 style="margin-bottom: 2rem;">Daily Journal — ${today}</h1>
        
        <h2 style="color: #0057D8; margin-top: 2rem; margin-bottom: 1rem;">Gratitude</h2>
        <p style="line-height: 1.8;">Write three things you are grateful for today.</p>
        
        <h2 style="color: #0057D8; margin-top: 2rem; margin-bottom: 1rem;">Reflection</h2>
        <p style="line-height: 1.8;">How did today feel? What stood out? What challenged you?</p>
        
        <h2 style="color: #0057D8; margin-top: 2rem; margin-bottom: 1rem;">Intentions</h2>
        <p style="line-height: 1.8;">What is one thing you want to focus on tomorrow?</p>
      `,
        },

        'meeting-notes': {
            title: 'Meeting Notes',
            content: `
        <h1 style="margin-bottom: 1.5rem;">Meeting Notes — Project/Topic</h1>
        
        <p><strong>Date:</strong> ${today}</p>
        <p><strong>Attendees:</strong> ____________________</p>
        
        <h2 style="color: #0057D8; margin-top: 2rem; margin-bottom: 1rem;">Agenda</h2>
        <ul style="line-height: 1.7;">
          <li>Point 1</li>
          <li>Point 2</li>
          <li>Point 3</li>
        </ul>
        
        <h2 style="color: #0057D8; margin-top: 2rem; margin-bottom: 1rem;">Discussion</h2>
        <p style="line-height: 1.8;">Write key decisions, open questions, and talking points here.</p>
        
        <h2 style="color: #0057D8; margin-top: 2rem; margin-bottom: 1rem;">Action Items</h2>
        <ul style="line-height: 1.7;">
          <li>☐ Task 1 — Owner</li>
          <li>☐ Task 2 — Owner</li>
          <li>☐ Task 3 — Owner</li>
        </ul>
      `,
        },
    };

    return templates[templateName];
};
