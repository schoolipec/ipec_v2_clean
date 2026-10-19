/**
 * Script para crear content-types vía Strapi Admin UI usando Playwright
 */

const { chromium } = require('playwright');

async function setupStrapiContentTypes() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.createContext();
  const page = await context.newPage();

  try {
    console.log('🌐 Abriendo Strapi Admin Panel...');
    await page.goto('http://localhost:1337/admin', { waitUntil: 'networkidle' });

    // Esperar a que el panel cargue completamente
    await page.waitForLoadState('networkidle');

    console.log('✓ Admin panel cargado');
    console.log('\n📝 Por favor, ve a: Plugins > Content-Type Builder');
    console.log('   Crea los siguientes content-types con sus campos:');
    console.log('\n   1. HERO');
    console.log('   2. ABOUT');
    console.log('   3. SERVICE');
    console.log('   4. CONTACT');
    console.log('   5. TESTIMONIAL');
    console.log('   6. FOOTER');
    console.log('   7. GALLERY-ITEM');
    console.log('   8. EVENT');
    console.log('   9. GLOBAL-SETTING (Single Type)');
    console.log('\n   El navegador permanecerá abierto. Cuando termines, ciérralo.');
    console.log('   Script esperando...\n');

    // Esperar indefinidamente hasta que el usuario cierre el navegador
    await new Promise(() => {});
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

setupStrapiContentTypes();
