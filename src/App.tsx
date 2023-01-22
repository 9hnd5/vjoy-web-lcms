import jsonServerProvider from "ra-data-json-server";
import { Admin, defaultTheme, ListGuesser, Resource } from "react-admin";
const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");
const theme = {
  ...defaultTheme,
  typography: {
    ...defaultTheme.typography,
    fontFamily: "SVN-Gotham",
    fontSize: 16,
  },
};
const App = () => {
  console.log(ENV.API_URL);
  return (
    <Admin dataProvider={dataProvider} theme={theme}>
      <Resource name="posts" list={ListGuesser} />
      <Resource name="comments" list={ListGuesser} />
    </Admin>
  );
};

export default App;
