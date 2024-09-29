import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper, Button } from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';
import StylistForm from './StylistForm';

interface Stylist {
  id: string;
  name: string;
  workId: string;
}

interface StylistListProps {
  onStylistsChange: (stylists: Stylist[]) => void;
}

const initialStylists: Stylist[] = [
  { id: '001', name: '朱丽雅Julia', workId: '001' },
  { id: '002', name: '查荣荣cici', workId: '002' },
  { id: '102', name: '米松', workId: '102' },
  { id: '003', name: '朱莉Lily', workId: '003' },
  { id: '004', name: '黄秀秀（秀秀）', workId: '004' },
  { id: '005', name: '孙艳辉（孙老师）', workId: '005' },
  { id: '006', name: '杨小卫（大卫）', workId: '006' },
  { id: '007', name: '于治江（于老师）', workId: '007' },
  { id: '008', name: '冀忠志（小志）', workId: '008' },
  { id: '009', name: '邵连策（章老师）', workId: '009' },
  { id: '010', name: '李国梁（果果）', workId: '010' },
  { id: '011', name: '陈园（陈老师）', workId: '011' },
  { id: '012', name: '路建龙（路老师）', workId: '012' },
  { id: '013', name: '刘子阔（亦寒）', workId: '013' },
];

const StylistList: React.FC<StylistListProps> = ({ onStylistsChange }) => {
  const [stylists, setStylists] = useState<Stylist[]>(initialStylists);
  const [openForm, setOpenForm] = useState(false);
  const [editingStylist, setEditingStylist] = useState<Stylist | undefined>(undefined);

  useEffect(() => {
    onStylistsChange(stylists);
  }, [stylists, onStylistsChange]);

  const handleEdit = (stylist: Stylist) => {
    setEditingStylist(stylist);
    setOpenForm(true);
  };

  const handleDelete = (id: string) => {
    const updatedStylists = stylists.filter(stylist => stylist.id !== id);
    setStylists(updatedStylists);
  };

  const handleSave = (updatedStylist: Stylist) => {
    if (editingStylist) {
      setStylists(stylists.map(stylist => stylist.id === updatedStylist.id ? updatedStylist : stylist));
    } else {
      setStylists([...stylists, updatedStylist]);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingStylist(undefined);
  };

  return (
    <>
      <Paper>
        <List>
          {stylists.map((stylist) => (
            <ListItem key={stylist.id}>
              <ListItemText primary={stylist.name} secondary={`工号：${stylist.workId}`} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(stylist)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(stylist.id)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Button variant="contained" color="primary" onClick={() => setOpenForm(true)} style={{ marginTop: '1rem' }}>
        添加理发师
      </Button>
      <StylistForm
        open={openForm}
        onClose={handleCloseForm}
        onSave={handleSave}
        stylist={editingStylist}
      />
    </>
  );
};

export default StylistList;