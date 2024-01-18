import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const callAPI = () => {
  fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ input: 'Who are you?' })
  });
};

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
     
     <button onClick={callAPI}>Click me</button>
    </main>
  )
}
