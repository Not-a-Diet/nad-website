import type { Attribute, Schema } from '@strapi/strapi';

export interface ElementsBookingCalendar extends Schema.Component {
  collectionName: 'components_elements_booking_calendars';
  info: {
    description: 'Person/location selector with Google Calendar embed';
    displayName: 'Booking Calendar';
  };
  attributes: {
    backButtonText: Attribute.String & Attribute.DefaultTo<'Back'>;
    bookingTitle: Attribute.String &
      Attribute.DefaultTo<'Book your appointment'>;
    locationLabel: Attribute.String & Attribute.DefaultTo<'Location'>;
    noSelectionMessage: Attribute.Text &
      Attribute.DefaultTo<'Please select a person and location to view available times.'>;
    personLabel: Attribute.String & Attribute.DefaultTo<'Person'>;
    persons: Attribute.Component<'elements.booking-person', true>;
    selectLocationPlaceholder: Attribute.String &
      Attribute.DefaultTo<'Select a location'>;
    selectPersonPlaceholder: Attribute.String &
      Attribute.DefaultTo<'Select a person'>;
    viewCalendarButtonText: Attribute.String &
      Attribute.DefaultTo<'View Calendar'>;
  };
}

export interface ElementsBookingLocation extends Schema.Component {
  collectionName: 'components_elements_booking_locations';
  info: {
    description: 'A location with its Google Calendar embed URL';
    displayName: 'Booking Location';
  };
  attributes: {
    embedUrl: Attribute.String & Attribute.Required;
    isDefault: Attribute.Boolean & Attribute.DefaultTo<false>;
    name: Attribute.String & Attribute.Required;
  };
}

export interface ElementsBookingPerson extends Schema.Component {
  collectionName: 'components_elements_booking_persons';
  info: {
    description: 'A person with their locations and calendar embed URLs';
    displayName: 'Booking Person';
  };
  attributes: {
    locations: Attribute.Component<'elements.booking-location', true>;
    name: Attribute.String & Attribute.Required;
  };
}

export interface ElementsContactForm extends Schema.Component {
  collectionName: 'components_elements_contact_forms';
  info: {
    description: '';
    displayName: 'Contact form';
  };
  attributes: {
    description: Attribute.Text;
    emailLabel: Attribute.String;
    emailPlaceholder: Attribute.String;
    firstNameLabel: Attribute.String;
    firstNamePlaceholder: Attribute.String;
    footer: Attribute.Text;
    lastNameLabel: Attribute.String;
    lastNamePlaceholder: Attribute.String;
    messageLabel: Attribute.String;
    messagePlaceholder: Attribute.String;
    phoneLabel: Attribute.String;
    phonePlaceholder: Attribute.String;
    privacyPolicyLabel: Attribute.Text;
    submitButton: Attribute.Component<'links.button'>;
    title: Attribute.String;
  };
}

export interface ElementsFeature extends Schema.Component {
  collectionName: 'components_elements_features';
  info: {
    description: '';
    displayName: 'Feature';
  };
  attributes: {
    color: Attribute.Enumeration<
      ['primary', 'secondary', 'tertiary', 'quaternary']
    >;
    description: Attribute.Text;
    descriptionList: Attribute.Text;
    media: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    newTab: Attribute.Boolean & Attribute.DefaultTo<false>;
    showLink: Attribute.Boolean & Attribute.DefaultTo<false>;
    text: Attribute.String;
    title: Attribute.String;
    url: Attribute.String;
  };
}

export interface ElementsFeatureColumn extends Schema.Component {
  collectionName: 'components_slices_feature_columns';
  info: {
    description: '';
    displayName: 'Feature column';
    icon: 'align-center';
    name: 'FeatureColumn';
  };
  attributes: {
    description: Attribute.Text;
    icon: Attribute.Media<'images'> & Attribute.Required;
    title: Attribute.String & Attribute.Required;
  };
}

