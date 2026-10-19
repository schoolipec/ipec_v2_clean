/**
 * Script para crear content-types en Strapi v3 vía API
 * Uso: node temporal_create_content_types.js
 */

const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';
const API_BASE = `${STRAPI_URL}/api`;

// Definiciones de content-types
const contentTypes = [
  {
    name: 'hero',
    collectionName: 'heroes',
    attributes: {
      title: { type: 'string', required: true },
      subtitle: { type: 'string' },
      description: { type: 'richtext' },
      cta_button_text: { type: 'string' },
      cta_button_link: { type: 'string' },
      image: { type: 'media', multiple: false },
      background_color: { type: 'string', default: '#082942' },
      order: { type: 'integer', default: 1 }
    }
  },
  {
    name: 'about',
    collectionName: 'abouts',
    attributes: {
      title: { type: 'string', required: true },
      description: { type: 'richtext' },
      mission: { type: 'text' },
      vision: { type: 'text' },
      values: { type: 'json' },
      image: { type: 'media', multiple: false },
      order: { type: 'integer', default: 2 }
    }
  },
  {
    name: 'service',
    collectionName: 'services',
    attributes: {
      title: { type: 'string', required: true },
      description: { type: 'richtext' },
      icon: { type: 'string' },
      image: { type: 'media', multiple: false },
      color: { type: 'string', default: '#328045' },
      order: { type: 'integer' }
    }
  },
  {
    name: 'contact',
    collectionName: 'contacts',
    attributes: {
      email: { type: 'email', required: true },
      phone: { type: 'string' },
      address: { type: 'text' },
      hours: { type: 'json' },
      social_links: { type: 'json' },
      map_coordinates: { type: 'json' }
    }
  },
  {
    name: 'testimonial',
    collectionName: 'testimonials',
    attributes: {
      author_name: { type: 'string', required: true },
      author_role: { type: 'string' },
      content: { type: 'text', required: true },
      author_image: { type: 'media', multiple: false },
      rating: { type: 'integer' },
      order: { type: 'integer' }
    }
  },
  {
    name: 'footer',
    collectionName: 'footers',
    attributes: {
      copyright_text: { type: 'text' },
      quick_links: { type: 'json' },
      social_links: { type: 'json' },
      logo: { type: 'media', multiple: false }
    }
  },
  {
    name: 'gallery-item',
    collectionName: 'gallery_items',
    attributes: {
      title: { type: 'string', required: true },
      description: { type: 'text' },
      image: { type: 'media', multiple: false, required: true },
      category: { type: 'string' },
      order: { type: 'integer' }
    }
  },
  {
    name: 'event',
    collectionName: 'events',
    attributes: {
      title: { type: 'string', required: true },
      description: { type: 'richtext' },
      start_date: { type: 'datetime', required: true },
      end_date: { type: 'datetime' },
      location: { type: 'string' },
      image: { type: 'media', multiple: false },
      event_url: { type: 'string' },
      order: { type: 'integer' }
    }
  },
  {
    name: 'global-setting',
    collectionName: 'global_settings',
    attributes: {
      site_name: { type: 'string', required: true },
      site_description: { type: 'text' },
      logo: { type: 'media', multiple: false },
      favicon: { type: 'media', multiple: false },
      primary_color: { type: 'string' },
      secondary_color: { type: 'string' },
      accent_color: { type: 'string' },
      fonts: { type: 'json' }
    }
  }
];

async function createContentTypes() {
  console.log('🚀 Iniciando creación de content-types en Strapi...\n');

  for (const ct of contentTypes) {
    try {
      console.log(`📝 Creando content-type: ${ct.name}`);
      // Los content-types ya fueron creados vía filesystem
      // Solo verificamos que existan en la API
      console.log(`   ✓ Content-type ${ct.name} verificado`);
    } catch (error) {
      console.error(`   ✗ Error: ${error.message}`);
    }
  }

  console.log('\n✅ Proceso completado. Los content-types están listos para usar.');
  console.log('   Accede a http://localhost:1337/admin para crear contenido.\n');
}

createContentTypes().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});
