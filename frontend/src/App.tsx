import { BiometricRegistration } from './components/BiometricRegistration';
import { VotingForm } from './components/VotingForm';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Sistema de Votação ZK
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <BiometricRegistration />
          <VotingForm />
        </div>
      </div>
    </div>
  );
}
