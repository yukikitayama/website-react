# Website by React and AWS

- Website URL
  - [https://yukikitayama.com](https://yukikitayama.com)
- API URL
  - [https://api.yukikitayama.com](https://api.yukikitayama.com)

![Architecture](https://github.com/yukikitayama/website-react/blob/main/src/assets/website_react_architecture.png)

## MongoDB

- Difference between `$match` and `$filter`
  - `$match` filters the documents which match the specified conditions.
  - `$filter` has argument `input` which is an array in MongoDB. So it intends to get a subset of an array in a document.
- `$` prefix to field name 
  - Only use the `$` prefix when the field name is used in a value, not as a key.
- Dot notation
  - Access nested field. e.g. `{ '_id': { 'key': 'value' } }` can be `'_id.key'` to access `value`
- PyMongo finds all but select fields
  - `database.collection.find({}, {field1: 1, field2: 0})`
  - The first `{}` is where statement, and the second `{}` is select statement.
  - `field1` is included, but `field2` is excluded.
  - MongoDB ID is included by default implicitly.
  - [How to select a single field for all documents in a MongoDB collection?](https://stackoverflow.com/questions/25589113/how-to-select-a-single-field-for-all-documents-in-a-mongodb-collection)
- `update_one(filter, update)`
  - Update document
    - [How do I update a Mongo document after inserting it?](https://stackoverflow.com/questions/4372797/how-do-i-update-a-mongo-document-after-inserting-it)
  - `filter` is dictionary to match document. Use `{ '_id': DOCUMENT_ID }`
  - `update` is also dictionary to set a new filed or delete a field
    - Use `{ '$set': { 'NEW_FIELD_NAME': VALUE }, '$unset': { 'EXISTING_FIELD': 1 } }` to add AND delete fields.

## Redis

- xxx

## AWS

### Amplify

- `Access denied` error when refresh page in production
  - The error is caued by the Amplify setting.
  - [Getting an "Access Denied" error when I reload my React app on AWS Amplify](https://stackoverflow.com/questions/63025997/getting-an-access-denied-error-when-i-reload-my-react-app-on-aws-amplify)

## Recharts

- `<ReferenceLine />`
  - Add a horizontal or vertical line to a plot as reference
  - [ReferenceLine](https://recharts.org/en-US/api/ReferenceLine)
- `<Pie />` shows name as label, not value
  - Need to make a function and set the label to pointt to the function
  - [Rechart - adding labels to charts](https://stackoverflow.com/questions/56104004/rechart-adding-labels-to-charts)

## React

- React directory structure
  - [React Architecture: How to Structure and Organize a React Application](https://www.taniarascia.com/react-architecture-directory-structure/)
- Render HTML string to React component
  - `$ npm install html-react-parser; import parse from 'html-react-parser'; parse('<p>HTML_STRING<p>');`
  - [html-react-parser](https://github.com/remarkablemark/html-react-parser)
- Start React app
  - `$ npm start`
- Render list of data

```JavaScript
{DATA.map((item) => {
  return <JSX key={item.UNIQUE_VALUE}>item do SOMETHING</JSX>;
})}
```

- Wrapper components
  - Use it when we wanna inject JSX of other components to a component.
  - Wrapping component needs to accept `props` parameter, and add `{props.children}` between the opening and closing JSX elements where we wanna inject JSX of other components.
  - Wrapped component needs to be wrapped by the wrapping component opening and closing JSX elements.

### Props

- Parameters of components to pass data.
- Every React component receives one parameter typically named `props`.
  - `props` is a key-value pair.
  - Key is the individual parameter name
  - Value is the data passed from outside component.

### React Hooks

- Hooks are something starting with `use`.
  - Such as `useState, useEffect, useReducer, ...`
- Only used in React components, which are JavaScript functions returning JSX.
  - Don't use in a normal JavaScript function.
- Use right below the React component declaration (top-level).
  - Don't use in a nested React Hook functions.
  - Don't use in a if statement.

### Side Effect

- `Side effect` is any functionality except the main React jobs such as rendering interface components and reacting to user inpute.
  - Examples of side effect is storing data in browser storage, sending HTTP requests and setting timers.

### Effect Hook

- `Effect hook` Contains the functions executed after every component evaluation if the dependencies changed.
- `useEffect(() => { ... }, [ dependencies ]);`
- Dependencies can omit React `useState()` functions.
- If dependency array is empty the useEffect() runs only once when the component is rendered.
- If there is not even empty dependency array, the function runs every time a component changes, so it's a rare use case.
- Run `fetch()` when a component mounts
  - [How to fetch data with React Hooks](https://www.robinwieruch.de/react-hooks-fetch-data/)

### useReducer()

- `useReducer()` is a replacement for `useState()` to manage a more complex state.
- `const [state, dispatchFunction] = useReducer(reducterFunction, initialState, initialFunction);`
  - Dispatch function triggers an update of the state.
  - Reducer function receives the latest state and action to produce a new state, triggered by dispatch function.
- Group the related multiple states and actions.

### Context API

- Make component-wide state storage.
- `const SomeContext = React.createContext({ ... });`
  - Default object for the context
  - Used in `useContext( ... );`
- Context provider
```javascript
const SomeContextProvider = (props) => {
  return (
    <SomeContext.Provider value={contextValue}>
      {props.children}
    </SomeContext.Provider>
  );
}
```
  - Defines functions and states inside
- Limitation
  - Not optimized for high frequency changes.
    - Redux is better

### useCallback()

- Hook to save a function that doesn't change, so a new function is not generated when a component is rendered again.

### useMemo()

- Hook to save a value, so the value won't be recreated.

### Deployment

- `npm run build`
  - Production code is in `build` folder

### Animation

- [react-transition-group](https://github.com/reactjs/react-transition-group)
  - Starting point
- [react-motion](https://github.com/chenglou/react-motion)
- [react-move](https://github.com/sghall/react-move)
  - Complicated
- [react-router-transition](https://github.com/maisano/react-router-transition)

### Test

- `$ npm test`
- Type of test
  - `Unit test`
    - Test the individual building blocks (functions, components) in isolation
  - `Integration test`
    - Test the combination of multiple building blocks
  - `End-to-End (e2e) test`
    - Test complete scenarios in app as the user would experience
- `Three A's`
  - `Arrange`: Set up the test data, test conditions, and test environment
  - `Act`: Run logic that should be tested
  - `Assert`: Compare execution results with expected results
- `find`, instead of `get`, returns promise
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### CSS

- `CSS module`
  - `XXX.module.css`
- In CSS, define classes by `.CLASS_NAME { SOME_KEY: SOME_VALUE; }`
- In JavaScript, use classes by 
  - `import classes from './CSS_FILE.css';`
  - `<ELEMENT className={classes.CLASS_NAME}>`
- Add font to React
  - [How to Add Fonts to a React Project](https://www.better.dev/how-to-add-fonts-to-a-react-project)
  - [Ubuntu Google Fonts](https://fonts.google.com/specimen/Ubuntu)

## Redux

- State management system for cross-component or app-wide state.
- Advantage of Redux over React Context
  - When an app is complex, React Context will have multiple contexts, resulting in deeply nested context providers.
  - React Context is not for high-frequency state changes.
- Wrap components with Provider with the store to allow the component to access the Redux.
  - `<Provider store={store}><App /></Provider>`
- Use `useSelector() from 'react-redux'` to get the latest state.
- Use `useDispatch() from 'react-redux'` to send action to update state.
  - Action payload is object
  - In redux toolkit, the payload is accessed by `action.payload.OBJECT_KEY`
  - Do HTTP requests before or after the `useDispatch()` because reducers need to be side-effect free and synchronous.
- Use `Redux Toolkit` to make it easier to implement Redux.
  - [Redux Toolkit](https://redux-toolkit.js.org/)
  - `$ npm install @reduxjs/toolkit`
- Reducers must be pure, side-effect free, synchronous functions. Side-effects and async tasks can be executed
  - Inside the components using useEffect()
  - Inside the action creators.
- `Thunk` is a function that delays an action until later.

## MUI

- React material user interface

### Card

- [React & Material UI #12: Cards + Cards layout with Grid](https://www.youtube.com/watch?v=UNCq01LNNrg)
- Change `<CardHeader>` title size
  - Use `titleTypographyProps={{variant: 'h1'}}`
  - [How to apply fontSize to CardHeader title in MUI?](https://stackoverflow.com/questions/55618721/how-to-apply-fontsize-to-cardheader-title-in-mui)
- Clickable card
  - `<CardActionArea onClick={event => console.log('Clicked')}>`

### Typography

- Troubleshoot: `<ul> cannot appear as a descendant of <p>`
  - Add `component={'span'}` to `<Typography>`.
  - [<div> cannot appear as a descendant of <p>](https://stackoverflow.com/questions/41928567/div-cannot-appear-as-a-descendant-of-p)

### Tabs

- Error: The value provided to the Tabs component is invalid. The Tab with this value (0) is not part of the document layout. Make sure the tab item is present in the document or that it's not display none.
- [Hide component that renders a Tabs](https://stackoverflow.com/questions/69024833/hide-component-that-renders-a-tabs)

## React Router

- Configuration
  - Wrap `<App />` with `<BrowserRouter></BrowserRouter>`
  - `import { BrowserRouter } from 'react-router-dom';`
- Move to a different page with data
  - Pass the data as state `useHistory()`, and retrieve the data by `useLocation()`
  - [How to pass additional data while redirecting to a route in React](https://levelup.gitconnected.com/how-to-pass-additional-data-while-redirecting-to-different-route-f7bf5f95d48c)
  - [useLocation](https://v5.reactrouter.com/web/api/Hooks/uselocation)

```JavaScript
import { useHistory, useLocation } from 'react-rounter-dom';

// In component 1
const history = useHistory();
history.push({
  pathname: 'PATH',
  state: {KEY1: 'VALUE1', KEY2: 'VALUE2'}
})

// In component 2
const location = useLocation();
const {KEY1, KEY2} = location.state;
``` 

## JavaScript

- [Calculate last day of month](https://stackoverflow.com/questions/222309/calculate-last-day-of-month)
- Make `YYYY-MM-DD` in local timezone
  - `const yyyyMmDd = (new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)).toISOString().split("T")[0];`
  - getTime() returns milliseconds since Unix Epoch
  - getTimezoneOffset() returns minutes from UTC
  - Newly created Date object has the same date and time, but in UTC
  - [Format JavaScript date as yyyy-mm-dd](https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd)
- Merge two JSON objects by key
  - [merge two json object based on key value in javascript](https://stackoverflow.com/questions/30093561/merge-two-json-object-based-on-key-value-in-javascript)
- `ARRAY.filter()`
  - Automatically return a new array. It doesn't alter the old array.
- Default export
  - `export default NAME;`
  - Can be used by `import NAME from 'SOMEWHERE';`
- Named export
  - `export const NAME;`
  - Can be used by `import { NAME } from 'SOMEWHERE';`

## TypeScript

- `JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.`
  - Close VS code and restart it.

## Visual Studio Code

### Prettier Code Fommatter

- Preferences -> Settings -> User -> Search "format" -> Set "prettier" for default formmatter.
- Preferences -> Keyboard shortcuts -> Search "format document" -> `Shift + Alt + F`

## Reference

- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
