// src/pages/Home.js - Actualizat pentru BlenderKit
import React, { useState } from 'react';
import TreeViewer from '../../Tree3D/TreeViewer';
import './Home.css'
import BgImg from '../../../image/amazon.jpg';
import Shield from '../../../image/shield.png';
import { Link } from 'react-router-dom';
import BG from './bgHome';

import Des from './test'


const Home = () => {
  const [selectedModel, setSelectedModel] = useState('blenderkit');

  // Opțiuni pentru modele de copaci
  const treeModels = [
    {
      id: 'blenderkit',
      name: 'BlenderKit Professional Tree',
      description: 'High-quality tree from BlenderKit',
      modelUrl: '/tree.glb',
      fallbackToProcedural: true
    },
    {
      id: 'procedural',
      name: 'Procedural Tree',
      description: 'Generated using Three.js',
      modelUrl: null,
      fallbackToProcedural: false
    }
  ];

  const currentModel = treeModels.find(model => model.id === selectedModel);

  return (
    <>
    <BG />
    <Des    />
 



   
     {/* Stats Section */}
<div className="text-center mb-16">
  <h2 className='text-yellow-400 text-4xl w-full text-center my-12'>Our Impact Together</h2>

 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
  
  {/* Card 1 - Monitor & Protect */}
  <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-green-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-green-800 before:to-green-600">
    <div className="text-4xl mb-4 block">🌲</div>
    <h3 className="text-green-800 text-lg font-semibold mb-3">Monitor & Protect</h3>
    <p className="text-gray-700 text-sm mb-3 leading-relaxed">
      Use satellite data and community reports to track deforestation in real-time and protect vulnerable forest areas.
    </p>
    <small className="text-green-600 italic font-medium">Every tree matters</small>
  </div>

  {/* Card 2 - Report & Alert */}
  <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-red-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-red-600 before:to-red-300">
    <div className="text-4xl mb-4 block">⚠️</div>
    <h3 className="text-red-600 text-lg font-semibold mb-3">Report & Alert</h3>
    <p className="text-gray-700 text-sm mb-3 leading-relaxed">
      Document illegal logging, pollution, and environmental threats. Your reports help authorities respond quickly to save ecosystems.
    </p>
    <small className="text-green-600 italic font-medium">Be nature's voice</small>
  </div>

  {/* Card 3 - Educate & Awareness */}
  <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-sky-400 before:to-blue-200">
    <div className="text-4xl mb-4 block">📚</div>
    <h3 className="text-sky-400 text-lg font-semibold mb-3">Educate & Awareness</h3>
    <p className="text-gray-700 text-sm mb-3 leading-relaxed">
      Share knowledge about conservation, sustainable practices, and climate action to inspire others in your community.
    </p>
    <small className="text-green-600 italic font-medium">Knowledge is power</small>
  </div>

  {/* Card 4 - Connect & Collaborate */}
  <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-amber-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-amber-700 before:to-amber-400">
    <div className="text-4xl mb-4 block">🤝</div>
    <h3 className="text-amber-700 text-lg font-semibold mb-3">Connect & Collaborate</h3>
    <p className="text-gray-700 text-sm mb-3 leading-relaxed">
      Join local environmental groups, participate in tree planting events, and work together on conservation projects.
    </p>
    <small className="text-green-600 italic font-medium">Together we're stronger</small>
  </div>

</div>

{/* Versiune alternativă cu acțiuni concrete */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-12">
  
  {/* Card 1 - Reduce Carbon Footprint */}
  <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-emerald-600 before:to-emerald-400">
    <div className="text-4xl mb-4 block">🌍</div>
    <h3 className="text-emerald-700 text-lg font-semibold mb-3">Reduce Carbon Footprint</h3>
    <p className="text-gray-700 text-sm mb-3 leading-relaxed">
      Use renewable energy, choose sustainable transport, and make eco-friendly lifestyle choices to combat climate change.
    </p>
    <small className="text-emerald-600 italic font-medium">Small changes, big impact</small>
  </div>

  {/* Card 2 - Support Reforestation */}
  <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-lime-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-lime-600 before:to-lime-400">
    <div className="text-4xl mb-4 block">🌱</div>
    <h3 className="text-lime-700 text-lg font-semibold mb-3">Support Reforestation</h3>
    <p className="text-gray-700 text-sm mb-3 leading-relaxed">
      Donate to tree-planting organizations, participate in local planting events, or adopt a tree to restore forest ecosystems.
    </p>
    <small className="text-lime-600 italic font-medium">Plant hope for the future</small>
  </div>

  {/* Card 3 - Choose Sustainable Products */}
  <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-teal-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-teal-600 before:to-teal-400">
    <div className="text-4xl mb-4 block">♻️</div>
    <h3 className="text-teal-700 text-lg font-semibold mb-3">Choose Sustainable Products</h3>
    <p className="text-gray-700 text-sm mb-3 leading-relaxed">
      Buy from eco-certified brands, reduce plastic use, and support companies committed to environmental responsibility.
    </p>
    <small className="text-teal-600 italic font-medium">Vote with your wallet</small>
  </div>

  {/* Card 4 - Advocate for Change */}
  <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-orange-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-orange-600 before:to-orange-400">
    <div className="text-4xl mb-4 block">📢</div>
    <h3 className="text-orange-700 text-lg font-semibold mb-3">Advocate for Change</h3>
    <p className="text-gray-700 text-sm mb-3 leading-relaxed">
      Contact representatives, support environmental policies, and use your voice to demand action on climate and conservation issues.
    </p>
    <small className="text-orange-600 italic font-medium">Your voice matters</small>
  </div>

</div>

{/* Action Section */}

<div className="text-center py-12 px-8 bg-gradient-to-br from-green-800 to-green-600 mt-10 pb-20 text-white">
      <h2 className="text-4xl font-bold mb-10 drop-shadow-lg">Take Action Now</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 max-w-6xl mx-auto">
        
        {/* Monitor Forests Card */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/15 hover:-translate-y-2 transition-all duration-300">
          <h3 className="text-xl font-semibold mb-4 text-white">🗺️ Monitor Forests</h3>
          <p className="mb-6 text-white/90 leading-relaxed">
            Use our interactive map to track deforestation in real-time
          </p>
          <Link 
            to="/map"
            className="inline-block bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/50 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm no-underline"
          >
            View Map
          </Link>
        </div>

        {/* Report Activity Card */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/15 hover:-translate-y-2 transition-all duration-300">
          <h3 className="text-xl font-semibold mb-4 text-white">📢 Report Activity</h3>
          <p className="mb-6 text-white/90 leading-relaxed">
            Alert the community about suspicious deforestation activities
          </p>
          <Link 
            to="/alert"
            className="inline-block bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/50 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm no-underline"
          >
            Create Alert
          </Link>
        </div>

        {/* Join Community Card */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/15 hover:-translate-y-2 transition-all duration-300">
          <h3 className="text-xl font-semibold mb-4 text-white">🤝 Join Community</h3>
          <p className="mb-6 text-white/90 leading-relaxed">
            Connect with other forest protectors and share knowledge
          </p>
          <Link 
            to="/account"
            className="inline-block bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/50 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm no-underline"
          >
            My Account
          </Link>
        </div>

      </div>
  
</div> 
  </>
  );
};

export default Home;