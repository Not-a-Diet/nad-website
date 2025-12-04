// --- Interfaces ---

import { RenderSocialIcon } from "../utils/social-icon";

interface SocialLink {
  text: string; 
  url: string;
  social?: string; // e.g. 'email', 'phone', 'whatsapp', 'instagram'
  newTab?: boolean; // The text shown (e.g. "info@notadiet.life")
}

interface ButtonProps {
  text: string;
  type?: string;
}

interface HoursTimings {
  method: string;
  times: Array<{
    day: string;
    hours: string;
  }>;
}

interface HoursData {
  id: number;
  title: string;
  timings: HoursTimings;
}

interface ContactFormData {
  title: string;
  description: string;
  firstNameLabel: string;
  lastNameLabel: string;
  firstNamePlaceholder: string;
  lastNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  privacyPolicyLabel: string;
  submitButton: ButtonProps;
  footer: string;
  // Note: 'Phone' field is present in design but missing in provided API schema.
  // I have omitted it to ensure type safety with your API.
}

interface ContactProps {
    data: {
        title: string;
        description: string;
        contactLinks: SocialLink[];
        hours: HoursData;
        contactForm: ContactFormData;
    }
}

// --- Helper Components ---

/**
 * Hours Card Component
 * Corresponds to 'elements.hours'
 */
