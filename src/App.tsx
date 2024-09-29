import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@material-ui/core';
import Layout from './components/Layout';
import Navigation from './components/Navigation';
import ScheduleTable from './components/ScheduleTable';
import StylistList from './components/StylistList';
import WeeklyScheduleTemplate from './components/WeeklyScheduleTemplate';
import MonthlySchedule from './components/MonthlySchedule';

interface Stylist {
  id: string;
  name: string;
  workId: string;
}

interface Schedule {
  id: string;
  stylistIds: string[];
  date: string;
  shift: string;
}

const App: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const savedStylists = localStorage.getItem('stylists');
    if (savedStylists) {
      setStylists(JSON.parse(savedStylists));
    }
    const savedSchedules = localStorage.getItem('schedules');
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    }
  }, []);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const handleStylistsChange = (updatedStylists: Stylist[]) => {
    setStylists(updatedStylists);
    localStorage.setItem('stylists', JSON.stringify(updatedStylists));
  };

  const handleScheduleChange = (updatedSchedules: Schedule[]) => {
    setSchedules(updatedSchedules);
    localStorage.setItem('schedules', JSON.stringify(updatedSchedules));
  };

  const handleApplyTemplate = (templateSchedules: Schedule[]) => {
    setSchedules(templateSchedules);
    localStorage.setItem('schedules', JSON.stringify(templateSchedules));
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        理发店排班管理系统
      </Typography>
      <Navigation value={tabValue} onChange={handleTabChange} />
      <Box mt={3}>
        {tabValue === 0 && (
          <>
            <Typography variant="h5" gutterBottom>
              本周排班表
            </Typography>
            <WeeklyScheduleTemplate stylists={stylists} onApplyTemplate={handleApplyTemplate} />
            <ScheduleTable stylists={stylists} onScheduleChange={handleScheduleChange} />
          </>
        )}
        {tabValue === 1 && (
          <>
            <Typography variant="h5" gutterBottom>
              月度排班
            </Typography>
            <MonthlySchedule stylists={stylists} />
          </>
        )}
        {tabValue === 2 && (
          <>
            <Typography variant="h5" gutterBottom>
              理发师管理
            </Typography>
            <StylistList onStylistsChange={handleStylistsChange} />
          </>
        )}
      </Box>
    </Layout>
  );
};

export default App;