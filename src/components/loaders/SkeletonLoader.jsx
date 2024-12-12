import React from 'react';
import { Skeleton, Box, Grid, useTheme } from '@mui/material';

const SkeletonLoader = () => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, margin: 'auto', padding: theme.spacing(3) }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Skeleton variant="text" width="70%" height={60} sx={{ marginBottom: 2 }} />
          <Skeleton variant="text" width="50%" height={40} sx={{ marginBottom: 3 }} />
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Skeleton variant="rectangular" width="100%" height={300} sx={{ marginBottom: 3, borderRadius: theme.shape.borderRadius }} />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Skeleton variant="rectangular" width="100%" height={140} sx={{ marginBottom: 2, borderRadius: theme.shape.borderRadius }} />
          <Skeleton variant="rectangular" width="100%" height={140} sx={{ borderRadius: theme.shape.borderRadius }} />
        </Grid>
        
        <Grid item xs={12}>
          <Skeleton variant="text" width="100%" sx={{ marginBottom: 1 }} />
          <Skeleton variant="text" width="100%" sx={{ marginBottom: 1 }} />
          <Skeleton variant="text" width="80%" sx={{ marginBottom: 2 }} />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: theme.shape.borderRadius }} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: theme.shape.borderRadius }} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: theme.shape.borderRadius }} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SkeletonLoader;