const HoursCard = ({ data }: { data: HoursData }) => {
  if (!data) return null;

 // Logic to group consecutive days with the same hours
  const groupedTimings = data.timings.times.reduce((acc, current) => {
    const lastGroup = acc[acc.length - 1];

    if (lastGroup && lastGroup.hours === current.hours) {
      // If hours match the previous day, update the 'endDay' of the current group
      lastGroup.endDay = current.day;
    } else {
      // Otherwise, start a new group
      acc.push({
        startDay: current.day,
        endDay: current.day,
        hours: current.hours,
      });
    }
    return acc;
  }, [] as { startDay: string; endDay: string; hours: string }[]);

  const groupedDays = groupedTimings.map(group => {
    return {
      day: group.startDay === group.endDay ? group.startDay : `${group.startDay} - ${group.endDay}`,
      hours: group.hours,
    };
  });

  const bgClasses = "bg-gradient-to-br from-secondary-100/60 to-tertiary-100/60";
  return (
    <div className={`${bgClasses} relative rounded-3xl p-4 mt-12 border border-secondary-100 border-[4px]`}>
      <h3 className="text-xl font-bold font-sans text-crema mb-6">
        {data.title}
      </h3>
      
      <div className="space-y-2 font-sans text-crema-800">
        {groupedDays.map((item, index) => (  
          <div key={index} className="flex justify-between items-center text-sm sm:text-base">
             {/* Simple logic to group days if needed, otherwise render list */}
            <span className="font-medium">{item.day}:</span>
            <span>{item.hours}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-crema-800">
        {/* Render the method string (e.g. Zoom info) */}
        <span>{data.timings.method}</span>
      </div>
    </div>
  );
};

/**
 * Contact Form Component
 * Corresponds to 'elements.contact-from'
 */
const ContactForm = ({ data }: { data: ContactFormData }) => {
  if (!data) return null;


  return (
    <div className="bg-anti-flash_white h-full w-fit shadow-lg rounded-3xl p-8 md:p-10 border border-crema-200">
      <h3 className="text-lg md:text-xl font-bold font-sans text-crema mb-3">
        {data.title}
      </h3>
      <p className="text-crema-500 mb-8 font-sans">
        {data.description}
      </p>
      <form id="contact-form" className="space-y-6">
        {/* Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="text-sm font-bold text-crema-800 font-sans">
              {data.firstNameLabel}
            </label>
            <input 
              id="firstName"
              type="text"
              required={true} 
              placeholder={data.firstNamePlaceholder}
              className="bg-anti-flash_white-100 border border-crema-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tertiary-500 placeholder:text-crema-500 text-crema"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="text-sm font-bold text-crema-800 font-sans">
              {data.lastNameLabel}
            </label>
            <input 
              id="lastName"
              type="text" 
              required={true}
              placeholder={data.lastNamePlaceholder}
              className="bg-anti-flash_white-100 border border-crema-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tertiary-500 placeholder:text-crema-500 text-crema"
            />
          </div>

        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-bold text-crema-800 font-sans">
            {data.emailLabel}
          </label>
          <input 
            autoComplete="on" 
            id="email"
            type="email"
            required={true} 
            placeholder={data.emailPlaceholder}
            className="bg-anti-flash_white-100 border border-crema-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tertiary-500 placeholder:text-crema-500 text-crema"
          />
        </div>
        {/* Phone */}
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-bold text-crema-800 font-sans">
            {data.phoneLabel}
          </label>
          <input
            id="phone"
            autoComplete="on" 
            type="tel" 
            placeholder={data.phonePlaceholder}
            required={true}
            className="bg-anti-flash_white-100 border border-crema-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tertiary-500 placeholder:text-crema-500 text-crema"
          />
        </div>

        {/* Note: The design has a "Telefono" field here, but the API Schema provided 
           does not include a phone attribute for the contact form. 
           I have omitted it to match the Schema. */}

        {/* Message */}
        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-sm font-bold text-crema-800 font-sans">
            {data.messageLabel}
          </label>
          <textarea
            id="message" 
            placeholder={data.messagePlaceholder}
            rows={4}
            required={true}
            className="bg-anti-flash_white-100 border border-crema-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tertiary-500 placeholder:text-crema-500 text-crema resize-none"
          />
        </div>

        {/* Privacy Checkbox */}
        <div className="flex items-start gap-2 mt-2">
          <input 
            type="checkbox" 
            id="privacy"
            required={true} 
            className="mt-1 w-4 h-4 text-tertiary-500 rounded border-gray-300 focus:ring-tertiary-500"
          />
          <label htmlFor="privacy" className="text-sm text-crema-500 font-sans leading-tight mt-1">
            {data.privacyPolicyLabel}
          </label>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-tertiary-100 hover:bg-tertiary-500 text-crema-800 font-bold py-3 px-6 rounded-lg transition-colors duration-300 mt-4 flex justify-center items-center gap-2"
        >
          {data.submitButton?.text || "Submit"}
        </button>
        
        {/* Footer */}
        {data.footer && (
          <p className="text-center text-sm text-crema-500 mt-4">
            {data.footer}
          </p>
        )}
      </form>
    </div>
  );
};

// --- Main Component ---

export default function Contact({ data }: ContactProps) {
  const
    {
      title,
      description,
      contactLinks,
      hours,
      contactForm
    } = data;

  const getIconStyle = (index: number) => {
    const styles = [
      { bg: 'bg-secondary-100', text: 'text-secondary-500' }, // Email (Green)
      { bg: 'bg-primary-100', text: 'text-primary' },       // Phone (Orange)
      { bg: 'bg-tertiary-100', text: 'text-tertiary' },     // WhatsApp (Yellow)
      { bg: 'bg-quaternary-100', text: 'text-quaternary' }, // Instagram (Cyan)
    ];
    return styles[index % styles.length];
  };

  return (
    <section className="bg-anti-flash_white py-16 px-4 md:px-8 lg:px-16 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-8 items-center lg:flex-row lg:justify-between lg:items-center">
        
        {/* Left Column: Info & Hours */}
        <div className="flex flex-col">
    

          {/* Title & Desc */}
          <h2 className="text-2xl lg:text-4xl font-bold text-crema mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-lg text-crema-500 mb-10 max-w-md">
            {description}
          </p>

          {/* Social Links List */}
          <div className="flex flex-col gap-6 mb-4">
            {contactLinks && contactLinks.map((link, index) => {
              const style = getIconStyle(index);
              return (
              <a href={link.url} key={index} target={link.newTab ? "_blank" : "_self"} rel="noopener noreferrer">
                <div key={index} className="flex items-center gap-4 group cursor-pointer lg:w-2/3 hover:scale-105 transition-transform">
                  {/* Icon Container */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.bg} ${style.text} transition-transform group-hover:scale-105`}>
                     {/* User specified "social icons and render are already defined".
                        Assuming 'link.iconName' or similar is passed to a generic Icon component here.
                        For now, rendering a placeholder visual.
                     */}
                     <RenderSocialIcon social={link.social} />
                     <span className="material-icons text-2xl">
                       {/* Placeholder for icon rendering logic */}
                     </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="font-bold text-crema text-lg leading-none mb-1">
                      {link.text}
                    </span>
                  </div>
                </div>
              </a>
              );
            })}
          </div>

          
          {/* Hours Component */}
          {hours && (
            <HoursCard data={hours} />
          )}

        </div>

        {/* Right Column: Contact Form */}
        <div className="h-full">
          {contactForm && (
            <ContactForm data={contactForm} />
          )}
        </div>

      </div>
    </section>
  );
}