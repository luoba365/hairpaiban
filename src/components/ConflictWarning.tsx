import React from 'react';
import { Paper, Typography } from '@material-ui/core';

interface ConflictWarningProps {
  conflicts: string[];
}

const ConflictWarning: React.FC<ConflictWarningProps> = ({ conflicts }) => {
  if (conflicts.length === 0) return null;

  return (
    <Paper style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: '#fff3cd' }}>
      <Typography variant="h6" style={{ color: '#856404' }}>排班冲突警告：</Typography>
      <ul>
        {conflicts.map((conflict, index) => (
          <li key={index}>{conflict}</li>
        ))}
      </ul>
    </Paper>
  );
};

export default ConflictWarning;