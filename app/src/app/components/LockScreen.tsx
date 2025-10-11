"use client";

import '@mantine/core/styles.css';
import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import { Button, TextInput, Checkbox, Stack, Title, Alert, Center, Paper } from '@mantine/core';
import { IconLock, IconAlertCircle } from '@tabler/icons-react';

export function LockScreen() {
  const { login, error, rememberDevice, setRememberDevice } = useAuth();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    setLoading(true);
    try {
      await login(pin);
      setPin('');
    } catch (err) {
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center style={{ minHeight: '100vh', padding: '1rem' }}>
      <Paper shadow="md" p="xl" style={{ width: '100%', maxWidth: 400 }}>
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Center>
              <IconLock size={48} color="gray" />
            </Center>
            
            <Title order={2} ta="center">
              Enter PIN
            </Title>
            
            {error && (
              <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                {error}
              </Alert>
            )}
            
            <TextInput
              value={pin}
              onChange={(e) => setPin(e.currentTarget.value)}
              placeholder="Enter your PIN"
              type="password"
              size="lg"
              inputMode="numeric"
              pattern="[0-9]*"
              autoFocus
            />
            
            <Checkbox
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.currentTarget.checked)}
              label="Remember this device"
              size="sm"
            />
            
            <Button
              type="submit"
              size="lg"
              loading={loading}
              disabled={!pin.trim()}
              fullWidth
            >
              {loading ? 'Unlocking...' : 'Unlock'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
