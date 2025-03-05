#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <Firebase.h>
#import <ReactNativeMoEngage/MoEngageInitializer.h>
#import <MoEngageSDK/MoEngageSDK.h>
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"projetest";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  [FIRApp configure];
//  FIRCrashlytics.crashlytics.collectionEnabled = YES;  // Make sure this is enabled
  [[FIRCrashlytics crashlytics] log:@"Test Crash from Objective-C"];
  [[FIRCrashlytics crashlytics] setUserID:@"TestUser"];
  [[FIRCrashlytics crashlytics] recordError:[NSError errorWithDomain:@"TestDomain" code:123 userInfo:nil]];

      [FIRCrashlytics.crashlytics setCrashlyticsCollectionEnabled:YES];
  
  MoEngageSDKConfig* sdkConfig = [[MoEngageSDKConfig alloc] initWithAppId:@"R4D6OPLRCPH04BL24NXMN48G" dataCenter: MoEngageDataCenterData_center_default];
      sdkConfig.consoleLogConfig = [[MoEngageConsoleLogConfig alloc] initWithIsLoggingEnabled:true loglevel:MoEngageLoggerTypeVerbose];
      [[MoEngageInitializer sharedInstance] initializeDefaultSDKConfig:sdkConfig andLaunchOptions:launchOptions];
  
  NSTimeInterval delayInSeconds = 20.0;
  dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delayInSeconds * NSEC_PER_SEC));
  dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
    NSLog(@"Do some work");
//    [NSException raise:@"TestException" format:@"Testing Crashlytics debug mode"];
  });
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
