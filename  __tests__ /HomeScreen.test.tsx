import { render, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import IntroScreen from "../src/screens/Intro";
import LoginScreen from "~/screens/LoginScreen";

test("navigates on Get Started press", () => {
  const { getByText } = render(
    <NavigationContainer>
      <IntroScreen />
    </NavigationContainer> 
  );

  fireEvent.press(getByText("Get Started"));
});

 const { getByTestId } = render(
  <NavigationContainer>
    <LoginScreen />
  </NavigationContainer>
);

const continueButton = getByTestId('continue-button');
expect(continueButton).toBeTruthy();
fireEvent.press(continueButton);
