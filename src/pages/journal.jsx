import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import WannaJurnl from '../components/wannaJurnl';
import { useAuth } from '../components/AuthContxt';

function Journal() {
    const { user } = useAuth();
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState({ title: '', content: '' });
    const currentDate = new Date().toLocaleDateString();
    const [editingId, setEditingId] = useState(null);
    const [shareableLink, setShareableLink] = useState('');
    const [showShareableLink, setShowShareableLink] = useState(false);

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

    const handleShareEntry = async (entryId) => {
        try {
            const sharedEntryRef = doc(db, 'shared_entries', entryId);
            const entryRef = doc(db, 'users', user.uid, 'entries', entryId);
            
            const entrySnap = await getDoc(entryRef);
            const entryData = entrySnap.data();
            
            await setDoc(sharedEntryRef, {
                title: entryData.title,
                content: entryData.content,
                date: entryData.date,
                authorId: user.uid,
            });

            const shareableLink = `${window.location.origin}/#/shared/${entryId}`;
            setShareableLink(shareableLink);
            setShowShareableLink(true);
            
            
            setEntries(prevEntries =>
                prevEntries.map(entry =>
                    entry.id === entryId
                        ? { ...entry, isShared: true }
                        : entry
                )
            );
            
        } catch (error) {
            console.error("Error sharing entry: ", error);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareableLink);
        setShowShareableLink(false);
    };

    const handleDeleteEntry = async (entryId) => {
        if (window.confirm('Are you sure you want to delete this Jurnl?')) {
            try {
                await deleteDoc(doc(db, 'users', user.uid, 'entries', entryId));
                
                await deleteDoc(doc(db, 'shared_entries', entryId));
                
                setEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
                
                if (editingId === entryId) {
                    setNewEntry({ title: '', content: '' });
                    setEditingId(null);
                }
            } catch (error) {
                console.error("Error deleting entry: ", error);
            }
        }
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
                                className="mt-8 relative group"
                            >
                                <div 
                                    className="cursor-pointer hover:opacity-75 transition-opacity"
                                    onClick={() => handleEntryClick(entry)}
                                >
                                    <h2 className="text-4xl font-mondwest text-[#597445]">{entry.title}</h2>
                                    <div className="text-[#597445] text-xl mt-2 flex justify-between items-center">
                                        <span>
                                            {new Date(entry.date).toLocaleDateString().replace(/\//g, '/')}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShareEntry(entry.id);
                                                }}
                                                className="text-2xl text-[#597445] hover:text-[#729762] opacity-0 group-hover:opacity-100 transition-opacity"
                                                title={entry.isShared ? "Copy share link" : "Share entry"}
                                            >
                                                share
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteEntry(entry.id);
                                                }}
                                                className="text-2xl text-[#597445] hover:text-[#729762] opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Delete entry"
                                            >
                                                delete
                                            </button>
                                        </div>
                                    </div>
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
            {showShareableLink && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-[#597445] rounded-3xl p-8 pt-5 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-mondwest text-4xl text-[#D9D9D9] mx-auto text-center">Share Junrl?</h2>
                            <button
                                onClick={() => setShowShareableLink(false)}
                                className="text-[#D9D9D9] text-4xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={shareableLink}
                                readOnly
                                className="flex-1 bg-[#D9D9D9] text-[#597445] p-2 rounded-2xl font-neuebit text-xl"
                            />
                            <button
                                onClick={handleCopyLink}
                                className="font-mondwest text-3xl text-[#D9D9D9]"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Journal;