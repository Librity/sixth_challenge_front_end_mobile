import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import User from './pages/User';
import Repo from './pages/Repo';

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main,
      User,
      Repo,
    },
    {
      headerLayoutPreset: 'center',
      headerBackTitleVisible: false,
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: '#3f76cf',
        },
        headerTintColor: '#fff',
      },
    }
  )
);

export default Routes;
