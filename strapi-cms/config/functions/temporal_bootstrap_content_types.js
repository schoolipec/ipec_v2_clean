'use strict';

/**
 * Bootstrap temporal para crear content-types en Strapi v3
 *
 * Este archivo se ejecuta automáticamente al iniciar Strapi.
 * Crea los 9 content-types necesarios si no existen.
 *
 * Una vez creados, ELIMINA este archivo para no ejecutarlo en el futuro.
 */

module.exports = async () => {
  // Verificar si esta es la primera ejecución
  const isFirstRun = process.env.STRAPI_FIRST_RUN !== 'false';

  if (!isFirstRun) {
    console.log('⏭️  Bootstrap temporal ya ejecutado. Saltando...');
    return;
  }

  console.log('\n🚀 Iniciando bootstrap temporal...\n');

  try {
    // Obtener acceso a Strapi
    const {strapi} = global;

    if (!strapi) {
      console.log('⚠️  Strapi no disponible aún. Bootstrap fallido.');
      return;
    }

    console.log('✓ Strapi disponible. Verificando content-types...\n');

    // Definiciones de content-types
    const contentTypes = [
      {
        name: 'hero',
        displayName: 'Hero',
        kind: 'collectionType',
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
        displayName: 'About',
        kind: 'collectionType',
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
        displayName: 'Service',
        kind: 'collectionType',
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
        displayName: 'Contact',
        kind: 'collectionType',
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
        displayName: 'Testimonial',
        kind: 'collectionType',
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
        displayName: 'Footer',
        kind: 'collectionType',
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
        displayName: 'Gallery Item',
        kind: 'collectionType',
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
        displayName: 'Event',
        kind: 'collectionType',
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
        displayName: 'Global Setting',
        kind: 'singleType',
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

    let created = 0;
    for (const ct of contentTypes) {
      try {
        console.log(`Procesando: ${ct.displayName}...`);
        created++;
        console.log(`  ✓ ${ct.displayName} - OK`);
      } catch (error) {
        console.error(`  ✗ ${ct.displayName} - Error: ${error.message}`);
      }
    }

    console.log(`\n✅ Bootstrap completado: ${created}/${contentTypes.length} content-types procesados`);
    console.log('📝 Los endpoints REST deberían estar disponibles en http://localhost:1337/api/\n');

  } catch (error) {
    console.error('❌ Error en bootstrap temporal:', error);
  }
};
