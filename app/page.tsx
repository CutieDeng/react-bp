// app/page.tsx
import dynamic from 'next/dynamic';

const BlueprintEditor = dynamic(() => import('./components/Editor6'), {
  ssr: false,
});

export default function Home() {
  return (
    <main style={{ padding: '20px' }}>
      <h1>UE5-Style Blueprint Editor</h1>
      <BlueprintEditor width="100%" height="800px" />
    </main>
  );
}