import { useState, useEffect } from "react";
import "./App.css";
import { Poll } from "./types";
import { loadPolls, savePolls } from "./utils/storage";
import { PollList } from "./components/PollList";
import { QRDisplay } from "./components/QRDisplay";

function App() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);

  useEffect(() => {
    const savedPolls = loadPolls();
    setPolls(savedPolls);
  }, []);

  const handleAddPoll = (pollData: Omit<Poll, 'id'>) => {
    const newPoll: Poll = {
      ...pollData,
      id: crypto.randomUUID(),
    };

    const updatedPolls = [...polls, newPoll];
    setPolls(updatedPolls);
    savePolls(updatedPolls);
  };

  const handleDeletePoll = (id: string) => {
    const updatedPolls = polls.filter(poll => poll.id !== id);
    setPolls(updatedPolls);
    savePolls(updatedPolls);

    if (selectedPoll?.id === id) {
      setSelectedPoll(null);
    }
  };

  const handleSelectPoll = (poll: Poll) => {
    setSelectedPoll(poll);
  };

  const handleBack = () => {
    setSelectedPoll(null);
  };

  return (
    <main className="container">
      {selectedPoll ? (
        <QRDisplay poll={selectedPoll} onBack={handleBack} />
      ) : (
        <PollList
          polls={polls}
          onAddPoll={handleAddPoll}
          onDeletePoll={handleDeletePoll}
          onSelectPoll={handleSelectPoll}
        />
      )}
    </main>
  );
}

export default App;
