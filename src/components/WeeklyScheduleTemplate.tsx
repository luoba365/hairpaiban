import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Card, CardContent, Typography } from '@material-ui/core';
import ScheduleTable from './ScheduleTable';

interface WeeklyScheduleTemplateProps {
  stylists: Stylist[];
  onApplyTemplate: (schedules: Schedule[]) => void;
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

const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const getWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startDate = new Date(today.setDate(today.getDate() - dayOfWeek));
  
  return days.map((day, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    return date.toISOString().split('T')[0];
  });
};

const WeeklyScheduleTemplate: React.FC<WeeklyScheduleTemplateProps> = ({ stylists, onApplyTemplate }) => {
  const [open, setOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [templates, setTemplates] = useState<{ [key: string]: Schedule[] }>({});

  useEffect(() => {
    const savedTemplates = localStorage.getItem('weeklyTemplates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    if (templateName) {
      const updatedTemplates = { ...templates, [templateName]: schedules };
      setTemplates(updatedTemplates);
      localStorage.setItem('weeklyTemplates', JSON.stringify(updatedTemplates));
      handleClose();
    }
  };

  const handleScheduleChange = (updatedSchedules: Schedule[]) => {
    const weekDates = getWeekDates();
    const schedulesWithDates = updatedSchedules.map(schedule => ({
      ...schedule,
      date: weekDates[days.indexOf(schedule.date)]
    }));
    setSchedules(schedulesWithDates);
  };

  const handleApplyTemplate = (templateName: string) => {
    const template = templates[templateName];
    if (template) {
      onApplyTemplate(template);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        创建周排班模板
      </Button>
      <Grid container spacing={2} style={{ marginTop: '1rem' }}>
        {Object.entries(templates).map(([name, template]) => (
          <Grid item xs={12} sm={6} md={4} key={name}>
            <Card>
              <CardContent>
                <Typography variant="h6">{name}</Typography>
                <Button variant="outlined" onClick={() => handleApplyTemplate(name)}>
                  应用模板
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>创建周排班模板</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="模板名称"
            type="text"
            fullWidth
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
          <ScheduleTable stylists={stylists} onScheduleChange={handleScheduleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button onClick={handleSave} color="primary">
            保存模板
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WeeklyScheduleTemplate;