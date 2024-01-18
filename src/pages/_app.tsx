import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import amplifyconfig from '@/amplifyconfiguration.json';
import type { AppProps } from 'next/app';
import { Authenticator } from '@aws-amplify/ui-react';

Amplify.configure(amplifyconfig,{
  ssr: true
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator>
      <Component {...pageProps} />
    </Authenticator>
  );
}