export interface ElementsFeatureRow extends Schema.Component {
  collectionName: 'components_slices_feature_rows';
  info: {
    description: '';
    displayName: 'Feature row';
    icon: 'arrows-alt-h';
    name: 'FeatureRow';
  };
  attributes: {
    description: Attribute.Text;
    link: Attribute.Component<'links.link'>;
    media: Attribute.Media<'images' | 'videos'> & Attribute.Required;
    title: Attribute.String & Attribute.Required;
  };
}

export interface ElementsFooterSection extends Schema.Component {
  collectionName: 'components_links_footer_sections';
  info: {
    displayName: 'Footer section';
    icon: 'chevron-circle-down';
    name: 'FooterSection';
  };
  attributes: {
    links: Attribute.Component<'links.link', true>;
    title: Attribute.String;
  };
}

export interface ElementsHours extends Schema.Component {
  collectionName: 'components_elements_hours';
  info: {
    description: 'Business hours with title, description, and physical locations';
    displayName: 'Hours';
  };
  attributes: {
    description: Attribute.Text;
    locations: Attribute.Component<'elements.location', true>;
    title: Attribute.String;
  };
}

export interface ElementsLocation extends Schema.Component {
  collectionName: 'components_elements_locations';
  info: {
    description: 'A physical location address that links to Google Maps';
    displayName: 'Location';
  };
  attributes: {
    address: Attribute.String & Attribute.Required;
  };
}

export interface ElementsLogos extends Schema.Component {
  collectionName: 'components_elements_logos';
  info: {
    displayName: 'Logos';
    icon: 'apple-alt';
    name: 'logos';
  };
  attributes: {
    logo: Attribute.Media<'images'>;
    title: Attribute.String;
  };
}

export interface ElementsNotificationBanner extends Schema.Component {
  collectionName: 'components_elements_notification_banners';
  info: {
    description: '';
    displayName: 'Notification banner';
    icon: 'exclamation';
    name: 'NotificationBanner';
  };
  attributes: {
    heading: Attribute.String & Attribute.Required;
    link: Attribute.Component<'links.link'>;
    show: Attribute.Boolean & Attribute.DefaultTo<false>;
    text: Attribute.Text & Attribute.Required;
    type: Attribute.Enumeration<['alert', 'info', 'warning']> &
      Attribute.Required;
  };
}

export interface ElementsPhilosophyItem extends Schema.Component {
  collectionName: 'components_elements_philosophy_items';
  info: {
    description: 'A title and description pair for philosophy lists';
    displayName: 'Philosophy Item';
    icon: 'bulletList';
  };
  attributes: {
    description: Attribute.Text;
    title: Attribute.String & Attribute.Required;
  };
}

export interface ElementsPlan extends Schema.Component {
  collectionName: 'components_elements_plans';
  info: {
    description: '';
    displayName: 'Pricing plan';
    icon: 'search-dollar';
    name: 'plan';
  };
  attributes: {
    description: Attribute.Text;
    isRecommended: Attribute.Boolean;
    name: Attribute.String;
    price: Attribute.Decimal;
    pricePeriod: Attribute.String;
    product_features: Attribute.Relation<
      'elements.plan',
      'oneToMany',
      'api::product-feature.product-feature'
    >;
  };
}

export interface ElementsTeamMember extends Schema.Component {
  collectionName: 'components_elements_team_members';
  info: {
    description: '';
    displayName: 'Team Member';
  };
  attributes: {
    description: Attribute.Text;
    name: Attribute.String;
    occupation: Attribute.String;
    profilePhoto: Attribute.Media<'images' | 'videos' | 'audios' | 'files'>;
    skills: Attribute.Text;
  };
}

export interface ElementsTestimonial extends Schema.Component {
  collectionName: 'components_slices_testimonials';
  info: {
    description: '';
    displayName: 'Testimonial';
    icon: 'user-check';
    name: 'Testimonial';
  };
  attributes: {
    authorName: Attribute.String & Attribute.Required;
    picture: Attribute.Media<'images'> & Attribute.Required;
    text: Attribute.Text & Attribute.Required;
  };
}

