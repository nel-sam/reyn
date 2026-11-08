import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { createContext, useContext, useState } from 'react';

type Denomination = '$1' | '$100' | '10€' | '100€';

interface DenominationContextType {
  denomination: Denomination;
  setDenomination: (denom: Denomination) => void;
}

const DenominationContext = createContext<DenominationContextType | undefined>(undefined);

export function useDenomination() {
  const context = useContext(DenominationContext);
  if (context === undefined) {
    throw new Error('useDenomination must be used within DenominationProvider');
  }
  return context;
}

function DenominationProvider({ children }: { children: React.ReactNode }) {
  const [denomination, setDenomination] = useState<Denomination>("$100");

  return (
    <DenominationContext.Provider value={{ denomination, setDenomination }}>
      {children}
    </DenominationContext.Provider>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView>
      <DenominationProvider>
        <Stack screenOptions={{ headerShown: true }} />
      </DenominationProvider>
    </GestureHandlerRootView>);
}