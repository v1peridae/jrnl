
import NewJournalButton from "./NewJournalButton";

function JournalList() {
  return (
    <div className="w-1/3 bg-gray-100 p-4">
      <NewJournalButton addNewEntry={addNewEntry} />
      {entries.map((entry) => (
        <div key={entry.id} className="my-2 cursor-pointer" onClick={() => setSelectedEntry(entry)}>
          <h3 className="text-green-700 font-bold">{entry.title}</h3>
          <p className="text-green-500 text-sm">{entry.date}</p>
        </div>
      ))}
    </div>
  );
}

export default JournalList;
