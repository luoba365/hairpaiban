import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Grid } from '@material-ui/core';
import { ChevronLeft, ChevronRight, Edit } from '@material-ui/icons';
import ScheduleForm from './ScheduleForm';

interface MonthlyScheduleProps {
  stylists: Stylist[];
}

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

const shifts = ['早班 (9:30-18:30)', '中班 (11:00-20:00)', '晚班 (12:30-21:30)'];

const MonthlySchedule: React.FC<MonthlyScheduleProps> = ({ stylists }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShift, setSelectedShift] = useState('');

  useEffect(() => {
    const savedSchedules = localStorage.getItem('monthlySchedules');
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('monthlySchedules', JSON.stringify(schedules));
  }, [schedules]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleEdit = (date: string, shift: string) => {
    const existingSchedule = schedules.find(s => s.date === date && s.shift === shift);
    setEditingSchedule(existingSchedule);
    setSelectedDate(date);
    setSelectedShift(shift);
    setOpenForm(true);
  };

  const handleSave = (updatedSchedule: Schedule) => {
    if (editingSchedule) {
      setSchedules(schedules.map(schedule => 
        schedule.id === updatedSchedule.id ? updatedSchedule : schedule
      ));
    } else {
      setSchedules([...schedules, updatedSchedule]);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingSchedule(undefined);
  };

  const getStylistNames = (stylistIds: string[]) => {
    return stylistIds.map(id => {
      const stylist = stylists.find(s => s.id === id);
      return stylist ? stylist.name : '';
    }).filter(name => name !== '').join(', ');
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <IconButton onClick={handlePrevMonth}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRight />
        </IconButton>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>日期</TableCell>
              {shifts.map(shift => (
                <TableCell key={shift}>{shift}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(daysInMonth)].map((_, index) => {
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), index + 1);
              const dateString = date.toISOString().split('T')[0];
              return (
                <TableRow key={index}>
                  <TableCell>{`${index + 1} (${['日', '一', '二', '三', '四', '五', '六'][(index + firstDayOfMonth) % 7]})`}</TableCell>
                  {shifts.map(shift => {
                    const schedule = schedules.find(s => s.date === dateString && s.shift === shift);
                    return (
                      <TableCell key={`${dateString}-${shift}`}>
                        {schedule ? getStylistNames(schedule.stylistIds) : ''}
                        <IconButton size="small" onClick={() => handleEdit(dateString, shift)}>
                          <Edit />
                        </IconButton>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ScheduleForm
        open={openForm}
        onClose={handleCloseForm}
        onSave={handleSave}
        stylists={stylists}
        schedule={editingSchedule}
        date={selectedDate}
        shift={selectedShift}
      />
    </>
  );
};

export default MonthlySchedule;