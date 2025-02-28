---
id: data-provider
title: Data Provider
sidebar_label: Data Provider 🆙
---

import SupportedDataProviders from "@site/src/partials/data-provider/supported-data-providers.md";

The data provider acts as a data layer for your app that makes the HTTP requests and encapsulates how the data is retrieved. **refine** consumes these methods via data hooks.

You don't need to worry about creating data providers from scratch. **refine** offers built-in data provider support for the most popular [API providers](#supported-data-providers). So you can use one of them or you can [create your own data provider][create-a-data-provider] according to your needs.

<div>
    <img src="https://refine.ams3.cdn.digitaloceanspaces.com/website/static/img/guides-and-concepts/providers/data-provider/tutorial_dataprovider_flog.png" />
</div>

:::note
Data hooks use [TanStack Query](https://tanstack.com/query) to manage data fetching. It handles important concerns like caching, invalidation, loading states, etc.
:::

<br/>

## Usage

To activate the data provider in refine, we have to pass the `dataProvider` to the `<Refine />` component.

```tsx title="App.tsx"
import { Refine } from "@refinedev/core";

import dataProvider from "./dataProvider";

const App: React.FC = () => {
    return <Refine dataProvider={dataProvider} />;
};
```

[Refer to the Data Provider tutorial for more information and usage examples →][data-provider-tutorial]

## Multiple Data Providers

**refine** gives you the ability to use multiple data providers in your app. All you need to do is to pass key, value pairs to the `dataProvider` prop of the `<Refine />` component in a form of value being the data provider and the key being the name of the data provider.

Here is an example of using multiple data providers in your app:

```tsx live hideCode url=http://localhost:3000/posts previewHeight=420px
setInitialRoutes(["/posts"]);
setRefineProps({ Sider: () => null });

// visible-block-start
import { Refine, useList } from "@refinedev/core";
import dataProvider from "@refinedev/simple-rest";
import routerProvider from "@refinedev/react-router-v6";
import { Layout } from "@refinedev/antd";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Collapse, Tag } from "antd";

const API_URL = "https://api.fake-rest.refine.dev";
const FINE_FOODS_API_URL = "https://api.finefoods.refine.dev";

interface IPost {
    id: number;
    title: string;
    status: "published" | "draft" | "rejected";
}

interface IProduct {
    id: number;
    name: string;
    price: number;
}

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Refine
                routerProvider={routerProvider}
                // highlight-start
                dataProvider={{
                    default: dataProvider(API_URL),
                    fineFoods: dataProvider(FINE_FOODS_API_URL),
                }}
                // highlight-end
                resources={[
                    {
                        // highlight-next-line
                        // **refine** will use the `default` data provider for this resource
                        name: "posts",
                        list: "/posts",
                    },
                    {
                        name: "products",
                        meta: {
                            // highlight-start
                            // **refine** will use the `fineFoods` data provider for this resource
                            dataProviderName: "fineFoods",
                            // highlight-end
                        },
                    },
                ]}
            >
                <Routes>
                    <Route path="/posts" element={<PostList />} />
                </Routes>
            </Refine>
        </BrowserRouter>
    );
};

const PostList: React.FC = () => {
    const { data: posts } = useList<IPost>({
        resource: "posts",
        // highlight-start
        // Data provider can be selected through props
        dataProviderName: "default",
        // highlight-end
    });
    // highlight-start
    // We've defined the data provider for this resource as "fineFoods" in its config so we don't need to pass it here
    const { data: products } = useList<IProduct>({ resource: "products" });
    // highlight-end

    console.log({
        posts,
        products,
    });

    return (
        <Collapse defaultActiveKey={["products"]}>
            <Collapse.Panel header="Posts" key="posts">
                {posts?.data.map((post) => (
                    <div
                        key={post.title}
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "0.5rem",
                            marginBottom: "0.25rem",
                        }}
                    >
                        {post.title}
                        <Tag>{post.status}</Tag>
                    </div>
                ))}
            </Collapse.Panel>
            <Collapse.Panel header="Products" key="products">
                {products?.data.map((product) => (
                    <div
                        key={product.name}
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "0.5rem",
                            marginBottom: "0.25rem",
                        }}
                    >
                        {product.name}
                        <Tag>{product.price / 10}</Tag>
                    </div>
                ))}
            </Collapse.Panel>
        </Collapse>
    );
};
// visible-block-end

render(<App />);
```

:::caution
`default` key is required for the default data provider and it will be used as the default data provider.

```tsx title="App.tsx"
const App = () => {
    return (
        <Refine
            dataProvider={{
                default: defaultDataProvider,
                example: exampleDataProvider,
            }}
        >
            {/* ... */}
        </Refine>
    );
};
```

:::

You can pick data providers in two ways:

-   **Using `dataProviderName` prop in the data hooks and all data-related components/functions.**

```tsx
useTable({
    dataProviderName: "example",
});
```

-   **Using `meta.dataProviderName` property in your resource config**

This will be the default data provider for the specified resource but you can still override it in the data hooks and components.

```tsx
const App = () => {
    return (
        <Refine
            dataProvider={{
                default: defaultDataProvider,
                example: exampleDataProvider,
            }}
            resources={[
                {
                    // **refine** will use the `default` data provider for this resource
                    name: "posts",
                },
                {
                    name: "products",
                    meta: {
                        // **refine** will use the `exampleDataProvider` data provider for this resource
                        dataProviderName: "exampleDataProvider",
                    },
                },
            ]}
        />
    );
};
```

## Methods

Data provider's methods are expected to return a Promise. So, you can use these async methods to [create a data provider][create-a-data-provider].

```tsx
import { DataProvider } from "@refinedev/core";

const dataProvider: DataProvider = {
    // required methods
     ({
        resource,
        pagination,
        sorters,
        filters,
        meta,
    }) => Promise,
    create: ({ resource, variables, meta }) => Promise,
    update: ({ resource, id, variables, meta }) => Promise,
    deleteOne: ({ resource, id, variables, meta }) => Promise,
    getOne: ({ resource, id, meta }) => Promise,
    getApiUrl: () => "",
    // optional methods
    getMany: ({ resource, ids, meta }) => Promise,
    createMany: ({ resource, variables, meta }) => Promise,
    deleteMany: ({ resource, ids, variables, meta }) => Promise,
    updateMany: ({ resource, ids, variables, meta }) => Promise,
    custom: ({
        url,
        method,
        filters,
        sorters,
        payload,
        query,
        headers,
        meta,
    }) => Promise,
};
```

:::info-tip
**refine** consumes data provider methods using [data hooks](#supported-hooks).

Data hooks are used to operate CRUD actions like creating a new record, listing a resource or deleting a record, etc.

:::

[Refer to the Data Provider tutorial for more information and usage examples →][data-provider-tutorial]

### getList <PropTag required />

`getList` method is used to get a list of resources with sorting, filtering, and pagination features.
It takes `resource`, `sorters`, `pagination`, and, `filters` as parameters and returns `data` and `total`.

**refine** will consume this `getList` method using the [`useList`][use-list] or [`useInfiniteList`][use-infinite-list] data hook.

```ts
getList: async ({ resource, pagination, sorters, filters, meta }) => {
    const { current, pageSize, mode } = pagination;
    const { field, order } = sorters;
    const { field, operator, value } = filters;

    // You can handle the request according to your API requirements.

    return {
        data,
        total,
    };
};
```

:::tip

`getList` also can support cursor-based pagination. Refer to [this example](/docs/api-reference/core/hooks/data/useInfiniteList/#how-to-use-cursor-based-pagination) for more information.

:::

**Parameter Types:**

| Name        | Type                          |
| ----------- | ----------------------------- |
| resource    | `string`                      |
| pagination? | [`Pagination`][pagination]    |
| sorters?    | [`CrudSorting`][crud-sorting] |
| filters?    | [`CrudFilters`][crud-filters] |
| meta?       | [`MetaDataQuery`][meta-data]  |

### create <PropTag required/>

The `create` method creates a new record with the `resource` and `variables` parameters.

**refine** will consume this `create` method using the [`useCreate`][use-create] data hook.

```ts
create: async ({ resource, variables, meta }) => {
    // You can handle the request according to your API requirements.

    return {
        data,
    };
};
```

**Parameter Types**

| Name      | Type                         | Default |
| --------- | ---------------------------- | ------- |
| resource  | `string`                     |         |
| variables | `TVariables`                 | `{}`    |
| meta?     | [`MetaDataQuery`][meta-data] |

> `TVariables` is a user defined type which can be passed to [`useCreate`](/docs/api-reference/core/hooks/data/useCreate#type-parameters) to type `variables`.

### update <PropTag required />

The `update` method updates the record with the `resource`, `id`, and, `variables` parameters.

**refine** will consume this `update` method using the [`useUpdate`][use-update] data hook.

```ts
update: async ({ resource, id, variables, meta }) => {
    // You can handle the request according to your API requirements.

    return {
        data,
    };
};
```

**Parameter Types:**

| Name      | Type                         | Default |
| --------- | ---------------------------- | ------- |
| resource  | `string`                     |         |
| id        | [BaseKey][basekey]           |         |
| variables | `TVariables`                 | `{}`    |
| meta?     | [`MetaDataQuery`][meta-data] |

> `TVariables` is a user defined type which can be passed to [`useUpdate`](/docs/api-reference/core/hooks/data/useUpdate#type-parameters) to type `variables`.

### deleteOne <PropTag required />

The `deleteOne` method delete the record with the `resource` and `id` parameters.

**refine** will consume this `deleteOne` method using the [`useDelete`][use-delete] data hook.

```ts
deleteOne: async ({ resource, id, variables, meta }) => {
    // You can handle the request according to your API requirements.

    return {
        data,
    };
};
```

**Parameter Types:**

| Name      | Type                         | Default |
| --------- | ---------------------------- | ------- |
| resource  | `string`                     |         |
| id        | [BaseKey][basekey]           |         |
| variables | `TVariables[]`               | `{}`    |
| meta?     | [`MetaDataQuery`][meta-data] |

> `TVariables` is a user defined type which can be passed to [`useDelete`](/docs/api-reference/core/hooks/data/useDelete/) to type `variables`.

### getOne <PropTag required />

The `getOne` method gets the record with the `resource` and `id` parameters.

**refine** will consume this `getOne` method using the [`useOne`][use-one] data hook.

```ts
getOne: async ({ resource, id, meta }) => {
    // You can handle the request according to your API requirements.

    return {
        data,
    };
};
```

**Parameter Types:**

| Name     | Type                         | Default |
| -------- | ---------------------------- | ------- |
| resource | `string`                     |         |
| id       | [BaseKey][basekey]           |         |
| meta?    | [`MetaDataQuery`][meta-data] |

### getApiUrl <PropTag required />

The `getApiUrl` method returns the `apiUrl` value.

**refine** will consume this `getApiUrl` method using the [`useApiUrl`][use-api-url] data hook.

```ts title="src/data-provider.ts"
import { DataProvider } from "@refinedev/core";

export const dataProvider = (apiUrl: string): DataProvider => ({
    getApiUrl: () => apiUrl,
    // ...
});
```

### custom

An optional method named `custom` can be added to handle requests with custom parameters like URL, CRUD methods, and configurations.
It's useful if you have non-standard REST API endpoints or want to make a connection with external resources.

**refine** will consume this `custom` method using the [`useCustom`][use-custom] data hook.

```ts
custom: async ({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
    meta,
}) => {
    // You can handle the request according to your API requirements.

    return {
        data,
    };
};
```

**Parameter Types**

| Name     | Type                                                       |
| -------- | ---------------------------------------------------------- |
| url      | `string`                                                   |
| method   | `get`, `delete`, `head`, `options`, `post`, `put`, `patch` |
| sorters? | [`CrudSorting`][crud-sorting]                              |
| filters? | [`CrudFilters`][crud-filters]                              |
| payload? | `{}`                                                       |
| query?   | `{}`                                                       |
| headers? | `{}`                                                       |
| meta?    | [`MetaDataQuery`][meta-data]                               |

## Bulk Actions

Bulk actions are actions that can be performed on multiple items at once. Performing bulk actions is a common pattern in admin panels. If your API supports bulk actions, you can implement them in your data provider.

:::tip
Bulk operations are a way to perform many database operations at once, improving speed and efficiency. They can be used for data [`import`](/docs/api-reference/core/hooks/import-export/useImport/) and [`export`](/docs/api-reference/core/hooks/import-export/useExport/), and have the added benefit of being atomic, meaning that they are treated as a single unit.
:::

### getMany

The `getMany` method gets the records with the `resource` and `ids` parameters. Implementation of this method is optional. If you don't implement it, refine will use [`getOne`](#getone) method to handle multiple requests.

**refine** will consume this `getMany` method using the [`useMany`][use-many] data hook.

```ts
getMany: async ({ resource, ids, meta }) => {
    // You can handle the request according to your API requirements.

    return {
        data,
    };
};
```

**Parameter Types:**

| Name     | Type                         | Default |
| -------- | ---------------------------- | ------- |
| resource | `string`                     |         |
| ids      | [[BaseKey][basekey]]         |         |
| meta?    | [`MetaDataQuery`][meta-data] |

### createMany

This method allows us to create multiple items in a resource. Implementation of this method is optional. If you don't implement it, refine will use [`create`](#create) method to handle multiple requests.

**refine** will consume this `createMany` method using the [`useCreateMany`][use-create-many] data hook.

```ts
createMany: async ({ resource, variables, meta }) => {
    // You can handle the request according to your API requirements.

    return {
        data,
    };
};
```

**Parameter Types:**

| Name      | Type                         | Default |
| --------- | ---------------------------- | ------- |
| resource  | `string`                     |         |
| variables | `TVariables[]`               | `{}`    |
| meta?     | [`MetaDataQuery`][meta-data] |

> `TVariables` is a user defined type which can be passed to [`useCreateMany`][use-create-many] to type `variables`.

### deleteMany

This method allows us to delete multiple items in a resource. Implementation of this method is optional. If you don't implement it, refine will use [`deleteOne`](#deleteone) method to handle multiple requests.

**refine** will consume this `deleteMany` method using the [`useDeleteMany`][use-delete-many] data hook.

```ts
deleteMany: async ({ resource, ids, variables, meta }) => {
    // You can handle the request according to your API requirements.

    return {
        data,
    };
};
```

| Name      | Type                         | Default |
| --------- | ---------------------------- | ------- |
| resource  | `string`                     |         |
| ids       | [[BaseKey][basekey]]         |         |
| variables | `TVariables[]`               | `{}`    |
| meta?     | [`MetaDataQuery`][meta-data] |

> `TVariables` is a user defined type which can be passed to [`useDeleteMany`][use-delete-many] to type `variables`.

### updateMany

This method allows us to update multiple items in a resource. Implementation of this method is optional. If you don't implement it, refine will use [`update`](#update) method to handle multiple requests.

**refine** will consume this `updateMany` method using the [`useUpdateMany`][use-update-many] data hook.

```ts
updateMany: async ({ resource, ids, variables, meta }) => {
    // You can handle the request according to your API requirements.

    return {
        data,
    };
};
```

| Name      | Type                         | Default |
| --------- | ---------------------------- | ------- |
| resource  | `string`                     |         |
| ids       | [[BaseKey][basekey]]         |         |
| variables | `TVariables[]`               | `{}`    |
| meta?     | [`MetaDataQuery`][meta-data] |

> `TVariables` is a user defined type which can be passed to [`useUpdateMany`][use-update-many] to type `variables`.

## Error Format

**refine** expects errors to be extended from [`HttpError`][http-error].

Here is a basic example of how to implement error handling in your data provider.

```ts title="src/data-provider.ts"
import { DataProvider, HttpError } from "@refinedev/core";

export const dataProvider = (apiUrl: string): DataProvider => ({
    getOne: async ({ resource, id }) => {
        try {
            const response = await fetch(
                `https://api.example.com/${resource}/${id}`,
            );

            // highlight-start
            if (!response.ok) {
                const error: HttpError = {
                    message: response.statusText,
                    statusCode: response.status,
                };
                return Promise.reject(error);
            }
            // highlight-end

            return {
                data: response.data,
            };
        } catch (error) {
            // highlight-start
            const error: HttpError = {
                message: error?.message || "Something went wrong",
                statusCode: error?.status || 500,
            };
            return Promise.reject(error);
            // highlight-end
        }
    },
    // ...
});
```

Also, Axios interceptor can be used to transform the error from the response before Axios returns the response to your code. Interceptors are methods that are triggered before the main method.

```ts title="src/data-provider.ts"
// highlight-start
import axios from "axios";
import { DataProvider, HttpError } from "@refinedev/core";
// highlight-end
import { stringify } from "query-string";

