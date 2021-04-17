import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingsScreen from '../screens/SettingsScreen';
import MyBartersScreen from '../screens/MyBarters';
import Notifications from '../screens/Notifications';
import MyReceivedItems from '../screens/MyReceivedItems';

export const AppDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: AppTabNavigator
    },
    MyBarters: {
      screen : MyBartersScreen
    },
    MyReceivedItems: {
      screen: MyReceivedItems
    },
    Notifications : {
      screen: Notifications
    },
    Settings: {
        screen: SettingsScreen
    }
    },
    {contentComponent: CustomSideBarMenu},
    {initialRouteName: 'Home'}
)