import React from 'react';
import { Tabs, Tab } from '@material-ui/core';

interface NavigationProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const Navigation: React.FC<NavigationProps> = ({ value, onChange }) => {
  return (
    <Tabs value={value} onChange={onChange} indicatorColor="primary" textColor="primary" centered>
      <Tab label="周排班" />
      <Tab label="月度排班" />
      <Tab label="理发师管理" />
    </Tabs>
  );
};

export default Navigation;