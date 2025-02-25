import React from "react";
import type { RefineProps } from "@refinedev/core";
import { RefineCommonScope } from "./common";
import * as RefineChakra from "@refinedev/chakra-ui";
import * as ChakraUI from "@chakra-ui/react";
import * as ReactHookForm from "react-hook-form";

const SIMPLE_REST_API_URL = "https://api.fake-rest.refine.dev";

const RefineChakraDemo: React.FC<
    Partial<RefineProps> & {
        initialRoutes?: string[];
    }
> = ({ initialRoutes, ...rest }) => {
    if (initialRoutes) {
        RefineCommonScope.setInitialRoutes(initialRoutes);
    }

    return (
        <ChakraUI.ChakraProvider theme={RefineChakra.refineTheme}>
            <RefineCommonScope.RefineCore.Refine
                legacyRouterProvider={
                    RefineCommonScope.LegacyRefineReactRouterV6.default
                }
                dataProvider={RefineCommonScope.RefineSimpleRest.default(
                    SIMPLE_REST_API_URL,
                )}
                notificationProvider={RefineChakra.notificationProvider}
                Layout={RefineChakra.Layout}
                Sider={() => null}
                catchAll={<RefineChakra.ErrorComponent />}
                options={{
                    disableTelemetry: true,
                    reactQuery: {
                        devtoolConfig: false,
                    },
                }}
                {...rest}
            />
        </ChakraUI.ChakraProvider>
    );
};

const AntdScope = {
    // ...RefineCommonScope,
    // RefineAntdDemo,
    // RefineAntd,
    // RefineMuiDemo,
    // RefineMui,
    // RefineMantine,
    // RefineMantineDemo,
    RefineChakra,
    RefineChakraDemo,
    ChakraUI,
    ReactHookForm,
    // // Other Packages
    // RefineReactHookForm,
    // RefineReactTable,
};

export default AntdScope;
