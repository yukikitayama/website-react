# Website by React

## Implementation

- xxx

## MongoDB

- Difference between `$match` and `$filter`
  - `$match` filters the documents which match the specified conditions.
  - `$filter` has argument `input` which is an array in MongoDB. So it intends to get a subset of an array in a document.
- `$` prefix to field name 
  - Only use the `$` prefix when the field name is used in a value, not as a key.
- Dot notation
  - Access nested field. e.g. `{ '_id': { 'key': 'value' } }` can be `'_id.key'` to access `value`

## Recharts

- `<ReferenceLine />`
  - Add a horizontal or vertical line to a plot as reference
  - [ReferenceLine](https://recharts.org/en-US/api/ReferenceLine)

## React

- React directory structure
  - [React Architecture: How to Structure and Organize a React Application](https://www.taniarascia.com/react-architecture-directory-structure/)

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

### Typography

- Troubleshoot: `<ul> cannot appear as a descendant of <p>`
  - Add `component={'span'}` to `<Typography>`.
  - [<div> cannot appear as a descendant of <p>](https://stackoverflow.com/questions/41928567/div-cannot-appear-as-a-descendant-of-p)

## Reference

- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
