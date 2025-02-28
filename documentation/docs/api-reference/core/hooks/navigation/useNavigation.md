---
id: useNavigation
title: useNavigation
sidebar_label: useNavigation 🆙
---

`useNavigation` is a hook that provides methods to navigate the app. Internally, it uses the `go` method of the [`routerProvider`][routerprovider]. 

This hook is a legacy hook and not recommended to use even though it is still available and not deprecated. We recommend using your router libraries' hooks and methods instead of this when dealing with the custom navigations.

If you're in need of a navigation hook to use to navigate between your actions and resources, we recommend using the [`useGo`](./useGo.md) and [`useGetToPath`](./useGetToPath.md) hooks.

```tsx
import { useNavigation } from "@refinedev/core";

const {
    list,
    create,
    edit,
    show,
    clone,
    push,
    replace,
    goBack,
    listUrl,
    createUrl,
    editUrl,
    showUrl,
    cloneUrl,
} = useNavigation();
```

## Return Values

:::info

All functions the `useNavigation` hook returns except `push`, `replace` and `goBack`, accepts a `meta` parameter. This is an optional parameter and can be used to pass additional parameters to the routes if they contain multiple parameters other than `id`.

:::

### `list`

It is a method that navigates to the list page of the given resource.

```tsx
import { useNavigation } from "@refinedev/core";

const { list } = useNavigation();

list("posts"); // It navigates to the `/posts` page
```

You can also give a `type` property as a second parameter to the `list` method.

### `create`

It is a method that navigates to the create page of the given resource.

```tsx
import { useNavigation } from "@refinedev/core";

const { create } = useNavigation();

create("posts"); // It navigates to the `/posts/create` page
```

You can also give a `type` property as a second parameter to the `create` method.

### `edit`

It is a method that navigates to the edit page of the given resource and id. When you use this method, you need to give the `id` of the record you want to edit.

```tsx
import { useNavigation } from "@refinedev/core";

const { edit } = useNavigation();

edit("posts", "1"); // It navigates to the `/posts/edit/1` page
```

You can also give a `type` property as a third parameter to the `edit` method.

### `show`

It is a method that navigates to the show page of the given resource and id. When you use this method, you need to give the `id` of the record you want to show.

```tsx
import { useNavigation } from "@refinedev/core";

const { show } = useNavigation();

show("posts", "1"); // It navigates to the `/posts/show/1` page
```

You can also give a `type` property as a third parameter to the `show` method.

### `clone`

It is a method that navigates to the clone page of the given resource and id. When you use this method, you need to give the `id` of the record you want to clone.

```tsx
import { useNavigation } from "@refinedev/core";

const { clone } = useNavigation();

clone("posts", "1"); // It navigates to the `/posts/clone/1` page
```

You can also give a `type` property as a third parameter to the `clone` method.

### `push`

It is a method that pushes a new entry onto the history stack. It uses the `push` method of the `useHistory` from the [`routerProvider`][routerprovider].

```tsx
import { useNavigation } from "@refinedev/core";

const { push } = useNavigation();

push("custom-page"); // It navigates to the `/custom-page` page
```

`push` method parameters are dependent on your router provider.

### `replace`

It is a method that replaces the current entry on the history stack. It uses the `replace` method of the `useHistory` from the [`routerProvider`][routerprovider].

```tsx
import { useNavigation } from "@refinedev/core";

const { replace } = useNavigation();

replace("custom-page"); // It navigates to the `/custom-page` page
```

`replace` method parameters are dependent on your router provider.

### `goBack`

It is a method that navigates to the previous page. It uses the `goBack` method of the `useHistory` from the [`routerProvider`][routerprovider].

```tsx
import { useNavigation } from "@refinedev/core";

const { goBack } = useNavigation();

goBack(); // It navigates to the previous page
```

`goBack` method parameters are dependent on your router provider.

### `listUrl`

It is a method that returns the list page URL of the given resource.

```tsx
import { useNavigation } from "@refinedev/core";

const { listUrl } = useNavigation();

listUrl("posts"); // It returns the `/posts` URL
```

### `createUrl`

It is a method that returns the create page URL of the given resource.

```tsx
import { useNavigation } from "@refinedev/core";

const { createUrl } = useNavigation();

createUrl("posts"); // It returns the `/posts/create` URL
```

### `editUrl`

It is a method that returns the edit page URL of the given resource and id.

```tsx
import { useNavigation } from "@refinedev/core";

const { editUrl } = useNavigation();

editUrl("posts", "1"); // It returns the `/posts/edit/1` URL
```

### `showUrl`

It is a method that returns the show page URL of the given resource and id.

```tsx
import { useNavigation } from "@refinedev/core";

const { showUrl } = useNavigation();

showUrl("posts", "1"); // It returns the `/posts/show/1` URL
```

### `cloneUrl`

It is a method that returns the clone page URL of the given resource and id.

```tsx
import { useNavigation } from "@refinedev/core";

const { cloneUrl } = useNavigation();

cloneUrl("posts", "1"); // It returns the `/posts/clone/1` URL
```

## API Reference

### Return values

| Property  | Description                                                 | Type                                                                                  |
| --------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| list      | Method that navigates to the list page                      | ( resource: string, type: [HistoryType](#interface), meta?: Record<string, any> ) => void                         |
| create    | Method that navigates to the create page                    | ( resource: string, type: [HistoryType](#interface), meta?: Record<string, any> ) => void                         |
| edit      | Method that navigates to the edit page                      | ( resource: string, id: [BaseKey][basekey], type: [HistoryType](#interface), meta?: Record<string, any> ) => void |
| show      | Method that navigates to the show page                      | ( resource: string, id: [BaseKey][basekey], type: [HistoryType](#interface), meta?: Record<string, any> ) => void |
| clone     | Method that navigates to the clone page                     | ( resource: string, id: [BaseKey][basekey], type: [HistoryType](#interface), meta?: Record<string, any> ) => void |
| push      | Method that pushes the given path to the history stack      | ( path: string, ...rest: unknown[] ) => void                                          |
| replace   | Method that replaces the current entry on the history stack | ( path: string, ...rest: unknown[] ) => void                                          |
| goBack    | Method that navigates to the previous page                  | () => void                                                                            |
| listUrl   | Method that returns the list page URL                       | ( resource: string, meta?: Record<string, any> ) => string                                                        |
| createUrl | Method that returns the create page URL                     | ( resource: string, meta?: Record<string, any> ) => string                                                        |
| editUrl   | Method that returns the edit page URL                       | ( resource: string, id: [BaseKey][basekey], meta?: Record<string, any> ) => string                                |
| showUrl   | Method that returns the show page URL                       | ( resource: string, id: [BaseKey][basekey], meta?: Record<string, any> ) => string                                |
| cloneUrl  | Method that returns the clone page URL                      | ( resource: string, id: [BaseKey][basekey], meta?: Record<string, any> ) => string                                |

#### Interface

```tsx title="History Type"
export type HistoryType = "push" | "replace";
```

[routerprovider]: /api-reference/core/providers/router-provider.md
[basekey]: /api-reference/core/interfaces.md#basekey
