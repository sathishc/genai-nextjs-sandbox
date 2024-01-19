import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import amplifyconfig from '@/amplifyconfiguration.json';
import type { AppProps } from 'next/app';
import {
	Button,
	Flex,
	Text,
} from '@aws-amplify/ui-react'
import { Authenticator, AmplifyProvider, WithAuthenticatorProps } from '@aws-amplify/ui-react';

Amplify.configure({
  ...amplifyconfig,
  ssr: true
});

export default function App({ Component, pageProps,  }: AppProps, {signOut, user }:WithAuthenticatorProps ) {
  return (
      <Authenticator>
          <Flex justifyContent={'end'}>
            <Button onClick={signOut}>Sign Out</Button>
          </Flex>
          <Component {...pageProps} />
      </Authenticator>
  );
}
