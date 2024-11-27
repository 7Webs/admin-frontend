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
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

// Mock vendor data
const mockVendors = [
  {
    id: 1,
    name: 'Fashion Nova',
    email: 'partner@fashionnova.com',
    status: 'active',
    subscriptionTier: 'premium',
    totalCoupons: 150,
    activeInfluencers: 45,
    totalRevenue: 25000,
    lastPayment: '2024-01-15',
    joinDate: '2023-06-01',
  },
  {
    id: 2,
    name: 'BeautyGlow',
    email: 'partners@beautyglow.com',
    status: 'pending',
    subscriptionTier: 'basic',
    totalCoupons: 50,
    activeInfluencers: 12,
    totalRevenue: 8000,
    lastPayment: '2024-01-10',
    joinDate: '2023-09-15',
  },
  {
    id: 3,
    name: 'FitLife',
    email: 'business@fitlife.com',
    status: 'suspended',
    subscriptionTier: 'premium',
    totalCoupons: 200,
    activeInfluencers: 0,
    totalRevenue: 15000,
    lastPayment: '2023-12-28',
    joinDate: '2023-05-20',
  },
];

const statusColors = {
  active: 'success',
  pending: 'warning',
  suspended: 'error',
};

const subscriptionColors = {
  basic: 'info',
  premium: 'secondary',
  enterprise: 'primary',
};

const VendorManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const handleMenuOpen = (event, vendor) => {
    setAnchorEl(event.currentTarget);
    setSelectedVendor(vendor);
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

  const filteredVendors = mockVendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || vendor.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Vendor Management
      </Typography>

      {/* Filters and Search */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            placeholder="Search vendors..."
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
        <Grid item xs={12} sm={6} md={4}>
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

      {/* Vendors Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vendor Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Subscription</TableCell>
                <TableCell align="right">Active Influencers</TableCell>
                <TableCell align="right">Total Revenue</TableCell>
                <TableCell align="right">Last Payment</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">{vendor.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vendor.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={vendor.status}
                      color={statusColors[vendor.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={vendor.subscriptionTier}
                      color={subscriptionColors[vendor.subscriptionTier]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">{vendor.activeInfluencers}</TableCell>
                  <TableCell align="right">${vendor.totalRevenue.toLocaleString()}</TableCell>
                  <TableCell align="right">{new Date(vendor.lastPayment).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={(e) => handleMenuOpen(e, vendor)}>
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
          <CheckCircleIcon sx={{ mr: 1 }} /> Approve
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <BlockIcon sx={{ mr: 1 }} /> Suspend
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
        {selectedVendor && (
          <>
            <DialogTitle>
              <Typography variant="h6">
                {selectedVendor.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member since {new Date(selectedVendor.joinDate).toLocaleDateString()}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Overview" />
                <Tab label="Payment History" />
                <Tab label="Influencers" />
                <Tab label="Analytics" />
              </Tabs>

              {currentTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Total Revenue
                        </Typography>
                        <Typography variant="h5">
                          ${selectedVendor.totalRevenue.toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Active Influencers
                        </Typography>
                        <Typography variant="h5">
                          {selectedVendor.activeInfluencers}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Total Coupons
                        </Typography>
                        <Typography variant="h5">
                          {selectedVendor.totalCoupons}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Subscription Tier
                        </Typography>
                        <Typography variant="h5">
                          {selectedVendor.subscriptionTier}
                        </Typography>
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
                color={selectedVendor.status === 'suspended' ? 'success' : 'error'}
              >
                {selectedVendor.status === 'suspended' ? 'Reactivate Account' : 'Suspend Account'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default VendorManagement;
