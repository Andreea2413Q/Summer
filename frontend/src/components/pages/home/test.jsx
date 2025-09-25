import './bgt.css';
import Tree from '../../../image/tree.webp';
import Introduction from './Introduction';

export default function Test() {
    return (
        <div className="containerwithbg">
            {/* Divurile animate */}
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            
          
            <div className="content-overlay">
                <div className="w-full flex items-center justify-center">
                    <div className='w-1/2 flex text-6xl justify-center items-center relative'>
                        <h1 className="text-white w-full mx-auto text-center text-4xl">
                            Every minute, we lose 40 football fields worth of forest—that's
                            10 million hectares vanishing each year. In the time it takes you to read this introduction, another ancient tree has fallen,
                            silencing centuries of growth in seconds.
                        </h1>
                        <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-30 -z-10"></div>
                    </div>
                    
                    <div className="w-1/2 mr-5">
                        <img src={Tree} alt="Tree Icon" className="w-full h-full mb-4 rounded-xl mx-auto border-yellow-400 border-2" />
                    </div>
                </div>

                <Introduction />
            </div>

        </div>
    );
}