import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tab,
  Tabs,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

// Mock influencer data
const mockInfluencers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    avatar: 'https://example.com/avatar1.jpg',
    status: 'active',
    followers: {
      instagram: 15000,
      youtube: 25000,
      tiktok: 10000,
    },
    engagementRate: 8.5,
    activeCoupons: 3,
    totalRedemptions: 450,
    verificationStatus: 'verified',
    categories: ['Fashion', 'Lifestyle'],
    joinDate: '2023-06-01',
    lastActive: '2024-01-15',
  },
  {
    id: 2,
    name: 'Mike Chen',
    email: 'mike.c@example.com',
    avatar: 'https://example.com/avatar2.jpg',
    status: 'pending',
    followers: {
      instagram: 8000,
      tiktok: 20000,
    },
    engagementRate: 6.2,
    activeCoupons: 0,
    totalRedemptions: 0,
    verificationStatus: 'pending',
    categories: ['Tech', 'Gaming'],
    joinDate: '2024-01-10',
    lastActive: '2024-01-10',
  },
  {
    id: 3,
    name: 'Emma Davis',
    email: 'emma.d@example.com',
    avatar: 'https://example.com/avatar3.jpg',
    status: 'suspended',
    followers: {
      instagram: 12000,
      youtube: 18000,
    },
    engagementRate: 4.8,
    activeCoupons: 0,
    totalRedemptions: 250,
    verificationStatus: 'rejected',
    categories: ['Beauty', 'Wellness'],
    joinDate: '2023-08-15',
    lastActive: '2023-12-28',
  },
];

const statusColors = {
  active: 'success',
  pending: 'warning',
  suspended: 'error',
};

const verificationColors = {
  verified: 'success',
  pending: 'warning',
  rejected: 'error',
};

const InfluencerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const handleMenuOpen = (event, influencer) => {
    setAnchorEl(event.currentTarget);
    setSelectedInfluencer(influencer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    setDetailsDialog(true);
    handleMenuClose();
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const getTotalFollowers = (followers) => {
    return Object.values(followers).reduce((acc, curr) => acc + curr, 0);
  };

  const filteredInfluencers = mockInfluencers.filter((influencer) => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         influencer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || influencer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Influencer Management
      </Typography>

      {/* Filters and Search */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            placeholder="Search influencers..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <Button
            variant={selectedStatus === 'all' ? 'contained' : 'outlined'}
            onClick={() => handleStatusFilter('all')}
            sx={{ mr: 1 }}
          >
            All
          </Button>
          <Button
            variant={selectedStatus === 'active' ? 'contained' : 'outlined'}
            onClick={() => handleStatusFilter('active')}
            color="success"
            sx={{ mr: 1 }}
          >
            Active
          </Button>
          <Button
            variant={selectedStatus === 'pending' ? 'contained' : 'outlined'}
            onClick={() => handleStatusFilter('pending')}
            color="warning"
            sx={{ mr: 1 }}
          >
            Pending
          </Button>
          <Button
            variant={selectedStatus === 'suspended' ? 'contained' : 'outlined'}
            onClick={() => handleStatusFilter('suspended')}
            color="error"
          >
            Suspended
          </Button>
        </Grid>
      </Grid>

      {/* Influencers Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Influencer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Verification</TableCell>
                <TableCell>Total Followers</TableCell>
                <TableCell>Engagement Rate</TableCell>
                <TableCell>Active Coupons</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInfluencers.map((influencer) => (
                <TableRow key={influencer.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={influencer.avatar} sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle2">{influencer.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {influencer.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={influencer.status}
                      color={statusColors[influencer.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={influencer.verificationStatus}
                      color={verificationColors[influencer.verificationStatus]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {getTotalFollowers(influencer.followers).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {influencer.engagementRate}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={influencer.engagementRate * 10}
                        sx={{ width: 100 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{influencer.activeCoupons}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, influencer)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <VisibilityIcon sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <CheckCircleIcon sx={{ mr: 1 }} /> Verify Account
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <BlockIcon sx={{ mr: 1 }} /> Suspend Account
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <WarningIcon sx={{ mr: 1 }} /> Send Warning
        </MenuItem>
      </Menu>

      {/* Details Dialog */}
      <Dialog
        open={detailsDialog}
        onClose={() => setDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedInfluencer && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={selectedInfluencer.avatar}
                  sx={{ width: 64, height: 64, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">
                    {selectedInfluencer.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Member since {new Date(selectedInfluencer.joinDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Overview" />
                <Tab label="Social Media" />
                <Tab label="Coupons" />
                <Tab label="Activity" />
              </Tabs>

              {currentTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Total Followers
                        </Typography>
                        <Typography variant="h5">
                          {getTotalFollowers(selectedInfluencer.followers).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Engagement Rate
                        </Typography>
                        <Typography variant="h5">
                          {selectedInfluencer.engagementRate}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Active Coupons
                        </Typography>
                        <Typography variant="h5">
                          {selectedInfluencer.activeCoupons}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Total Redemptions
                        </Typography>
                        <Typography variant="h5">
                          {selectedInfluencer.totalRedemptions}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Social Media Profiles
                        </Typography>
                        <Grid container spacing={2}>
                          {Object.entries(selectedInfluencer.followers).map(([platform, followers]) => (
                            <Grid item xs={12} sm={4} key={platform}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {platform === 'instagram' && <InstagramIcon sx={{ mr: 1 }} />}
                                {platform === 'youtube' && <YouTubeIcon sx={{ mr: 1 }} />}
                                {platform === 'tiktok' && <LinkIcon sx={{ mr: 1 }} />}
                                <Box>
                                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                    {platform}
                                  </Typography>
                                  <Typography variant="subtitle2">
                                    {followers.toLocaleString()} followers
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {/* Add content for other tabs */}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsDialog(false)}>Close</Button>
              <Button
                variant="contained"
                color={selectedInfluencer.status === 'suspended' ? 'success' : 'error'}
              >
                {selectedInfluencer.status === 'suspended' ? 'Reactivate Account' : 'Suspend Account'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default InfluencerManagement;
