import { i18n } from '@kbn/i18n';

import exampleRoute from './server/routes/example';
import fetchMedia from './server/routes/fetchMedia';

export default function(kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'deep_intel',
    uiExports: {
      app: {
        title: 'Deep Intel',
        description: 'Deep Intel Search App',
        main: 'plugins/deep_intel/app',
      },
      hacks: ['plugins/deep_intel/hack'],
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    // eslint-disable-next-line no-unused-vars
    init(server, options) {
      const xpackMainPlugin = server.plugins.xpack_main;
      
      if (xpackMainPlugin) {
        const featureId = 'deep_intel';

        xpackMainPlugin.registerFeature({
          id: featureId,
          name: i18n.translate('deepIntel.featureRegistry.featureName', {
            defaultMessage: 'deep_intel',
          }),
          navLinkId: featureId,
          icon: 'questionInCircle',
          app: [featureId, 'kibana'],
          catalogue: [],
          privileges: {
            all: {
              api: [],
              savedObject: {
                all: [],
                read: [],
              },
              ui: ['show'],
            },
            read: {
              api: [],
              savedObject: {
                all: [],
                read: [],
              },
              ui: ['show'],
            },
          },
        });
      }

      // Add server routes and initialize the plugin here
      exampleRoute(server);
      fetchMedia(server);

    },
  });
}
