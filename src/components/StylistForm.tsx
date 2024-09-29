import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@material-ui/core';

interface Stylist {
  id: string;
  name: string;
  workId: string;
}

interface StylistFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (stylist: Stylist) => void;
  stylist?: Stylist;
}

const StylistForm: React.FC<StylistFormProps> = ({ open, onClose, onSave, stylist }) => {
  const [name, setName] = useState('');
  const [workId, setWorkId] = useState('');

  useEffect(() => {
    if (stylist) {
      setName(stylist.name);
      setWorkId(stylist.workId);
    } else {
      setName('');
      setWorkId('');
    }
  }, [stylist]);

  const handleSave = () => {
    onSave({
      id: stylist ? stylist.id : Date.now().toString(),
      name,
      workId,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{stylist ? '编辑理发师' : '添加理发师'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="姓名"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="工号"
          type="text"
          fullWidth
          value={workId}
          onChange={(e) => setWorkId(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          取消
        </Button>
        <Button onClick={handleSave} color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StylistForm;