"use client"

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { getStrapiMedia } from "../utils/api-helpers";
import { specializationLabels, type Dietitian } from "../utils/dietitians";
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

interface BookingCalendarData {
  bookingTitle?: string;
  personLabel?: string;
  locationLabel?: string;
  selectPersonPlaceholder?: string;
  selectLocationPlaceholder?: string;
  viewCalendarButtonText?: string;
  backButtonText?: string;
}

interface ContactProps {
  lang?: string;
  data: {
    dietitians?: Dietitian[];
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

const BookingSelector = ({ data, dietitians, lang }: { data: BookingCalendarData; dietitians: Dietitian[]; lang: string }) => {
  const {
    bookingTitle = "Book your appointment",
    personLabel = "Person",
    locationLabel = "Location",
    selectPersonPlaceholder = "Select a person",
    selectLocationPlaceholder = "Select a location",
    viewCalendarButtonText = "View Calendar",
    backButtonText = "Back",
  } = data;

  const [selectedPerson, setSelectedPerson] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [view, setView] = useState<'selection' | 'calendar'>('selection');

  const currentEmbedUrl = useMemo(() => {
    if (selectedPerson === null || selectedLocation === null) return "";
    if (!dietitians[selectedPerson]?.bookingLocations?.[selectedLocation]) return "";
    return dietitians[selectedPerson].bookingLocations?.[selectedLocation]?.embedUrl ?? "";
  }, [selectedPerson, selectedLocation, dietitians]);

  if (!dietitians.length) return null;

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
  const isFormValid = Boolean(currentEmbedUrl);
  const selectedProfile = selectedPerson === null ? undefined : dietitians[selectedPerson];
  const profilePhoto = getStrapiMedia(selectedProfile?.profilePhoto?.url);
  const profilePreview = selectedProfile ? (
    <div className="flex min-w-0 flex-col gap-4 rounded-2xl bg-white p-4 sm:flex-row" aria-live="polite">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-secondary-100">
        {profilePhoto ? <Image src={profilePhoto} alt={selectedProfile.profilePhoto?.alternativeText || selectedProfile.name} fill sizes="96px" className="object-cover" /> : <span className="flex h-full items-center justify-center text-3xl font-bold text-secondary-700">{selectedProfile.name.charAt(0)}</span>}
      </div>
      <div className="min-w-0">
        <h4 className="text-xl font-bold text-crema-900">{selectedProfile.name}</h4>
        <p className="mb-2 text-sm font-semibold text-secondary-700">{selectedProfile.role}</p>
        {selectedProfile.shortBio && <p className="mb-2 text-sm leading-6 text-crema-700">{selectedProfile.shortBio}</p>}
        <ul className="mb-3 flex flex-wrap gap-2">
          {specializationLabels(selectedProfile.specializations).slice(0, 3).map(label => <li key={label} className="rounded-full bg-secondary-100/60 px-3 py-1 text-xs text-crema-800">{label}</li>)}
        </ul>
        <Link href={`/${lang}/team/${selectedProfile.slug}`} className="font-bold text-primary underline underline-offset-4">
          {lang === "it" ? "Scopri di più" : lang === "pt" ? "Saiba mais" : "Know more"}<span aria-hidden="true"> →</span>
        </Link>
      </div>
    </div>
  ) : null;

  if (view === 'calendar' && currentEmbedUrl) {
    return (
      <div className="flex flex-col gap-6">
        <h3 className="text-2xl lg:text-3xl lg:text-right w-full font-bold text-black leading-tight">
          {bookingTitle}
        </h3>

        {profilePreview}
        <div className="rounded-3xl overflow-hidden border-secondary-100 border-[4px] bg-white animate-slide-in-right">
          <iframe
            src={currentEmbedUrl}
            style={{ border: 0 }}
            width="100%"
            height="700"
            title={`Booking calendar for ${dietitians[selectedPerson!]?.name} - ${dietitians[selectedPerson!]?.bookingLocations?.[selectedLocation!]?.name}`}
          />
        </div>

        <button
          onClick={handleBack}
          className={`group w-fit inline-flex items-center gap-2 ${bgClasses} rounded-xl px-8 py-3 text-crema-800 font-semibold border-secondary-100 border-[3px] hover:scale-105 active:scale-95 transition-transform cursor-pointer`}
        >
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 transition-transform group-hover:-translate-x-[3px]"
          >
            <path d="M19 12 H5" />
            <path d="M11 5 l-7 7 l7 7" />
          </svg>
          {backButtonText}
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
                {dietitians.map((person, index) => (
                  <option key={index} value={index}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>

            {profilePreview}
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
                {selectedPerson !== null && dietitians[selectedPerson]?.bookingLocations?.map((location, index) => (
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

export default function Contact({ data, lang = "en" }: ContactProps) {
  const {
    title,
    description,
    contactLinks,
    hours,
    bookingCalendar,
  } = data;

  const bookableDietitians = (data.dietitians ?? [])
    .filter(person => person.bookingEnabled && person.bookingLocations?.length);

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
    <section id="contact" className="bg-anti-flash_white py-20 px-2 md:px-8 lg:px-16 lg:py-24 font-sans">
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
            <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-col lg:gap-6 mb-4">
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
              <BookingSelector data={bookingCalendar} dietitians={bookableDietitians} lang={lang} />
            </div>
          )}

      </div>
    </section>
  );
}
