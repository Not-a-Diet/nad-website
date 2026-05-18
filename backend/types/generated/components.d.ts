import type { Schema, Struct } from '@strapi/strapi';

export interface ElementsBookingCalendar extends Struct.ComponentSchema {
  collectionName: 'components_elements_booking_calendars';
  info: {
    description: 'Person/location selector with Google Calendar embed';
    displayName: 'Booking Calendar';
  };
  attributes: {
    backButtonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Back'>;
    bookingTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Book your appointment'>;
    locationLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Location'>;
    noSelectionMessage: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Please select a person and location to view available times.'>;
    personLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Person'>;
    persons: Schema.Attribute.Component<'elements.booking-person', true>;
    selectLocationPlaceholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Select a location'>;
    selectPersonPlaceholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Select a person'>;
    viewCalendarButtonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'View Calendar'>;
  };
}

export interface ElementsBookingLocation extends Struct.ComponentSchema {
  collectionName: 'components_elements_booking_locations';
  info: {
    description: 'A location with its Google Calendar embed URL';
    displayName: 'Booking Location';
  };
  attributes: {
    embedUrl: Schema.Attribute.String & Schema.Attribute.Required;
    isDefault: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsBookingPerson extends Struct.ComponentSchema {
  collectionName: 'components_elements_booking_persons';
  info: {
    description: 'A person with their locations and calendar embed URLs';
    displayName: 'Booking Person';
  };
  attributes: {
    locations: Schema.Attribute.Component<'elements.booking-location', true>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsFeature extends Struct.ComponentSchema {
  collectionName: 'components_elements_features';
  info: {
    description: '';
    displayName: 'Feature';
  };
  attributes: {
    color: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'tertiary', 'quaternary']
    >;
    description: Schema.Attribute.Text;
    descriptionList: Schema.Attribute.Text;
    media: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    newTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    showLink: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ElementsFeatureColumn extends Struct.ComponentSchema {
  collectionName: 'components_slices_feature_columns';
  info: {
    description: '';
    displayName: 'Feature column';
    icon: 'align-center';
    name: 'FeatureColumn';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsFeatureRow extends Struct.ComponentSchema {
  collectionName: 'components_slices_feature_rows';
  info: {
    description: '';
    displayName: 'Feature row';
    icon: 'arrows-alt-h';
    name: 'FeatureRow';
  };
  attributes: {
    description: Schema.Attribute.Text;
    link: Schema.Attribute.Component<'links.link', false>;
    media: Schema.Attribute.Media<'images' | 'videos'> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsFooterSection extends Struct.ComponentSchema {
  collectionName: 'components_links_footer_sections';
  info: {
    displayName: 'Footer section';
    icon: 'chevron-circle-down';
    name: 'FooterSection';
  };
  attributes: {
    links: Schema.Attribute.Component<'links.link', true>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsHours extends Struct.ComponentSchema {
  collectionName: 'components_elements_hours';
  info: {
    description: 'Business hours with title, description, and physical locations';
    displayName: 'Hours';
  };
  attributes: {
    description: Schema.Attribute.Text;
    locations: Schema.Attribute.Component<'elements.location', true>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsLocation extends Struct.ComponentSchema {
  collectionName: 'components_elements_locations';
  info: {
    description: 'A physical location address that links to Google Maps';
    displayName: 'Location';
  };
  attributes: {
    address: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsLogos extends Struct.ComponentSchema {
  collectionName: 'components_elements_logos';
  info: {
    displayName: 'Logos';
    icon: 'apple-alt';
    name: 'logos';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsNotificationBanner extends Struct.ComponentSchema {
  collectionName: 'components_elements_notification_banners';
  info: {
    description: '';
    displayName: 'Notification banner';
    icon: 'exclamation';
    name: 'NotificationBanner';
  };
  attributes: {
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    link: Schema.Attribute.Component<'links.link', false>;
    show: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<['alert', 'info', 'warning']> &
      Schema.Attribute.Required;
  };
}

export interface ElementsPhilosophyItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_philosophy_items';
  info: {
    description: 'A title and description pair for philosophy lists';
    displayName: 'Philosophy Item';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsPlan extends Struct.ComponentSchema {
  collectionName: 'components_elements_plans';
  info: {
    description: '';
    displayName: 'Pricing plan';
    icon: 'search-dollar';
    name: 'plan';
  };
  attributes: {
    description: Schema.Attribute.Text;
    isRecommended: Schema.Attribute.Boolean;
    name: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
    pricePeriod: Schema.Attribute.String;
    product_features: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-feature.product-feature'
    >;
  };
}

export interface ElementsPricingList extends Struct.ComponentSchema {
  collectionName: 'components_elements_pricing_lists';
  info: {
    description: 'A heading plus a newline-separated list of bullet items used inside a pricing step';
    displayName: 'Pricing list';
    icon: 'list-ul';
    name: 'PricingList';
  };
  attributes: {
    heading: Schema.Attribute.String;
    items: Schema.Attribute.Text;
  };
}

export interface ElementsPricingStep extends Struct.ComponentSchema {
  collectionName: 'components_elements_pricing_steps';
  info: {
    description: 'A single numbered step within the structured pricing page';
    displayName: 'Pricing step';
    icon: 'list-ol';
    name: 'PricingStep';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<['primary', 'secondary']> &
      Schema.Attribute.DefaultTo<'primary'>;
    callout: Schema.Attribute.Text;
    durationLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Durata'>;
    durationValue: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    imagePlaceholder: Schema.Attribute.String;
    lede: Schema.Attribute.Text;
    lists: Schema.Attribute.Component<'elements.pricing-list', true>;
    modeLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Modalit\u00E0'>;
    modeValue: Schema.Attribute.String;
    priceLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Prezzo'>;
    priceValue: Schema.Attribute.String;
    reverse: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    stepNumber: Schema.Attribute.String;
    stickerText: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ElementsTeamMember extends Struct.ComponentSchema {
  collectionName: 'components_elements_team_members';
  info: {
    description: '';
    displayName: 'Team Member';
  };
  attributes: {
    description: Schema.Attribute.Text;
    name: Schema.Attribute.String;
    occupation: Schema.Attribute.String;
    profilePhoto: Schema.Attribute.Media<
      'images' | 'videos' | 'audios' | 'files'
    >;
    skills: Schema.Attribute.Text;
  };
}

export interface ElementsTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_slices_testimonials';
  info: {
    description: '';
    displayName: 'Testimonial';
    icon: 'user-check';
    name: 'Testimonial';
  };
  attributes: {
    authorName: Schema.Attribute.String & Schema.Attribute.Required;
    picture: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    description: '';
    displayName: 'Footer';
  };
  attributes: {
    categories: Schema.Attribute.Relation<
      'oneToMany',
      'api::category.category'
    >;
    description: Schema.Attribute.Text;
    footerLogo: Schema.Attribute.Component<'layout.logo', false>;
    legalLinks: Schema.Attribute.Component<'links.link', true>;
    menuLinks: Schema.Attribute.Component<'links.link', true>;
    socialLinks: Schema.Attribute.Component<'links.social-link', true>;
  };
}

export interface LayoutLogo extends Struct.ComponentSchema {
  collectionName: 'components_layout_logos';
  info: {
    description: '';
    displayName: 'Logo';
  };
  attributes: {
    logoImg: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'> &
      Schema.Attribute.Required;
    logoText: Schema.Attribute.String;
  };
}

export interface LayoutNavbar extends Struct.ComponentSchema {
  collectionName: 'components_layout_navbars';
  info: {
    description: '';
    displayName: 'Navbar';
    icon: 'map-signs';
    name: 'Navbar';
  };
  attributes: {
    button: Schema.Attribute.Component<'links.button-link', false>;
    links: Schema.Attribute.Component<'links.link', true>;
    navbarLogo: Schema.Attribute.Component<'layout.logo', false>;
  };
}

export interface LinksButton extends Struct.ComponentSchema {
  collectionName: 'components_links_simple_buttons';
  info: {
    description: '';
    displayName: 'Button';
    icon: 'fingerprint';
    name: 'Button';
  };
  attributes: {
    text: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['primary', 'secondary']>;
  };
}

export interface LinksButtonLink extends Struct.ComponentSchema {
  collectionName: 'components_links_buttons';
  info: {
    description: '';
    displayName: 'Button link';
    icon: 'fingerprint';
    name: 'Button-link';
  };
  attributes: {
    newTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['primary', 'secondary']>;
    url: Schema.Attribute.String;
  };
}

export interface LinksLink extends Struct.ComponentSchema {
  collectionName: 'components_links_links';
  info: {
    description: '';
    displayName: 'Link';
    icon: 'link';
    name: 'Link';
  };
  attributes: {
    newTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LinksSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_links_social_links';
  info: {
    description: '';
    displayName: 'Social Link';
  };
  attributes: {
    newTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    social: Schema.Attribute.Enumeration<
      [
        'YOUTUBE',
        'TWITTER',
        'WEBSITE',
        'LINKEDIN',
        'INSTAGRAM',
        'TIKTOK',
        'WHATSAPP',
        'PHONE',
        'EMAIL',
      ]
    >;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface MetaMetadata extends Struct.ComponentSchema {
  collectionName: 'components_meta_metadata';
  info: {
    description: '';
    displayName: 'Metadata';
    icon: 'robot';
    name: 'Metadata';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsBookingCalendar extends Struct.ComponentSchema {
  collectionName: 'components_sections_booking_calendars';
  info: {
    description: 'Google Calendar appointment scheduling with person/location selector';
    displayName: 'Booking Calendar';
  };
  attributes: {
    defaultLocationIndex: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    defaultPersonIndex: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    description: Schema.Attribute.Text;
    persons: Schema.Attribute.Component<'elements.booking-person', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsBottomActions extends Struct.ComponentSchema {
  collectionName: 'components_slices_bottom_actions';
  info: {
    description: '';
    displayName: 'Bottom actions';
    icon: 'angle-double-right';
    name: 'BottomActions';
  };
  attributes: {
    buttons: Schema.Attribute.Component<'links.button-link', true>;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SectionsContact extends Struct.ComponentSchema {
  collectionName: 'components_sections_contacts';
  info: {
    description: '';
    displayName: 'Contact';
  };
  attributes: {
    bookingCalendar: Schema.Attribute.Component<
      'elements.booking-calendar',
      false
    >;
    contactLinks: Schema.Attribute.Component<'links.social-link', true>;
    description: Schema.Attribute.Text;
    hours: Schema.Attribute.Component<'elements.hours', false>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsFeatureColumnsGroup extends Struct.ComponentSchema {
  collectionName: 'components_slices_feature_columns_groups';
  info: {
    displayName: 'Feature columns group';
    icon: 'star-of-life';
    name: 'FeatureColumnsGroup';
  };
  attributes: {
    features: Schema.Attribute.Component<'elements.feature-column', true>;
  };
}

export interface SectionsFeatureRowsGroup extends Struct.ComponentSchema {
  collectionName: 'components_slices_feature_rows_groups';
  info: {
    displayName: 'Feaures row group';
    icon: 'bars';
    name: 'FeatureRowsGroup';
  };
  attributes: {
    features: Schema.Attribute.Component<'elements.feature-row', true>;
  };
}

export interface SectionsFeaturedPosts extends Struct.ComponentSchema {
  collectionName: 'components_sections_featured_posts';
  info: {
    displayName: 'Featured Posts';
  };
  attributes: {
    description: Schema.Attribute.Text;
    posts: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsFeatures extends Struct.ComponentSchema {
  collectionName: 'components_layout_features';
  info: {
    description: '';
    displayName: 'Features';
  };
  attributes: {
    description: Schema.Attribute.Text;
    feature: Schema.Attribute.Component<'elements.feature', true>;
    heading: Schema.Attribute.String;
  };
}

export interface SectionsHeading extends Struct.ComponentSchema {
  collectionName: 'components_sections_headings';
  info: {
    displayName: 'Heading';
  };
  attributes: {
    description: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_slices_heroes';
  info: {
    description: '';
    displayName: 'Hero';
    icon: 'heading';
    name: 'Hero';
  };
  attributes: {
    buttons: Schema.Attribute.Component<'links.button-link', true>;
    description: Schema.Attribute.String & Schema.Attribute.Required;
    picture: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsLargeVideo extends Struct.ComponentSchema {
  collectionName: 'components_slices_large_videos';
  info: {
    displayName: 'Large video';
    icon: 'play-circle';
    name: 'LargeVideo';
  };
  attributes: {
    description: Schema.Attribute.String;
    poster: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
    video: Schema.Attribute.Media<'videos'> & Schema.Attribute.Required;
  };
}

export interface SectionsLeadForm extends Struct.ComponentSchema {
  collectionName: 'components_sections_lead_forms';
  info: {
    description: '';
    displayName: 'Lead form';
    icon: 'at';
    name: 'Lead form';
  };
  attributes: {
    description: Schema.Attribute.Text;
    emailPlaceholder: Schema.Attribute.String;
    location: Schema.Attribute.String;
    submitButton: Schema.Attribute.Component<'links.button', false>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsPricing extends Struct.ComponentSchema {
  collectionName: 'components_sections_pricings';
  info: {
    displayName: 'Pricing';
    icon: 'dollar-sign';
    name: 'Pricing';
  };
  attributes: {
    plans: Schema.Attribute.Component<'elements.plan', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsPricingServiceCard extends Struct.ComponentSchema {
  collectionName: 'components_sections_pricing_service_cards';
  info: {
    description: 'Hero pricing card: intro copy + single service with two prices, badges, note, CTA and reassurances';
    displayName: 'Pricing service card';
    icon: 'credit-card';
    name: 'PricingServiceCard';
  };
  attributes: {
    cardIcon: Schema.Attribute.Media<'images'>;
    cardNote: Schema.Attribute.Text;
    cardSubtitle: Schema.Attribute.Text;
    cardTitle: Schema.Attribute.String;
    ctaNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    ctaText: Schema.Attribute.String;
    ctaUrl: Schema.Attribute.String;
    decoration: Schema.Attribute.Media<'images', true>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    firstVisitMeta: Schema.Attribute.String;
    firstVisitName: Schema.Attribute.String;
    firstVisitPrice: Schema.Attribute.String;
    firstVisitSub: Schema.Attribute.Text;
    followUpMeta: Schema.Attribute.String;
    followUpName: Schema.Attribute.String;
    followUpPrice: Schema.Attribute.String;
    followUpSub: Schema.Attribute.Text;
    onlineLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Online'>;
    reassurances: Schema.Attribute.Text;
    showOnline: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showStudio: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    studioLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'In studio'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsPricingSteps extends Struct.ComponentSchema {
  collectionName: 'components_sections_pricing_steps';
  info: {
    description: 'Structured pathway section: heading plus a repeatable list of numbered steps';
    displayName: 'Pricing steps';
    icon: 'list-ol';
    name: 'PricingSteps';
  };
  attributes: {
    decoration: Schema.Attribute.Media<'images', true>;
    steps: Schema.Attribute.Component<'elements.pricing-step', true>;
    structureTitle: Schema.Attribute.String;
  };
}

export interface SectionsPricingTeaser extends Struct.ComponentSchema {
  collectionName: 'components_sections_pricing_teasers';
  info: {
    description: 'Compact homepage hook that previews the two consultation prices and links to the full pricing page';
    displayName: 'Pricing teaser';
    icon: 'tag';
    name: 'PricingTeaser';
  };
  attributes: {
    ctaNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ctaText: Schema.Attribute.String;
    ctaUrl: Schema.Attribute.String;
    decoration: Schema.Attribute.Media<'images', true>;
    eyebrow: Schema.Attribute.String;
    firstVisitLabel: Schema.Attribute.String;
    firstVisitMeta: Schema.Attribute.String;
    firstVisitPrice: Schema.Attribute.String;
    followUpLabel: Schema.Attribute.String;
    followUpMeta: Schema.Attribute.String;
    followUpPrice: Schema.Attribute.String;
    headline: Schema.Attribute.String;
    lede: Schema.Attribute.Text;
    mascot: Schema.Attribute.Media<'images'>;
    onlineLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Online'>;
    secondaryLinkText: Schema.Attribute.String;
    secondaryLinkUrl: Schema.Attribute.String;
    showOnline: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showStudio: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    studioLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'In studio'>;
    variant: Schema.Attribute.Enumeration<['card', 'band', 'inline']> &
      Schema.Attribute.DefaultTo<'card'>;
  };
}

export interface SectionsRichText extends Struct.ComponentSchema {
  collectionName: 'components_sections_rich_texts';
  info: {
    displayName: 'Rich text';
    icon: 'text-height';
    name: 'RichText';
  };
  attributes: {
    content: Schema.Attribute.RichText;
  };
}

export interface SectionsTeam extends Struct.ComponentSchema {
  collectionName: 'components_sections_teams';
  info: {
    description: '';
    displayName: 'Team';
  };
  attributes: {
    description: Schema.Attribute.Text;
    filosofy: Schema.Attribute.Component<'shared.quote', false>;
    member: Schema.Attribute.Component<'elements.team-member', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsTestimonialsGroup extends Struct.ComponentSchema {
  collectionName: 'components_slices_testimonials_groups';
  info: {
    description: '';
    displayName: 'Testimonials group';
    icon: 'user-friends';
    name: 'TestimonialsGroup';
  };
  attributes: {
    description: Schema.Attribute.Text;
    testimonials: Schema.Attribute.Component<'elements.testimonial', true>;
    title: Schema.Attribute.String;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    description: '';
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    description: '';
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    isList: Schema.Attribute.Boolean;
    items: Schema.Attribute.Component<'elements.philosophy-item', true>;
    sign: Schema.Attribute.String;
    title: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['quotation', 'filosofy']>;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedVideoEmbed extends Struct.ComponentSchema {
  collectionName: 'components_sections_video_embeds';
  info: {
    description: '';
    displayName: 'Video Embed';
  };
  attributes: {
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'elements.booking-calendar': ElementsBookingCalendar;
      'elements.booking-location': ElementsBookingLocation;
      'elements.booking-person': ElementsBookingPerson;
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
      'elements.pricing-list': ElementsPricingList;
      'elements.pricing-step': ElementsPricingStep;
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
      'sections.pricing-service-card': SectionsPricingServiceCard;
      'sections.pricing-steps': SectionsPricingSteps;
      'sections.pricing-teaser': SectionsPricingTeaser;
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
