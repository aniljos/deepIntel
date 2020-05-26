import React from 'react';
import { uiModules } from 'ui/modules';
import chrome from 'ui/chrome';
import { render, unmountComponentAtNode } from 'react-dom';
import { I18nProvider } from '@kbn/i18n/react';

import { TextSearch, Main } from './components/main';
// import {ExtractRouter} from './components/main/ExtractRouter'
// import {registeredRoutes} from './components/main/registerRoutes'
// import {BrowserRouter} from 'react-router-dom';
// const MainMount = ExtractRouter(registeredRoutes)(Main);

const app = uiModules.get('apps/deepIntel');

app.config($locationProvider => {
  $locationProvider.html5Mode({
    enabled: false,
    requireBase: false,
    rewriteLinks: false,
  });
});
app.config(stateManagementConfigProvider => stateManagementConfigProvider.disable());

function RootController($scope, $element, $http) {
  const domNode = $element[0];

  // render react to DOM
  render(
    <I18nProvider>
      
        <Main title="deep_intel" httpClient={$http} />
      
    </I18nProvider>,
    domNode
  );

  // unmount react on controller destroy
  $scope.$on('$destroy', () => {
    unmountComponentAtNode(domNode);
  });
}

chrome.setRootController('deepIntel', RootController);
