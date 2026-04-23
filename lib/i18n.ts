export interface Messages {
  nav: {
    about: string
    help: string
    newsletter_aria: string
  }
  hero: {
    tagline_prefix: string
    tagline_suffix: string
  }
  search: {
    label: string
    look_it_up: string
    surprise_me: string
    surprise_aria: string
    form_aria: string
  }
  entry: {
    nutshell: string
    need_to_know: string
    say_this: string
    not_this: string
  }
  newsletter: {
    series: string
    headline_prefix: string
    headline_em: string
    headline_suffix: string
    description: string
    email_placeholder: string
    subscribe: string
    sending: string
    success: string
    error: string
  }
  share: {
    email_subject: string
    email_body: string
    native_title: string
    native_text: string
  }
  errors: {
    generate_failed: string
  }
  loading: string[]
  credits: string[]
  footer: {
    credits_aria: string
  }
  sr: {
    loading: string
    ready: string
    page_aria: string
  }
  idea_form: {
    overline: string
    headline_prefix: string
    headline_em: string
    headline_suffix: string
    description: string
    first_name: string
    last_name: string
    linkedin_optional: string
    idea_label: string
    submit: string
    sending: string
    success: string
    error: string
  }
  chapters: Record<string, string>
  about: {
    back: string
    help: string
    section_label: string
    hero_line1: string
    hero_line2: string
    hero_line3_prefix: string
    hero_line3_em: string
    hero_sub: string
    origin_label: string
    origin_p1: string
    origin_p2: string
    origin_p3: string
    roadmap_label: string
    roadmap_headline: string
    roadmap_headline_em: string
    roadmap_sub: string
    roadmap_title: string
    roadmap_error: string
    cta_headline1: string
    cta_headline2: string
    cta_headline2_em: string
    cta_sub: string
    cta_button: string
    home_url: string
  }
}

export type Locale = "en" | "fr"