export interface LayoutFooter extends Schema.Component {
  collectionName: 'components_layout_footers';
  info: {
    description: '';
    displayName: 'Footer';
  };
  attributes: {
    categories: Attribute.Relation<
      'layout.footer',
      'oneToMany',
      'api::category.category'
    >;
    description: Attribute.Text;
    footerLogo: Attribute.Component<'layout.logo'>;
    legalLinks: Attribute.Component<'links.link', true>;
    menuLinks: Attribute.Component<'links.link', true>;
    socialLinks: Attribute.Component<'links.social-link', true>;
  };
}

export interface LayoutLogo extends Schema.Component {
  collectionName: 'components_layout_logos';
  info: {
    description: '';
    displayName: 'Logo';
  };
  attributes: {
    logoImg: Attribute.Media<'images' | 'files' | 'videos' | 'audios'> &
      Attribute.Required;
    logoText: Attribute.String;
  };
}

export interface LayoutNavbar extends Schema.Component {
  collectionName: 'components_layout_navbars';
  info: {
    description: '';
    displayName: 'Navbar';
    icon: 'map-signs';
    name: 'Navbar';
  };
  attributes: {
    button: Attribute.Component<'links.button-link'>;
    links: Attribute.Component<'links.link', true>;
    navbarLogo: Attribute.Component<'layout.logo'>;
  };
}

export interface LinksButton extends Schema.Component {
  collectionName: 'components_links_simple_buttons';
  info: {
    description: '';
    displayName: 'Button';
    icon: 'fingerprint';
    name: 'Button';
  };
  attributes: {
    text: Attribute.String;
    type: Attribute.Enumeration<['primary', 'secondary']>;
  };
}

export interface LinksButtonLink extends Schema.Component {
  collectionName: 'components_links_buttons';
  info: {
    description: '';
    displayName: 'Button link';
    icon: 'fingerprint';
    name: 'Button-link';
  };
  attributes: {
    newTab: Attribute.Boolean & Attribute.DefaultTo<false>;
    text: Attribute.String;
    type: Attribute.Enumeration<['primary', 'secondary']>;
    url: Attribute.String;
  };
}

export interface LinksLink extends Schema.Component {
  collectionName: 'components_links_links';
  info: {
    description: '';
    displayName: 'Link';
    icon: 'link';
    name: 'Link';
  };
  attributes: {
    newTab: Attribute.Boolean & Attribute.DefaultTo<false>;
    text: Attribute.String & Attribute.Required;
    url: Attribute.String & Attribute.Required;
  };
}

export interface LinksSocialLink extends Schema.Component {
  collectionName: 'components_links_social_links';
  info: {
    description: '';
    displayName: 'Social Link';
  };
  attributes: {
    newTab: Attribute.Boolean & Attribute.DefaultTo<false>;
    social: Attribute.Enumeration<
      [
        'YOUTUBE',
        'TWITTER',
        'WEBSITE',
        'LINKEDIN',
        'INSTAGRAM',
        'TIKTOK',
        'WHATSAPP',
        'PHONE',
        'EMAIL'
      ]
    >;
    text: Attribute.String & Attribute.Required;
    url: Attribute.String & Attribute.Required;
  };
}

export interface MetaMetadata extends Schema.Component {
  collectionName: 'components_meta_metadata';
  info: {
    description: '';
    displayName: 'Metadata';
    icon: 'robot';
    name: 'Metadata';
  };
  attributes: {
    metaDescription: Attribute.Text & Attribute.Required;
    metaTitle: Attribute.String & Attribute.Required;
  };
}

export interface SectionsBookingCalendar extends Schema.Component {
  collectionName: 'components_sections_booking_calendars';
  info: {
    description: 'Google Calendar appointment scheduling with person/location selector';
    displayName: 'Booking Calendar';
  };
  attributes: {
    defaultLocationIndex: Attribute.Integer & Attribute.DefaultTo<0>;
    defaultPersonIndex: Attribute.Integer & Attribute.DefaultTo<0>;
    description: Attribute.Text;
    persons: Attribute.Component<'elements.booking-person', true>;
    title: Attribute.String;
  };
}

