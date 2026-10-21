export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingle<T> {
  data: T;
  meta: object;
}

interface StrapiImage {
  url: string;
}

interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
}

interface StrapiBase {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Hero extends StrapiBase {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  backgroundImage: StrapiImage;
  isActive: boolean;
  order: number;
}

export interface About extends StrapiBase {
  title: string;
  content: string;
  missionStatement: string;
  visionStatement: string;
  image: StrapiImage;
  isActive: boolean;
}

export interface Service extends StrapiBase {
  title: string;
  description: string;
  icon: string;
  image: StrapiImage;
  isActive: boolean;
  order: number;
}

export interface Contact extends StrapiBase {
  title: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  isActive: boolean;
}

export interface Testimonial extends StrapiBase {
  name: string;
  content: string;
  role: string;
  image: StrapiImage;
  isActive: boolean;
  order: number;
}

export interface Footer extends StrapiBase {
  address: string;
  phone: string;
  email: string;
  socialLinks: SocialLinks;
  isActive: boolean;
}

export interface GalleryItem extends StrapiBase {
  title: string;
  description: string;
  image: StrapiImage;
  category: string;
  isActive: boolean;
  order: number;
}

export interface Event extends StrapiBase {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: StrapiImage;
  isActive: boolean;
  isFeatured: boolean;
}

export interface GlobalSetting extends StrapiBase {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  maintenanceMode: boolean;
  analyticsId: string;
  socialLinks: SocialLinks;
}
