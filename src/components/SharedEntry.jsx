import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function SharedEntry() {
    const { entryId } = useParams();
    const [entry, setEntry] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSharedEntry = async () => {
            try {
                const entryRef = doc(db, 'shared_entries', entryId);
                const entrySnap = await getDoc(entryRef);
                
                if (entrySnap.exists()) {
                    setEntry({ id: entrySnap.id, ...entrySnap.data() });
                } else {
                    setError('Entry not found or no longer shared');
                }
            } catch (err) {
                setError('Error loading shared entry');
                console.error(err);
            } 
        };

        fetchSharedEntry();
    }, [entryId]);

    
    return (
        <div className=" bg-[#D9D9D9] w-full h-screen text-[#597445]">
            <div className="pl-52 pt-20">
            <h1 className="text-6xl font-mondwest mb-4">{entry.title}</h1>
            <div className=" font-neuebit mb-4 text-lg">
                {new Date(entry.date).toLocaleDateString()}
            </div>
            <div className="text-2xl whitespace-pre-wrap font-neuebit">{entry.content}</div>
            </div>
        </div>
    );
}

export default SharedEntry; 