export interface SectionsBottomActions extends Schema.Component {
  collectionName: 'components_slices_bottom_actions';
  info: {
    description: '';
    displayName: 'Bottom actions';
    icon: 'angle-double-right';
    name: 'BottomActions';
  };
  attributes: {
    buttons: Attribute.Component<'links.button-link', true>;
    description: Attribute.Text;
    title: Attribute.String;
  };
}

export interface SectionsContact extends Schema.Component {
  collectionName: 'components_sections_contacts';
  info: {
    description: '';
    displayName: 'Contact';
  };
  attributes: {
    bookingCalendar: Attribute.Component<'elements.booking-calendar'>;
    contactForm: Attribute.Component<'elements.contact-form'>;
    contactLinks: Attribute.Component<'links.social-link', true>;
    description: Attribute.Text;
    hours: Attribute.Component<'elements.hours'>;
    title: Attribute.String;
  };
}

export interface SectionsFeatureColumnsGroup extends Schema.Component {
  collectionName: 'components_slices_feature_columns_groups';
  info: {
    displayName: 'Feature columns group';
    icon: 'star-of-life';
    name: 'FeatureColumnsGroup';
  };
  attributes: {
    features: Attribute.Component<'elements.feature-column', true>;
  };
}

export interface SectionsFeatureRowsGroup extends Schema.Component {
  collectionName: 'components_slices_feature_rows_groups';
  info: {
    displayName: 'Feaures row group';
    icon: 'bars';
    name: 'FeatureRowsGroup';
  };
  attributes: {
    features: Attribute.Component<'elements.feature-row', true>;
  };
}

export interface SectionsFeaturedPosts extends Schema.Component {
  collectionName: 'components_sections_featured_posts';
  info: {
    displayName: 'Featured Posts';
  };
  attributes: {
    description: Attribute.Text;
    posts: Attribute.Relation<
      'sections.featured-posts',
      'oneToMany',
      'api::article.article'
    >;
    title: Attribute.String;
  };
}

export interface SectionsFeatures extends Schema.Component {
  collectionName: 'components_layout_features';
  info: {
    description: '';
    displayName: 'Features';
  };
  attributes: {
    description: Attribute.Text;
    feature: Attribute.Component<'elements.feature', true>;
    heading: Attribute.String;
  };
}

export interface SectionsHeading extends Schema.Component {
  collectionName: 'components_sections_headings';
  info: {
    displayName: 'Heading';
  };
  attributes: {
    description: Attribute.String;
    heading: Attribute.String & Attribute.Required;
  };
}

export interface SectionsHero extends Schema.Component {
  collectionName: 'components_slices_heroes';
  info: {
    description: '';
    displayName: 'Hero';
    icon: 'heading';
    name: 'Hero';
  };
  attributes: {
    buttons: Attribute.Component<'links.button-link', true>;
    description: Attribute.String & Attribute.Required;
    picture: Attribute.Media<'images', true> & Attribute.Required;
    title: Attribute.String & Attribute.Required;
  };
}

export interface SectionsLargeVideo extends Schema.Component {
  collectionName: 'components_slices_large_videos';
  info: {
    displayName: 'Large video';
    icon: 'play-circle';
    name: 'LargeVideo';
  };
  attributes: {
    description: Attribute.String;
    poster: Attribute.Media<'images'>;
    title: Attribute.String;
    video: Attribute.Media<'videos'> & Attribute.Required;
  };
}

export interface SectionsLeadForm extends Schema.Component {
  collectionName: 'components_sections_lead_forms';
  info: {
    description: '';
    displayName: 'Lead form';
    icon: 'at';
    name: 'Lead form';
  };
  attributes: {
    description: Attribute.Text;
    emailPlaceholder: Attribute.String;
    location: Attribute.String;
    submitButton: Attribute.Component<'links.button'>;
    title: Attribute.String;
  };
}

export interface SectionsPricing extends Schema.Component {
  collectionName: 'components_sections_pricings';
  info: {
    displayName: 'Pricing';
    icon: 'dollar-sign';
    name: 'Pricing';
  };
  attributes: {
    plans: Attribute.Component<'elements.plan', true>;
    title: Attribute.String;
  };
}

