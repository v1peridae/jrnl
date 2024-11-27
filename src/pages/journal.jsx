import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import WannaJurnl from '../components/wannaJurnl';
import { useAuth } from '../components/AuthContxt';

function Journal() {
    const { user } = useAuth();
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState({ title: '', content: '' });
    const currentDate = new Date().toLocaleDateString();
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchEntries = async () => {
            const querySnapshot = await getDocs(
                collection(db, 'users', user.uid, 'entries')
            );
            const entriesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            const sortedEntries = entriesList.sort((a, b) => new Date(b.date) - new Date(a.date));
            setEntries(sortedEntries);
        };
        fetchEntries();
    }, [user.uid]);

    const handleAddEntry = async () => {
        try {
            const docRef = await addDoc(
                collection(db, 'users', user.uid, 'entries'),
                {
                    title: newEntry.title,
                    content: newEntry.content,
                    date: new Date().toISOString(),
                }
            );
            
            const newEntryWithId = {
                id: docRef.id,
                title: newEntry.title,
                content: newEntry.content,
                date: new Date().toISOString(),
            };
            
            setEntries(prevEntries => [newEntryWithId, ...prevEntries]);
            setNewEntry({ title: '', content: '' });
        } catch (error) {
            console.error("Error adding entry: ", error);
        }
    };
    const handleUpdateEntry = async () => {
        try {
            const entryRef = doc(db, 'users', user.uid, 'entries', editingId);
            const updatedEntry = {
                title: newEntry.title,
                content: newEntry.content,
                date: new Date().toISOString(),
            };
            
            await updateDoc(entryRef, updatedEntry);
            
            setEntries(prevEntries => 
                prevEntries.map(entry => 
                    entry.id === editingId 
                        ? { ...updatedEntry, id: editingId }
                        : entry
                )
            );
            
            setNewEntry({ title: '', content: '' });
            setEditingId(null);
        } catch (error) {
            console.error("Error updating entry: ", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newEntry.title && newEntry.content) {
            if (editingId) {
                await handleUpdateEntry();
            } else {
                await handleAddEntry();
            }
        }
    };

    const handleEntryClick = (entry) => {
        setNewEntry({ title: entry.title, content: entry.content });
        setEditingId(entry.id);
    };

    const handleNewEntry = () => {
        setNewEntry({ title: '', content: '' });
        setEditingId(null);
    };

    return (
        <>
            <div className="grid grid-cols-12 divide-x divide-[#729762] gap-x-10 w-full pt-20 pb-3 pl-6 px-3 h-screen bg-[#D9D9D9] text-[#597445] font-neuebit">
                <div className="col-span-3">
                   <WannaJurnl onNewEntry={handleNewEntry} />   
                  
                    <div className="mt-4 ml-8 h-[450px] overflow-y-auto">
                        {entries.map(entry => (
                            <div 
                                key={entry.id} 
                                className="mt-8 cursor-pointer hover:opacity-75 transition-opacity"
                                onClick={() => handleEntryClick(entry)}
                            >
                                <h2 className="text-4xl font-mondwest text-[#597445]">{entry.title}</h2>
                                <div className="text-[#597445] mt-2">
                                    {new Date(entry.date).toLocaleDateString('en-US', {
                                        month: '2-digit',
                                        day: '2-digit',
                                        year: '2-digit'
                                    }).replace(/\//g, '/')}
                                </div>
                                <div className="border-b border-[#CAD9BE] mt-2"></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-9 pl-8">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={newEntry.title}
                            onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                            placeholder="Title"
                            className="text-8xl font-mondwest bg-transparent w-full outline-none "
                        />
                        <div className="my-4 text-[#597445]">
                            {currentDate}
                        </div>
                        <textarea
                            value={newEntry.content}
                            onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                            placeholder="Jurnl Away"
                            className="w-full h-96 bg-transparent outline-none resize-none text-3xl"
                        />
                        <button 
                            type="submit"
                            className="mt-4 px-6 py-2 text-[#597445] text-4xl rounded font-neuebit"
                        >
                            {editingId ? 'Update Jurnl' : 'Save Jurnl'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Journal;