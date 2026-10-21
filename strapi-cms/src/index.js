'use strict';

module.exports = {
  async register({ strapi }) {},

  async bootstrap({ strapi }) {
    // Configurar permisos públicos para todos los content-types
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) return;

    const contentTypes = [
      'api::hero.hero',
      'api::about.about',
      'api::service.service',
      'api::contact.contact',
      'api::testimonial.testimonial',
      'api::footer.footer',
      'api::gallery-item.gallery-item',
      'api::event.event',
      'api::global-setting.global-setting',
    ];

    const actions = ['find', 'findOne'];

    for (const ct of contentTypes) {
      for (const action of actions) {
        const permKey = `${ct}.${action}`;
        const existing = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action: permKey, role: publicRole.id } });

        if (!existing) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: { action: permKey, role: publicRole.id, enabled: true },
          });
        } else if (!existing.enabled) {
          await strapi
            .query('plugin::users-permissions.permission')
            .update({ where: { id: existing.id }, data: { enabled: true } });
        }
      }
    }

    strapi.log.info('✅ Permisos públicos configurados para todos los content-types');
  },
};
