'use strict';

module.exports = {
  async heroes(ctx) {
    try {
      const heroes = await strapi.query('hero').find(ctx.query);
      ctx.send(heroes || []);
    } catch (error) {
      ctx.send({ error: 'Heroes collection not found' }, 404);
    }
  },

  async hero(ctx) {
    try {
      const hero = await strapi.query('hero').findOne({ id: ctx.params.id });
      ctx.send(hero || {});
    } catch (error) {
      ctx.send({ error: 'Hero not found' }, 404);
    }
  },

  async about(ctx) {
    try {
      const about = await strapi.query('about').find(ctx.query);
      ctx.send(about || []);
    } catch (error) {
      ctx.send({ error: 'About collection not found' }, 404);
    }
  },

  async services(ctx) {
    try {
      const services = await strapi.query('service').find(ctx.query);
      ctx.send(services || []);
    } catch (error) {
      ctx.send({ error: 'Services collection not found' }, 404);
    }
  },

  async contacts(ctx) {
    try {
      const contacts = await strapi.query('contact').find(ctx.query);
      ctx.send(contacts || []);
    } catch (error) {
      ctx.send({ error: 'Contacts collection not found' }, 404);
    }
  },

  async testimonials(ctx) {
    try {
      const testimonials = await strapi.query('testimonial').find(ctx.query);
      ctx.send(testimonials || []);
    } catch (error) {
      ctx.send({ error: 'Testimonials collection not found' }, 404);
    }
  },

  async footers(ctx) {
    try {
      const footers = await strapi.query('footer').find(ctx.query);
      ctx.send(footers || []);
    } catch (error) {
      ctx.send({ error: 'Footers collection not found' }, 404);
    }
  },

  async galleryItems(ctx) {
    try {
      const items = await strapi.query('gallery-item').find(ctx.query);
      ctx.send(items || []);
    } catch (error) {
      ctx.send({ error: 'Gallery items not found' }, 404);
    }
  },

  async events(ctx) {
    try {
      const events = await strapi.query('event').find(ctx.query);
      ctx.send(events || []);
    } catch (error) {
      ctx.send({ error: 'Events not found' }, 404);
    }
  },

  async globalSettings(ctx) {
    try {
      const settings = await strapi.query('global-setting').find(ctx.query);
      ctx.send(settings || []);
    } catch (error) {
      ctx.send({ error: 'Global settings not found' }, 404);
    }
  }
};
