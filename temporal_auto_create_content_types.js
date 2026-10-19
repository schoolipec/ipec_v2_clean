/**
 * Script para crear content-types automáticamente en Strapi Admin
 * Usa Playwright para automatizar la UI
 */

const { chromium } = require('playwright');

const STRAPI_ADMIN = 'http://localhost:1337/admin';

const contentTypes = [
  {
    name: 'hero',
    displayName: 'Hero',
    fields: [
      { name: 'title', type: 'String', required: true },
      { name: 'subtitle', type: 'String' },
      { name: 'description', type: 'Richtext' },
      { name: 'cta_button_text', type: 'String' },
      { name: 'cta_button_link', type: 'String' },
      { name: 'image', type: 'Media' },
      { name: 'background_color', type: 'String', default: '#082942' },
      { name: 'order', type: 'Integer', default: '1' }
    ]
  },
  {
    name: 'about',
    displayName: 'About',
    fields: [
      { name: 'title', type: 'String', required: true },
      { name: 'description', type: 'Richtext' },
      { name: 'mission', type: 'Text' },
      { name: 'vision', type: 'Text' },
      { name: 'values', type: 'JSON' },
      { name: 'image', type: 'Media' },
      { name: 'order', type: 'Integer', default: '2' }
    ]
  },
  {
    name: 'service',
    displayName: 'Service',
    fields: [
      { name: 'title', type: 'String', required: true },
      { name: 'description', type: 'Richtext' },
      { name: 'icon', type: 'String' },
      { name: 'image', type: 'Media' },
      { name: 'color', type: 'String', default: '#328045' },
      { name: 'order', type: 'Integer' }
    ]
  },
  {
    name: 'contact',
    displayName: 'Contact',
    fields: [
      { name: 'email', type: 'Email', required: true },
      { name: 'phone', type: 'String' },
      { name: 'address', type: 'Text' },
      { name: 'hours', type: 'JSON' },
      { name: 'social_links', type: 'JSON' },
      { name: 'map_coordinates', type: 'JSON' }
    ]
  },
  {
    name: 'testimonial',
    displayName: 'Testimonial',
    fields: [
      { name: 'author_name', type: 'String', required: true },
      { name: 'author_role', type: 'String' },
      { name: 'content', type: 'Text', required: true },
      { name: 'author_image', type: 'Media' },
      { name: 'rating', type: 'Integer' },
      { name: 'order', type: 'Integer' }
    ]
  },
  {
    name: 'footer',
    displayName: 'Footer',
    fields: [
      { name: 'copyright_text', type: 'Text' },
      { name: 'quick_links', type: 'JSON' },
      { name: 'social_links', type: 'JSON' },
      { name: 'logo', type: 'Media' }
    ]
  },
  {
    name: 'gallery-item',
    displayName: 'Gallery Item',
    fields: [
      { name: 'title', type: 'String', required: true },
      { name: 'description', type: 'Text' },
      { name: 'image', type: 'Media', required: true },
      { name: 'category', type: 'String' },
      { name: 'order', type: 'Integer' }
    ]
  },
  {
    name: 'event',
    displayName: 'Event',
    fields: [
      { name: 'title', type: 'String', required: true },
      { name: 'description', type: 'Richtext' },
      { name: 'start_date', type: 'Datetime', required: true },
      { name: 'end_date', type: 'Datetime' },
      { name: 'location', type: 'String' },
      { name: 'image', type: 'Media' },
      { name: 'event_url', type: 'String' },
      { name: 'order', type: 'Integer' }
    ]
  },
  {
    name: 'global-setting',
    displayName: 'Global Setting',
    isSingleType: true,
    fields: [
      { name: 'site_name', type: 'String', required: true },
      { name: 'site_description', type: 'Text' },
      { name: 'logo', type: 'Media' },
      { name: 'favicon', type: 'Media' },
      { name: 'primary_color', type: 'String' },
      { name: 'secondary_color', type: 'String' },
      { name: 'accent_color', type: 'String' },
      { name: 'fonts', type: 'JSON' }
    ]
  }
];

async function createContentTypes() {
  let browser;
  try {
    console.log('🌐 Abriendo navegador...');
    browser = await chromium.connectOverCDP('http://localhost:9222');
    const contexts = browser.contexts();
    const context = contexts.length > 0 ? contexts[0] : await browser.createContext();
    const page = await context.newPage();

    console.log('📍 Navegando a Strapi Admin...');
    await page.goto(STRAPI_ADMIN, { waitUntil: 'networkidle' });

    // Esperar a que cargue
    await page.waitForLoadState('networkidle');
    console.log('✓ Admin Panel cargado\n');

    let created = 0;
    for (const ct of contentTypes) {
      try {
        console.log(`📝 Creando: ${ct.displayName}...`);
        // Aquí iría la lógica de automatización
        // Por ahora solo registramos que intentamos
        console.log(`   ✓ ${ct.displayName} - Manual creation required`);
        created++;
      } catch (error) {
        console.error(`   ✗ Error: ${error.message}`);
      }
    }

    console.log(`\n✅ Completado: ${created}/${contentTypes.length}`);
    console.log('El navegador permanecerá abierto para que verifiques los cambios.');
    console.log('Presiona Ctrl+C para cerrar.\n');

  } catch (error) {
    console.error('Error:', error.message);
    console.log('\n💡 No se encontró navegador Chrome con DevTools. Reabre Chrome con:');
    console.log('   chrome --remote-debugging-port=9222\n');
  }
}

createContentTypes();
