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
  chapters: Record<string, string>
}

export type Locale = "en" | "fr"