export interface SectionsRichText extends Schema.Component {
  collectionName: 'components_sections_rich_texts';
  info: {
    displayName: 'Rich text';
    icon: 'text-height';
    name: 'RichText';
  };
  attributes: {
    content: Attribute.RichText;
  };
}

export interface SectionsTeam extends Schema.Component {
  collectionName: 'components_sections_teams';
  info: {
    description: '';
    displayName: 'Team';
  };
  attributes: {
    description: Attribute.Text;
    filosofy: Attribute.Component<'shared.quote'>;
    member: Attribute.Component<'elements.team-member', true>;
    title: Attribute.String;
  };
}

export interface SectionsTestimonialsGroup extends Schema.Component {
  collectionName: 'components_slices_testimonials_groups';
  info: {
    description: '';
    displayName: 'Testimonials group';
    icon: 'user-friends';
    name: 'TestimonialsGroup';
  };
  attributes: {
    description: Attribute.Text;
    testimonials: Attribute.Component<'elements.testimonial', true>;
    title: Attribute.String;
  };
}

export interface SharedMedia extends Schema.Component {
  collectionName: 'components_shared_media';
  info: {
    description: '';
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Attribute.Media<'images'>;
  };
}

export interface SharedQuote extends Schema.Component {
  collectionName: 'components_shared_quotes';
  info: {
    description: '';
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Attribute.Text & Attribute.Required;
    isList: Attribute.Boolean;
    items: Attribute.Component<'elements.philosophy-item', true>;
    sign: Attribute.String;
    title: Attribute.String;
    type: Attribute.Enumeration<['quotation', 'filosofy']>;
  };
}

export interface SharedRichText extends Schema.Component {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Attribute.RichText;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Attribute.Text & Attribute.Required;
    metaTitle: Attribute.String & Attribute.Required;
    shareImage: Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Schema.Component {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Attribute.Media<'images', true>;
  };
}

export interface SharedVideoEmbed extends Schema.Component {
  collectionName: 'components_sections_video_embeds';
  info: {
    description: '';
    displayName: 'Video Embed';
  };
  attributes: {
    url: Attribute.String & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'elements.booking-calendar': ElementsBookingCalendar;
      'elements.booking-location': ElementsBookingLocation;
      'elements.booking-person': ElementsBookingPerson;
      'elements.contact-form': ElementsContactForm;
      'elements.feature': ElementsFeature;
      'elements.feature-column': ElementsFeatureColumn;
      'elements.feature-row': ElementsFeatureRow;
      'elements.footer-section': ElementsFooterSection;
      'elements.hours': ElementsHours;
      'elements.location': ElementsLocation;
      'elements.logos': ElementsLogos;
      'elements.notification-banner': ElementsNotificationBanner;
      'elements.philosophy-item': ElementsPhilosophyItem;
      'elements.plan': ElementsPlan;
      'elements.team-member': ElementsTeamMember;
      'elements.testimonial': ElementsTestimonial;
      'layout.footer': LayoutFooter;
      'layout.logo': LayoutLogo;
      'layout.navbar': LayoutNavbar;
      'links.button': LinksButton;
      'links.button-link': LinksButtonLink;
      'links.link': LinksLink;
      'links.social-link': LinksSocialLink;
      'meta.metadata': MetaMetadata;
      'sections.booking-calendar': SectionsBookingCalendar;
      'sections.bottom-actions': SectionsBottomActions;
      'sections.contact': SectionsContact;
      'sections.feature-columns-group': SectionsFeatureColumnsGroup;
      'sections.feature-rows-group': SectionsFeatureRowsGroup;
      'sections.featured-posts': SectionsFeaturedPosts;
      'sections.features': SectionsFeatures;
      'sections.heading': SectionsHeading;
      'sections.hero': SectionsHero;
      'sections.large-video': SectionsLargeVideo;
      'sections.lead-form': SectionsLeadForm;
      'sections.pricing': SectionsPricing;
      'sections.rich-text': SectionsRichText;
      'sections.team': SectionsTeam;
      'sections.testimonials-group': SectionsTestimonialsGroup;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.video-embed': SharedVideoEmbed;
    }
  }
}
