import React from 'react';

const WinLose = ({ winner, onRestart, onBackToStart }: { winner: string, onRestart: () => void, onBackToStart: () => void }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        zIndex: 1000,
      }}
    >
      <div style={{ textAlign: 'center', backgroundColor: '#333', padding: '40px', borderRadius: '10px' }}>
        <h2>{winner} Wins!</h2>
        <button onClick={onRestart} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
          Restart Game
        </button>
        <button
          onClick={onBackToStart}
          style={{ marginTop: '10px', padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}
        >
          Back to Start
        </button>
      </div>
    </div>
  );
};

export default WinLose;
