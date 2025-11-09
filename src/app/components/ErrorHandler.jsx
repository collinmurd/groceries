import { Alert, Button, Center, Stack } from '@mantine/core';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';
export default function ErrorHandler(props) {
    return (<div>
      {props.error ? <ErrorPage message={props.error}/> : props.children}
    </div>);
}
function ErrorPage(props) {
    var handleRefresh = function () {
        window.location.reload();
    };
    return (<Center style={{ minHeight: '50vh', padding: '2rem' }}>
      <Stack gap="md" style={{ maxWidth: 500, textAlign: 'center' }}>
        <Alert icon={<IconAlertTriangle size="1.5rem"/>} title="Connection Error" color="orange" variant="light">
          {props.message}
        </Alert>
        
        <Button leftSection={<IconRefresh size="1rem"/>} onClick={handleRefresh} variant="light">
          Refresh Page
        </Button>
      </Stack>
    </Center>);
}
//# sourceMappingURL=ErrorHandler.jsx.map