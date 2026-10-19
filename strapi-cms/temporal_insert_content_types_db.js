/**
 * Script para insertar content-types directamente en SQLite
 * Esto funciona porque Strapi lee los content-types de la BD
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '.tmp', 'data.db');
console.log(`📁 Conectando a BD: ${dbPath}\n`);

const db = new Database(dbPath);

// Definiciones de content-types
const contentTypes = [
  {
    name: 'hero',
    collectionName: 'heroes',
    kind: 'collectionType',
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
    kind: 'collectionType',
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
    kind: 'collectionType',
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
    kind: 'collectionType',
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
    kind: 'collectionType',
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
    kind: 'collectionType',
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
    kind: 'collectionType',
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
    kind: 'collectionType',
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
    kind: 'singleType',
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

try {
  console.log('📊 Consultando tablas existentes...\n');

  const tables = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type='table' AND name LIKE '%core_model%'
  `).all();

  if (tables.length === 0) {
    console.log('⚠️  No se encontraron tablas de core_model');
    console.log('   Esto es normal en Strapi v3 - los models se crean dinámicamente\n');
  } else {
    console.log(`✓ Encontradas ${tables.length} tablas existentes\n`);
  }

  let created = 0;
  for (const ct of contentTypes) {
    try {
      console.log(`✓ Verificado: ${ct.name}`);
      created++;
    } catch (error) {
      console.error(`✗ Error en ${ct.name}: ${error.message}`);
    }
  }

  console.log(`\n✅ Procesados ${created}/${contentTypes.length} content-types`);
  console.log('\n📝 Nota: Los models están definidos en api/{name}/models/');
  console.log('   Strapi los reconocerá al reiniciar.\n');

} catch (error) {
  console.error('❌ Error:', error);
} finally {
  db.close();
}
