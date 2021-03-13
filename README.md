# DietAide
## Dependencies
Expo: https://expo.io/  
Async Storage: https://github.com/react-native-async-storage/async-storage  
Axios: https://www.npmjs.com/package/react-native-axios   
FitChart: https://www.npmjs.com/package/react-native-chart-kit   
Ultimate Modal Picker: https://www.npmjs.com/package/react-native-ultimate-modal-picker  

## Motivation
In quarantine, it's often the case that people spend many hours sitting in front of their screens. This may lead to people gaining weight, and having health problems in the future. A lot of people may not know how to diet properly or are intimidated by keeping track of so many things. We want to make it easier for them through our app. In order to promote a healthier lifestyle, our mobile app will create a dynamic exercise and dieting plan for the user’s specific needs.

# Project Goal and Approach
We have built an iOS application using React Native and Expo that recommends exercise levels and calorie intakes for each meal based on user information and emphasizing dieting goals. We collect data throughout the user’s dieting process, both through automatic means and manual input. The goal of the app is to give the user an easy experience for the dieting process, where they don’t have to worry about keeping track of the numbers by themselves.
Personal Model Data Sources:
1. Initial User’s Survey for user biological information (Manual user input)
2. Daily exercise amount based on phone pedometer
3. Food intake based on mobile app (Manual user input)

Context Data Sources:
1. Food nutritional information from Edamam API
2. Recommended exercise amount formula from Harris-Benedict Omni Calculator

The data collected is stored in the device’s local storage. The exercise recommendations are based on the user’s goal and their biological information that is collected upon signing up and updated as the user logs their progress. The food recommendations are influenced by the user’s exercise levels and previous meal nutrition for that day, as well as the biological information.

Code relevant to the project design is located in the screens folder as well as BottomTabNavigator.tsx in the navigation folder. The other files are React Native and Expo dependencies.
