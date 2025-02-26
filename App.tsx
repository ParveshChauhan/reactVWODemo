/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  AppState,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  setScreenName,
  screenList,
  config,
  getSessionURL,
  enableVWOIntegrations,
  startRecording,
  addSessionRefreshListener,
  removeSessionRefreshListener,
} from 'vwo-insights-react-native-sdk';

import { Mixpanel } from "mixpanel-react-native";

import  ReactMoE from 'react-native-moengage';
import { MoEProperties } from 'react-native-moengage';

import crashlytics from '@react-native-firebase/crashlytics';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  async function getSession(enumValue: any) {
    try {
      const url = await getSessionURL('CRASHLYTICS');
      console.log('Session URL set ', url);
      // try {
      //   await crashlytics().setAttribute('VWOSessionURL', url.toString());
      // } catch (error) {
      //   console.error(error);
      // }
    } catch (error) {
      console.error(error);
    }
  }


  React.useEffect(() => {
    const appstatelistener = AppState.addEventListener('change', state => {
      console.log('App state changed to', state);
    });

    const trackAutomaticEvents = false;
    const mixpanel = new Mixpanel("f6df100a7044baf6e12c4cff91d2b354", trackAutomaticEvents);
    mixpanel.init();

    ReactMoE.initialize("R4D6OPLRCPH04BL24NXMN48G");

    const IntegrationsList = {
      CRASHLYTICS: 'CRASHLYTICS',
      MIXPANEL: 'MIXPANEL',
      MOENGAGE: 'MOENGAGE',
    };
    const integrationCallback = (enumValue: any) => {
      console.log('integration call back', enumValue);
      switch (enumValue) {
        case IntegrationsList.CRASHLYTICS:
          getSession(enumValue);
          break;
          case IntegrationsList.MIXPANEL:
          getSession(enumValue);
          break;
          case IntegrationsList.MOENGAGE:
          getSession(enumValue);
          break;
        default:
          console.log('Unknown enum value');
      }
    };
    enableVWOIntegrations(integrationCallback);

    // config('706378', '74951db9904fb2e2df78d49716ba690d', '');
    // config('893359', 'aa340824759d74c11d262d4431337302', '');
    config('780027', 'e7277b4225ee69ca8d60b2994556dfc3', '');
     startRecording()
     
    addSessionRefreshListener(result => {
      // console.log("Session Refresh Event:", result);

  // Iterate through the result keys to dynamically get the session URL
  Object.keys(result).forEach(integration => {
    const sessionData = result[integration]; // Access the object inside
    const sessionURL = sessionData?.session_url || "NA"; // Extract the URL

    console.log(`Session URL for ${integration}:`, sessionURL);

    switch (integration) {
      case "CRASHLYTICS":
        // console.log("Sending session URL to Crashlytics:", sessionURL);
        crashlytics().setAttribute("VWOSessionURL", sessionURL);
        break;
 

      case "MIXPANEL":
        mixpanel.track("VWO_Event", {
          "VWO": sessionURL
        })
        
        break;
 
      case "MOENGAGE":
        ReactMoE.setUserUniqueID("VWO_123");
        ReactMoE.setUserName("Parvesh");
        ReactMoE.setUserEmailID("johndoe@example.com");

    // Track an Event
    const eventProperties = new MoEProperties();
    eventProperties.addAttribute("session_url", sessionURL);
    ReactMoE.trackEvent("VWOSessionUpdated", eventProperties);
       
        break;

      default:
        console.log("Unknown integration:", integration);
        break;
    }
  });
    });
    return () => {
      appstatelistener.remove();
      removeSessionRefreshListener();
    };
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
