import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, TextArea, LoadingSpinner } from '../components/UI';
import { Icons } from '../constants';
import { api, pb } from '../services/pocketbaseService';
import { Visibility } from '../types';

const CreateCharacterScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [greeting, setGreeting] = useState('');
  const [backstory, setBackstory] = useState('');
  const [personality, setPersonality] = useState('');
  const [style, setStyle] = useState(''); // Added Writing Style
  const [instructions, setInstructions] = useState('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.PRIVATE);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('owner', pb.authStore.model?.id || '');
      formData.append('name', name);
      if (image) formData.append('Image', image); // Capital I matches schema
      formData.append('greeting', greeting);
      formData.append('backstory', backstory);
      formData.append('personality', personality);
      formData.append('style', style);
      formData.append('instructions', instructions);
      formData.append('visibility', visibility);
      formData.append('shareId', Math.random().toString(36).substring(7));

      const newChar = await api.createCharacter(formData);
      navigate(`/character/${newChar.id}`);
    } catch (error) {
      console.error(error);
      alert('Failed to create character');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}>
          <Icons.Back className="text-[#F5D48B]" />
        </button>
        <h2 className="font-serif text-2xl text-white">Create Character</h2>
      </div>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full ${step >= i ? 'bg-[#F5D48B]' : 'bg-gray-800'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="animate-fade-in space-y-6">
          <h3 className="text-xl font-serif text-[#F5D48B]">The Identity</h3>
          <Input label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Lady Vex" />
          
          <div className="space-y-2">
             <label className="block text-[#F5D48B] font-serif text-sm">Portrait</label>
             <div className="border border-dashed border-white/20 rounded-lg p-8 text-center bg-white/5 relative">
               <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
               {image ? (
                 <span className="text-[#F5D48B]">{image.name}</span>
               ) : (
                 <span className="text-gray-500 text-sm">Tap to upload image</span>
               )}
             </div>
          </div>
          <Button onClick={() => name && setStep(2)}>Next Step</Button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in space-y-6">
          <h3 className="text-xl font-serif text-[#F5D48B]">First Impressions</h3>
          <TextArea 
            label="Greeting Message" 
            value={greeting} 
            onChange={e => setGreeting(e.target.value)} 
            placeholder="What do they say when the chat starts?"
            rows={4}
          />
          <Button onClick={() => greeting && setStep(3)}>Next Step</Button>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in space-y-6">
          <h3 className="text-xl font-serif text-[#F5D48B]">The Soul</h3>
          <TextArea label="Backstory" value={backstory} onChange={e => setBackstory(e.target.value)} placeholder="Their past..." />
          <TextArea label="Personality" value={personality} onChange={e => setPersonality(e.target.value)} placeholder="How they behave..." />
          
          {/* New Style Field */}
          <TextArea label="Writing Style" value={style} onChange={e => setStyle(e.target.value)} placeholder="e.g., Verbose, cryptic, slang..." />
          
          <TextArea label="RP Instructions" value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Directives for the AI..." />
          
          <div className="space-y-2">
            <label className="block text-[#F5D48B] font-serif text-sm">Visibility</label>
            <select 
              value={visibility} 
              onChange={(e) => setVisibility(e.target.value as Visibility)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F5D48B]"
            >
              <option value={Visibility.PRIVATE}>Private (Only you)</option>
              <option value={Visibility.LINK}>Unlisted (Link sharing)</option>
              <option value={Visibility.PUBLIC}>Public</option>
            </select>
          </div>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Bring to Life'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreateCharacterScreen;