import GlobalProvider from './components/GlobalProvider';
import classes from './layout.module.css';
import './global.css';
export var metadata = {
    title: 'Groceries',
    description: 'My grocery list',
};
export var viewport = {
    maximumScale: 1,
};
export default function RootLayout(_a) {
    var children = _a.children;
    return (<html lang="en">
      <body>
        <div className={classes.app}>
          <GlobalProvider>
            <div id="root">{children}</div>
          </GlobalProvider>
        </div>
      </body>
    </html>);
}
//# sourceMappingURL=layout.jsx.map