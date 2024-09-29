import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@material-ui/core';

interface ScheduleFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (schedule: Schedule) => void;
  stylists: Stylist[];
  schedule?: Schedule;
  date: string;
  shift: string;
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

const ScheduleForm: React.FC<ScheduleFormProps> = ({ open, onClose, onSave, stylists, schedule, date, shift }) => {
  const [selectedStylistIds, setSelectedStylistIds] = useState<string[]>([]);

  useEffect(() => {
    if (schedule) {
      setSelectedStylistIds(schedule.stylistIds);
    } else {
      setSelectedStylistIds([]);
    }
  }, [schedule]);

  const handleSave = () => {
    onSave({
      id: schedule ? schedule.id : Date.now().toString(),
      stylistIds: selectedStylistIds,
      date,
      shift,
    });
    onClose();
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedStylistIds(event.target.value as string[]);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{schedule ? '编辑排班' : '添加排班'}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>选择理发师</InputLabel>
          <Select
            multiple
            value={selectedStylistIds}
            onChange={handleChange}
            renderValue={(selected) => (
              (selected as string[]).map(id => stylists.find(s => s.id === id)?.name).join(', ')
            )}
          >
            {stylists.map((stylist) => (
              <MenuItem key={stylist.id} value={stylist.id}>
                <Checkbox checked={selectedStylistIds.indexOf(stylist.id) > -1} />
                <ListItemText primary={`${stylist.name} (${stylist.workId})`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          取消
        </Button>
        <Button onClick={handleSave} color="primary" disabled={selectedStylistIds.length === 0}>
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleForm;