# Website by React

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

## AWS

### Amplify

- `Access denied` error when refresh page in production
  - The error is caued by the Amplify setting.
  - [Getting an "Access Denied" error when I reload my React app on AWS Amplify](https://stackoverflow.com/questions/63025997/getting-an-access-denied-error-when-i-reload-my-react-app-on-aws-amplify)

## Recharts

- `<ReferenceLine />`
  - Add a horizontal or vertical line to a plot as reference
  - [ReferenceLine](https://recharts.org/en-US/api/ReferenceLine)

## React

- React directory structure
  - [React Architecture: How to Structure and Organize a React Application](https://www.taniarascia.com/react-architecture-directory-structure/)
- Render HTML string to React component
  - `$ npm install html-react-parser; import parse from 'html-react-parser'; parse('<p>HTML_STRING<p>');`
  - [html-react-parser](https://github.com/remarkablemark/html-react-parser)
- Start React app
  - `$ npm start`

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

## React Router

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

## TypeScript

- `JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.`
  - Close VS code and restart it.

## Reference

- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
