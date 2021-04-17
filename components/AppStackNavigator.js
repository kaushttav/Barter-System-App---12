import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/HomeScreen';
import UserDetailsScreen  from '../screens/UserDetails';

export const AppStackNavigator = createStackNavigator({
    HomeScreen: {
    screen : HomeScreen,
    navigationOptions:{
      headerShown : false
    }
  },
    UserDetails: {
    screen : UserDetailsScreen,
    navigationOptions:{
      headerShown : false
    }
  }
},
  {
    initialRouteName: 'HomeScreen'
  }
);