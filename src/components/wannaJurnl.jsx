import { useState } from 'react';

const WannaJurnl = ({ onNewEntry }) => {
    return (
        <div className="bg-[#658147] h-44 w-80 block items-center align-middle text-center py-14 rounded-[50px] mb-10 ml-6">
            <h1 className="leading-none text-center text-5xl font-mondwest -mt-6 text-[#D9D9D9]">wanna jurnl</h1>
            <button 
                className="leading-none text-8xl font-neuebit text-[#D9D9D9] -mt-4"
                onClick={onNewEntry}
            >+</button>
        </div>
    );
}

export default WannaJurnl;