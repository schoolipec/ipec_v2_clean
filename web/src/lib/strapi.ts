import type {
  StrapiResponse,
  StrapiSingle,
  Hero,
  About,
  Service,
  Contact,
  Testimonial,
  Footer,
  GalleryItem,
  Event,
  GlobalSetting,
} from './types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

async function strapiGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${STRAPI_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getHeroes(): Promise<Hero[] | null> {
  const data = await strapiGet<StrapiResponse<Hero[]>>(
    '/heroes?sort=order:asc&filters[isActive]=true'
  );
  return data?.data ?? null;
}

export async function getAbout(): Promise<About | null> {
  const data = await strapiGet<StrapiResponse<About[]>>(
    '/abouts?filters[isActive]=true'
  );
  return data?.data?.[0] ?? null;
}

export async function getServices(): Promise<Service[] | null> {
  const data = await strapiGet<StrapiResponse<Service[]>>(
    '/services?sort=order:asc&filters[isActive]=true'
  );
  return data?.data ?? null;
}

export async function getContact(): Promise<Contact | null> {
  const data = await strapiGet<StrapiResponse<Contact[]>>(
    '/contacts?filters[isActive]=true'
  );
  return data?.data?.[0] ?? null;
}

export async function getTestimonials(): Promise<Testimonial[] | null> {
  const data = await strapiGet<StrapiResponse<Testimonial[]>>(
    '/testimonials?sort=order:asc&filters[isActive]=true'
  );
  return data?.data ?? null;
}

export async function getFooter(): Promise<Footer | null> {
  const data = await strapiGet<StrapiResponse<Footer[]>>(
    '/footers?filters[isActive]=true'
  );
  return data?.data?.[0] ?? null;
}

export async function getGalleryItems(): Promise<GalleryItem[] | null> {
  const data = await strapiGet<StrapiResponse<GalleryItem[]>>(
    '/gallery-items?sort=order:asc&filters[isActive]=true'
  );
  return data?.data ?? null;
}

export async function getEvents(): Promise<Event[] | null> {
  const data = await strapiGet<StrapiResponse<Event[]>>(
    '/events?sort=date:asc&filters[isActive]=true'
  );
  return data?.data ?? null;
}

export async function getGlobalSetting(): Promise<GlobalSetting | null> {
  const data = await strapiGet<StrapiSingle<GlobalSetting>>('/global-setting');
  return data?.data ?? null;
}
