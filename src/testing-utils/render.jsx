import { render as testingLibraryRender } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import React from 'react';
export function render(ui) {
    return testingLibraryRender(<>{ui}</>, {
        wrapper: function (_a) {
            var children = _a.children;
            return (<MantineProvider>{children}</MantineProvider>);
        },
    });
}
//# sourceMappingURL=render.jsx.map