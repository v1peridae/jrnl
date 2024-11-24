import { useEffect, useState } from 'react';
import { auth, provider } from '../firebaseConfig';
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function SignInWithGoogle() {
    const [value, setValue] = useState(null);
    const navigate = useNavigate();

    const handleClick = () => {
        signInWithPopup(auth, provider).then((data) => {
            setValue(data.user.email);
            localStorage.setItem('email', data.user.email);
            navigate('/journal'); // Navigate to journal after successful sign-in
        });
    };

    useEffect(() => {
        const email = localStorage.getItem('email');
        if (email) {
            setValue(email);
            navigate('/journal'); 
        }
    }, [navigate]);

    return (
        <div className="block pt-2 pb-3 h-screen w-screen bg-[#D9D9D9] text-[#597445]">
            <div className="block items-center text-center">
                <h1 className="font-mondwest text-9xl text-center leading-none mt-20">Jurnl</h1>
                <h2 className="font-neuebit text-6xl tracking-widest leading-none -mt-20 ml-56">A journal, on the web</h2>
            </div>
            <div className="flex justify-center">
                <button onClick={handleClick} className="font-mondwest text-6xl mt-36 mx-4 hover:text-[#729762] transition-all">
                    Sign In With Google
                </button>
            </div>
        </div>
    );
}

export default SignInWithGoogle;