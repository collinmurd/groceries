"use client";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import '@mantine/core/styles.css';
import { ActionIcon, Drawer, Group } from '@mantine/core';
import { List } from './components/List/List';
import Link from 'next/link';
import { IconAi, IconSettings } from '@tabler/icons-react';
import { LogoutButton } from './components/LogoutButton';
import { IngredientParser } from './components/IngredientParser';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
export default function Page() {
    return <App />;
}
function App() {
    var _a = __read(useDisclosure(false), 2), drawerOpened = _a[0], _b = _a[1], open = _b.open, close = _b.close;
    var _c = __read(useState(0), 2), refreshKey = _c[0], setRefreshKey = _c[1];
    var ingredientParserFinished = function () {
        setRefreshKey(function (prev) { return prev + 1; });
        close();
    };
    return (<div>
      <List key={refreshKey}/>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, marginBottom: 20 }}>
        <Group gap="md">
          <ActionIcon variant="subtle" size="xl" aria-label="features">
            <Link className="icon-link" href="/features">
              <IconSettings />
            </Link>
          </ActionIcon>
          <LogoutButton />
          <ActionIcon variant="subtle" size="xl" aria-label="ai" onClick={open}>
            <IconAi />
          </ActionIcon>
        </Group>
      </div>
      <Drawer opened={drawerOpened} onClose={close} padding="xl" size="xl">
        <IngredientParser finished={ingredientParserFinished}/>
      </Drawer>
    </div>);
}
//# sourceMappingURL=page.jsx.map