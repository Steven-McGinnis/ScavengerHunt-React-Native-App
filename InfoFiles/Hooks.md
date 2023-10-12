## React Hooks

### useState

-   **useState(initialValue)**: Allows functional components to have state variables.
    ```jsx
    const [count, setCount] = useState(0);
    ```

### useEffect

-   **useEffect(effect, dependencies)**: Runs a function after the render is committed to the screen.
    ```jsx
    useEffect(() => {
        document.title = `Count: ${count}`;
    }, [count]);
    ```

### useContext

-   **useContext(MyContext)**: Returns the current context value for a given context.
    ```jsx
    const value = useContext(MyContext);
    ```

### useReducer

-   **useReducer(reducer, initialArg, init)**: An alternative to `useState`, returns the current state paired with a dispatch method.
    ```jsx
    const [state, dispatch] = useReducer(reducer, initialArg, init);
    ```

### useCallback

-   **useCallback(callback, dependencies)**: Returns a memoized version of the callback function.
    ```jsx
    const memoizedCallback = useCallback(() => {
        doSomething(a, b);
    }, [a, b]);
    ```

### useMemo

-   **useMemo(() => computeExpensiveValue(a, b), [a, b])**: Returns a memoized value.
    ```jsx
    const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
    ```

### useRef

-   **useRef(initialValue)**: Returns a mutable ref object.
    ```jsx
    const myRef = useRef(initialValue);
    ```

### useLayoutEffect

-   **useLayoutEffect(effect, dependencies)**: Identical to `useEffect`, but fires synchronously after all DOM mutations.
    ```jsx
    useLayoutEffect(() => {
        // effect
    }, [dependencies]);
    ```

### useImperativeHandle

-   **useImperativeHandle(ref, createHandle, [deps])**: Customizes the instance value that is exposed when using `ref`.
    ```jsx
    useImperativeHandle(
        ref,
        () => ({
            // value
        }),
        [deps]
    );
    ```

### useDebugValue

-   **useDebugValue(value, format)**: Can be used to display a label for custom hooks in React DevTools.
    ```jsx
    useDebugValue(value);
    ```

### useFocusEffect

-   **useFocusEffect(effect)**: Runs a side-effect function when the screen comes into focus, and cleans up the side effect when it goes out of focus.

    ```jsx
    import { useFocusEffect } from '@react-navigation/native';

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused

            return () => {
                // Clean up the side effect when the screen is unfocused
            };
        }, [])
    );
    ```

### useIsFocused

-   **useIsFocused()**: Returns true if the screen is focused, false otherwise.

    ```jsx
    import { useIsFocused } from '@react-navigation/native';

    const isFocused = useIsFocused();
    ```

### useNavigation

-   **useNavigation()**: Returns the navigation prop of the screen it's used within.

    ```jsx
    import { useNavigation } from '@react-navigation/native';

    const navigation = useNavigation();
    ```

### useRoute

-   **useRoute()**: Returns the route prop of the screen it's used within.

    ```jsx
    import { useRoute } from '@react-navigation/native';

    const route = useRoute();
    ```