// highlight-start
// Error handling with axios interceptors
const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const customError: HttpError = {
            ...error,
            message: error.response?.data?.message,
            statusCode: error.response?.status,
        };

        return Promise.reject(customError);
    },
);
// highlight-end

export const dataProvider = (apiUrl: string): DataProvider => ({
    // Methods
});
```

## meta Usage

When using APIs, you may wish to include custom parameters, such as a custom header. To accomplish this, you can utilize the `meta` field, which allows the sent parameter to be easily accessed by the data provider.

:::tip
The `meta` parameter can be used in all data, form, and table hooks.
:::

Here is an example of how to send a custom header parameter to the `getOne` method using `meta`:

-   Send a custom header parameter to the [`getOne`](#getone) method using `meta`.

```ts title="post/edit.tsx"
import { useOne } from "@refinedev/core";

useOne({
    resource: "post",
    id: "1",
    meta: {
        headers: {
            "x-custom-header": "hello world",
        },
    },
});
```

-   Get the `meta` parameter from the data provider.

```ts title="src/data-provider.ts"
import { DataProvider } from "@refinedev/core";

export const dataProvider = (apiUrl: string): DataProvider => ({
  ...
  getOne: async ({ resource, id, variables, meta }) => {
    // highlight-next-line
    const { headers } = meta;
    const url = `${apiUrl}/${resource}/${id}`;

    // highlight-start
    httpClient.defaults.headers = {
      ...headers,
    };
    // highlight-end

    const { data } = await httpClient.get(url, variables);

    return {
      data,
    };
  },
});
```

## Supported Data Providers

<SupportedDataProviders/>

## Supported Hooks

**refine** will consume:

-   [`getList`](#getlist) method using the [`useList`][use-list] or [`useInfiniteList`][use-infinite-list] data hook.
-   [`create`](#create) method using the [`useCreate`][use-create] data hook.
-   [`update`](#update) method using the [`useUpdate`][use-update] data hook.
-   [`deleteOne`](#deleteone) method using the [`useDeleteOne`][use-delete] data hook.
-   [`getOne`](#getone) method using the [`useOne`][use-one] data hook.
-   [`getApiUrl`](#getapiurl) method using the [`useApiUrl`][use-api-url] data hook.
-   [`custom`](#custom) method using the [`useCustom`][use-custom] data hook.
-   [`getMany`](#getmany) method using the [`useMany`][use-many] data hook.
-   [`createMany`](#createmany) method using the [`useCreateMany`][use-create-many] data hook.
-   [`deleteMany`](#deletemany) method using the [`useDeleteMany`][use-delete-many] data hook.
-   [`updateMany`](#updatemany) method using the [`useUpdateMany`][use-update-many] data hook.

## FAQ

### How can I create a custom data provider?

[Refer to the "Create Data Provider From Scratch" section in the tutorial for more information →][create-a-data-provider]

### How can I customize existing data providers?

[Refer to the "Create Data Provider with Swizzle" section in the tutorial for more information →][swizzle-a-data-provider]

### How I can override a specific method of Data Providers?

In some cases, you may need to override the method of **refine** data providers. The simplest way to do this is to use the [Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

For example, Let's override the `update` function of the [`@refinedev/simple-rest`](https://github.com/refinedev/refine/tree/next/packages/simple-rest). `@refinedev/simple-rest` uses the `PATCH` HTTP method for `update`, let's change it to `PUT` without forking the whole data provider.

```tsx
import dataProvider from "@refinedev/simple-rest";

