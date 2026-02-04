import { useState } from 'react';
import { Poll } from '../types';

interface PollListProps {
  polls: Poll[];
  onAddPoll: (poll: Omit<Poll, 'id'>) => void;
  onDeletePoll: (id: string) => void;
  onSelectPoll: (poll: Poll) => void;
}

export function PollList({ polls, onAddPoll, onDeletePoll, onSelectPoll }: PollListProps) {
  const [pollName, setPollName] = useState('');
  const [pollId, setPollId] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pollName.trim() || !pollId.trim() || !secretKey.trim()) {
      alert('Please fill in all fields');
      return;
    }

    onAddPoll({
      name: pollName,
      pollId,
      secretKey,
    });

    setPollName('');
    setPollId('');
    setSecretKey('');
  };

  return (
    <div className="poll-list-container">
      <h1>Poll Manager</h1>

      <form onSubmit={handleSubmit} className="poll-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Poll Name"
            value={pollName}
            onChange={(e) => setPollName(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Poll ID"
            value={pollId}
            onChange={(e) => setPollId(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Secret Key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="form-input"
          />
        </div>

        <button type="submit" className="add-button">
          Add Poll
        </button>
      </form>

      <div className="polls-list">
        {polls.length === 0 ? (
          <p className="empty-message">No polls yet. Add one above!</p>
        ) : (
          polls.map((poll) => (
            <div key={poll.id} className="poll-item">
              <div
                className="poll-content"
                onClick={() => onSelectPoll(poll)}
              >
                <span className="poll-name">{poll.name}</span>
              </div>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePoll(poll.id);
                }}
                aria-label="Delete poll"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
