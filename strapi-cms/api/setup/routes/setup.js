'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/heroes',
      handler: 'setup.heroes'
    },
    {
      method: 'GET',
      path: '/heroes/:id',
      handler: 'setup.hero'
    },
    {
      method: 'GET',
      path: '/about',
      handler: 'setup.about'
    },
    {
      method: 'GET',
      path: '/services',
      handler: 'setup.services'
    },
    {
      method: 'GET',
      path: '/contacts',
      handler: 'setup.contacts'
    },
    {
      method: 'GET',
      path: '/testimonials',
      handler: 'setup.testimonials'
    },
    {
      method: 'GET',
      path: '/footers',
      handler: 'setup.footers'
    },
    {
      method: 'GET',
      path: '/gallery-items',
      handler: 'setup.galleryItems'
    },
    {
      method: 'GET',
      path: '/events',
      handler: 'setup.events'
    },
    {
      method: 'GET',
      path: '/global-settings',
      handler: 'setup.globalSettings'
    }
  ]
};