const simpleRestProvider = dataProvider("API_URL");
const myDataProvider = {
    ...simpleRestProvider,
    update: async ({ resource, id, variables }) => {
        const url = `${apiUrl}/${resource}/${id}`;

        const { data } = await httpClient.put(url, variables);

        return {
            data,
        };
    },
};

<Refine dataProvider={myDataProvider}>{/* ... */}</Refine>;
```

[basekey]: /docs/api-reference/core/interfaceReferences/#basekey
[create-a-data-provider]: /docs/tutorial/understanding-dataprovider/create-dataprovider/
[swizzle-a-data-provider]: /docs/tutorial/understanding-dataprovider/swizzle/
[data-provider-tutorial]: /docs/tutorial/understanding-dataprovider/index/
[use-api-url]: /docs/api-reference/core/hooks/data/useApiUrl/
[use-create]: /docs/api-reference/core/hooks/data/useCreate/
[use-create-many]: /docs/api-reference/core/hooks/data/useCreateMany/
[use-custom]: /docs/api-reference/core/hooks/data/useCustom/
[use-custom-mutation]: /docs/api-reference/core/hooks/data/useCustomMutation/
[use-data-provider]: /docs/api-reference/core/hooks/data/useDataProvider/
[use-delete]: /docs/api-reference/core/hooks/data/useDelete/
[use-delete-many]: /docs/api-reference/core/hooks/data/useDeleteMany/
[use-list]: /docs/api-reference/core/hooks/data/useList/
[use-infinite-list]: /docs/api-reference/core/hooks/data/useInfiniteList/
[use-many]: /docs/api-reference/core/hooks/data/useMany/
[use-one]: /docs/api-reference/core/hooks/data/useOne/
[use-update]: /docs/api-reference/core/hooks/data/useUpdate/
[use-update-many]: /docs/api-reference/core/hooks/data/useUpdateMany/
[crud-sorting]: /docs/api-reference/core/interfaceReferences/#crudsorting
[crud-filters]: /docs/api-reference/core/interfaceReferences/#crudfilters
[pagination]: /docs/api-reference/core/interfaceReferences/#pagination
[http-error]: /docs/api-reference/core/interfaceReferences/#httperror
[meta-data]: /docs/api-reference/core/interfaceReferences/#metadataquery
