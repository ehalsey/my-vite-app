import React from 'react';

const HotReloadTest: React.FC = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'yellow', 
      padding: '10px',
      borderRadius: '5px',
      zIndex: 1000,
      fontSize: '12px'
    }}>
      <div>Hot Reload Test</div>
      <div>Count: {count}</div>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <div style={{ marginTop: '5px', fontSize: '10px' }}>
        Change this text to test hot reload → TEST VERSION 2
      </div>
    </div>
  );
};

export default HotReloadTest;