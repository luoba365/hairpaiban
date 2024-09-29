import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Button, Tooltip } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ScheduleForm from './ScheduleForm';

const shifts = ['早班 (9:30-18:30)', '中班 (11:00-20:00)', '晚班 (12:30-21:30)'];
const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

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

interface ScheduleTableProps {
  stylists: Stylist[];
  onScheduleChange?: (schedules: Schedule[]) => void;
}

const getColor = (index: number) => {
  const colors = ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFD8B8'];
  return colors[index % colors.length];
};

const getWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startDate = new Date(today.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)));
  
  return days.map((_, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    return date.toISOString().split('T')[0];
  });
};

const ScheduleTable: React.FC<ScheduleTableProps> = ({ stylists, onScheduleChange }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShift, setSelectedShift] = useState('');

  useEffect(() => {
    const savedSchedules = localStorage.getItem('schedules');
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('schedules', JSON.stringify(schedules));
    if (onScheduleChange) {
      onScheduleChange(schedules);
    }
  }, [schedules, onScheduleChange]);

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
    }).filter(name => name !== '');
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;
    const [sourceDay, sourceShift] = source.droppableId.split('-');
    const [destDay, destShift] = destination.droppableId.split('-');

    const sourceSchedule = schedules.find(s => s.date === sourceDay && s.shift === sourceShift);
    let destSchedule = schedules.find(s => s.date === destDay && s.shift === destShift);

    if (sourceSchedule) {
      const stylistId = sourceSchedule.stylistIds[source.index];
      const newSourceStylistIds = sourceSchedule.stylistIds.filter((_, index) => index !== source.index);

      let newSchedules = schedules.filter(s => s.id !== sourceSchedule.id);
      if (newSourceStylistIds.length > 0) {
        newSchedules.push({ ...sourceSchedule, stylistIds: newSourceStylistIds });
      }

      if (destSchedule) {
        // 目标位置已有排班
        const newDestStylistIds = [...destSchedule.stylistIds];
        newDestStylistIds.splice(destination.index, 0, stylistId);
        newSchedules = newSchedules.filter(s => s.id !== destSchedule!.id);
        newSchedules.push({ ...destSchedule, stylistIds: newDestStylistIds });
      } else {
        // 目标位置没有排班，创建新的排班
        destSchedule = {
          id: Date.now().toString(),
          stylistIds: [stylistId],
          date: destDay,
          shift: destShift,
        };
        newSchedules.push(destSchedule);
      }

      setSchedules(newSchedules);
    }
  };

  // 计算每个理发师的工作时间
  const calculateWorkHours = (schedules: Schedule[]): { [key: string]: number } => {
    const workHours: { [key: string]: number } = {};
    schedules.forEach((schedule) => {
      schedule.stylistIds.forEach((stylistId) => {
        workHours[stylistId] = (workHours[stylistId] || 0) + 1;
      });
    });
    return workHours;
  };

  // 生成自动排班建议
  const generateScheduleSuggestion = () => {
    const workHours = calculateWorkHours(schedules);
    const suggestion: Schedule[] = [];
    const weekDates = getWeekDates();

    weekDates.forEach((date) => {
      shifts.forEach((shift) => {
        const availableStylists = stylists
          .filter((stylist) => !schedules.some((s) => s.date === date && s.shift === shift && s.stylistIds.includes(stylist.id)))
          .sort((a, b) => (workHours[a.id] || 0) - (workHours[b.id] || 0));

        if (availableStylists.length > 0) {
          suggestion.push({
            id: `${date}-${shift}`,
            date: date,
            shift: shift,
            stylistIds: [availableStylists[0].id],
          });
          workHours[availableStylists[0].id] = (workHours[availableStylists[0].id] || 0) + 1;
        }
      });
    });

    return suggestion;
  };

  const workHours = calculateWorkHours(schedules);

  const handleApplySuggestion = () => {
    const suggestion = generateScheduleSuggestion();
    setSchedules((prevSchedules) => [...prevSchedules, ...suggestion]);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleApplySuggestion}
        style={{ marginBottom: '1rem' }}
      >
        应用自动排班建议
      </Button>
      <DragDropContext onDragEnd={onDragEnd}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>班次</TableCell>
                {days.map(day => (
                  <TableCell key={day}>{day}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {shifts.map(shift => (
                <TableRow key={shift}>
                  <TableCell>{shift}</TableCell>
                  {days.map(day => {
                    const schedule = schedules.find(s => s.date === day && s.shift === shift);
                    return (
                      <TableCell key={`${shift}-${day}`}>
                        <Droppable droppableId={`${day}-${shift}`}>
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                              {schedule ? (
                                getStylistNames(schedule.stylistIds).map((name, index) => (
                                  <Draggable key={`${name}-${index}`} draggableId={`${name}-${index}-${day}-${shift}`} index={index}>
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <Tooltip title={`工作时间: ${workHours[stylists.find(s => s.name === name)?.id || ''] || 0} 小时`}>
                                          <Chip
                                            label={name}
                                            style={{ margin: '2px', backgroundColor: getColor(index) }}
                                          />
                                        </Tooltip>
                                      </div>
                                    )}
                                  </Draggable>
                                ))
                              ) : null}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                        <IconButton size="small" onClick={() => handleEdit(day, shift)}>
                          <Edit />
                        </IconButton>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DragDropContext>
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

export default ScheduleTable;