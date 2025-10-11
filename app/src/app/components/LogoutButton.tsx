"use client";

import { Button } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { useAuth } from '../../context/authContext';

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button 
      variant="light" 
      color="red" 
      leftSection={<IconLogout size="1rem" />}
      onClick={logout}
      size="xs"
    >
      Logout
    </Button>
  );
}