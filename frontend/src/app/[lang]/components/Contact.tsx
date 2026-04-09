"use client"

import { useState, useMemo } from "react";
import { RenderSocialIcon } from "../utils/social-icon";

interface SocialLink {
  text: string;
  url: string;
  social?: string;
  newTab?: boolean;
}

interface Location {
  address: string;
}

interface HoursData {
  id: number;
  title: string;
  description?: string;
  locations?: Location[];
}

interface BookingLocation {
  name: string;
  embedUrl: string;
  isDefault?: boolean;
}

interface BookingPerson {
  name: string;
  locations: BookingLocation[];
}

interface BookingCalendarData {
  bookingTitle?: string;
  persons: BookingPerson[];
  personLabel?: string;
  locationLabel?: string;
  selectPersonPlaceholder?: string;
  selectLocationPlaceholder?: string;
  noSelectionMessage?: string;
  viewCalendarButtonText?: string;
  backButtonText?: string;
}

interface ContactProps {
  data: {
    title: string;
    description: string;
    contactLinks: SocialLink[];
    hours: HoursData;
    bookingCalendar?: BookingCalendarData;
  }
}

const HoursCard = ({ data }: { data: HoursData }) => {
  if (!data) return null;

  const bgClasses = "bg-gradient-to-br from-secondary-100/60 to-tertiary-100/60";
  return (
    <div className={`${bgClasses} relative rounded-3xl p-4 lg:mt-12 border-secondary-100 border-[4px]`}>
      <h3 className="text-xl font-bold font-sans text-crema mb-2">
        {data.title}
      </h3>

      {data.description && (
        <p className="text-sm text-crema-800 mb-4">
          {data.description}
        </p>
      )}

      {data.locations && data.locations.length > 0 && (
        <div className="space-y-2 font-sans">
          {data.locations.map((location, index) => (
            <a
              key={index}
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm sm:text-base text-crema-800 hover:text-secondary transition-colors underline decoration-crema-400 hover:decoration-secondary"
            >
              {location.address}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const BookingSelector = ({ data }: { data: BookingCalendarData }) => {
  const {
    bookingTitle = "Book your appointment",
    persons = [],
    personLabel = "Person",
    locationLabel = "Location",
    selectPersonPlaceholder = "Select a person",
    selectLocationPlaceholder = "Select a location",
    viewCalendarButtonText = "View Calendar",
    backButtonText = "Back",
  } = data;

  if (!persons.length) return null;

  const [selectedPerson, setSelectedPerson] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [view, setView] = useState<'selection' | 'calendar'>('selection');

  const currentEmbedUrl = useMemo(() => {
    if (selectedPerson === null || selectedLocation === null) return "";
    if (!persons[selectedPerson]?.locations[selectedLocation]) return "";
    return persons[selectedPerson].locations[selectedLocation].embedUrl;
  }, [selectedPerson, selectedLocation, persons]);

  const handlePersonChange = (index: number) => {
    setSelectedPerson(index);
    setSelectedLocation(null);
  };

  const handleLocationChange = (index: number) => {
    setSelectedLocation(index);
  };

  const handleViewCalendar = () => {
    setView('calendar');
  };

  const handleBack = () => {
    setView('selection');
  };

  const bgClasses = "bg-gradient-to-br from-secondary-100/60 to-tertiary-100/60";
  const isFormValid = selectedPerson !== null && selectedLocation !== null;

  if (view === 'calendar' && currentEmbedUrl) {
    return (
      <div className="flex flex-col gap-6">
        <h3 className="text-2xl lg:text-3xl lg:text-right w-full font-bold text-black leading-tight">
          {bookingTitle}
        </h3>

        <div className="rounded-3xl overflow-hidden border-secondary-100 border-[4px] bg-white animate-slide-in-right">
          <iframe
            src={currentEmbedUrl}
            style={{ border: 0 }}
            width="100%"
            height="700"
            frameBorder="0"
            title={`Booking calendar for ${persons[selectedPerson!]?.name} - ${persons[selectedPerson!]?.locations[selectedLocation!]?.name}`}
          />
        </div>

        <button
          onClick={handleBack}
          className={`w-fit ${bgClasses} rounded-xl px-8 py-3 text-crema-800 font-semibold border-secondary-100 border-[3px] hover:scale-105 active:scale-95 transition-transform cursor-pointer`}
        >
          ← {backButtonText}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      <h3 className="text-2xl lg:text-3xl lg:text-right w-full font-bold text-black leading-tight">
        {bookingTitle}
      </h3>

      <div className="w-full">
        <div className={`${bgClasses} relative rounded-3xl p-6 border-secondary-100 border-[4px]`}>
          <div className="space-y-6">

            <div className="flex flex-col gap-2">
              <label htmlFor="person-select" className="text-sm font-semibold text-crema-800">
                {personLabel}
              </label>
              <select
                id="person-select"
                value={selectedPerson ?? ""}
                onChange={(e) => handlePersonChange(Number(e.target.value))}
                className="w-full rounded-xl border-2 border-secondary-200 bg-white px-4 py-3 text-crema-800 font-medium focus:border-secondary-400 focus:outline-none focus:ring-2 focus:ring-secondary-200 transition-colors cursor-pointer appearance-none"
              >
                <option value="" disabled>
                  {selectPersonPlaceholder}
                </option>
                {persons.map((person: BookingPerson, index: number) => (
                  <option key={index} value={index}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="location-select" className="text-sm font-semibold text-crema-800">
                {locationLabel}
              </label>
              <select
                id="location-select"
                value={selectedLocation ?? ""}
                onChange={(e) => handleLocationChange(Number(e.target.value))}
                disabled={selectedPerson === null}
                className="w-full rounded-xl border-2 border-secondary-200 bg-white px-4 py-3 text-crema-800 font-medium focus:border-secondary-400 focus:outline-none focus:ring-2 focus:ring-secondary-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
              >
                <option value="" disabled>
                  {selectLocationPlaceholder}
                </option>
                {selectedPerson !== null && persons[selectedPerson]?.locations.map((location: BookingLocation, index: number) => (
                  <option key={index} value={index}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </div>

      <button
        onClick={handleViewCalendar}
        disabled={!isFormValid}
        className={`w-full rounded-xl px-6 py-4 text-lg font-bold transition-all cursor-pointer ${
          isFormValid
            ? 'bg-secondary text-white hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg'
            : 'bg-crema-200 text-crema-500 cursor-not-allowed'
        }`}
      >
        {viewCalendarButtonText}
      </button>

    </div>
  );
};

export default function Contact({ data }: ContactProps) {
  const {
    title,
    description,
    contactLinks,
    hours,
    bookingCalendar,
  } = data;

  const getIconStyle = (index: number) => {
    const styles = [
      { bg: 'bg-secondary/15', text: 'text-secondary' },
      { bg: 'bg-primary-100', text: 'text-primary' },
      { bg: 'bg-tertiary-100', text: 'text-tertiary' },
      { bg: 'bg-quaternary-100', text: 'text-quaternary' },
    ];
    return styles[index % styles.length];
  };

  return (
    <section id="contact" className="bg-anti-flash_white py-12 p-2 md:px-8 lg:px-16 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row">

        <div className="flex lg:flex-col lg:w-1/3">

        <div className="flex flex-col w-auto gap-8 lg:items-start lg:gap-12">

         <div>
        <h2 className="text-2xl text-center lg:text-left lg:text-4xl font-bold text-crema mb-6 leading-tight">
          {title}
        </h2>
        <p className="text-lg text-center lg:text-left text-crema-500 mb-10 max-w-md">
          {description}
        </p>
        </div>

          <div className="w-full flex-col lg:flex-col">
            <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-col gap-6 mb-4">
              {contactLinks && contactLinks.map((link, index) => {
                const style = getIconStyle(index);
                return (
                  <a href={link.url} key={index} target={link.newTab ? "_blank" : "_self"} rel="noopener noreferrer">
                    <div className="flex items-center gap-4 group cursor-pointer lg:w-2/3 hover:scale-105 transition-transform">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.bg} ${style.text} transition-transform group-hover:scale-105`}>
                        <RenderSocialIcon social={link.social} />
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

            {hours && (
              <HoursCard data={hours} />
            )}
          </div>

        </div>


        </div>
          {bookingCalendar && (
            <div className="w-full pt-6 lg:pt-0 lg:pl-20 lg:w-2/3">
              <BookingSelector data={bookingCalendar} />
            </div>
          )}

      </div>
    </section>
  );
}
