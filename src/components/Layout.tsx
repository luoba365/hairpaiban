import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@material-ui/core';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">理发师排班管理系统</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box my={4}>
          {children}
        </Box>
      </Container>
    </>
  );
};

export default Layout;