import React, { useState } from 'react';

const Calculator = () => {
  const [input, setInput] = useState('');

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput('');
  };

  const handleCalculate = () => {
    try {
      const result = eval(input); // ⚠️ Solo para pruebas. No usar eval en producción.
      setInput(String(result));
    } catch {
      setInput('Error');
    }
  };

  return (
    <div style={styles.container}>
      <input style={styles.display} value={input} readOnly />
      <div style={styles.buttons}>
        {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'].map((btn) => (
          <button
            key={btn}
            onClick={() => btn === '=' ? handleCalculate() : handleClick(btn)}
            style={styles.button}
          >
            {btn}
          </button>
        ))}
        <button onClick={handleClear} style={styles.clear}>C</button>
      </div>
    </div>
  );
};

const styles = {
  container: { width: 200, margin: 'auto', textAlign: 'center' },
  display: { width: '100%', height: 40, fontSize: 18, marginBottom: 10 },
  buttons: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5 },
  button: { height: 40, fontSize: 18 },
  clear: { gridColumn: 'span 4', height: 40, backgroundColor: '#f44336', color: 'white' }
};

export default Calculator;
