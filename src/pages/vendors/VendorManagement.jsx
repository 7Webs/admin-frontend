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
import { useShop } from '../../utils/contexts/ShopContext';
import AnimatedLoader from '../../components/loaders/AnimatedLoader';
const statusColors = {
  active: 'success',
  pending: 'warning',
  suspended: 'error',
};

const VendorManagement = () => {
  const { shops, loading } = useShop();
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

  const filteredVendors = shops.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || vendor.subscriptionState === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <AnimatedLoader />;
  }

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
                <TableCell>Category</TableCell>
                <TableCell>Subscription Plan</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={vendor.logo}
                        alt={vendor.name}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      >
                        {vendor.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{vendor.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {vendor.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={vendor.subscriptionState || 'pending'}
                      color={statusColors[vendor.subscriptionState] || 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{vendor.category?.name}</TableCell>
                  <TableCell>{vendor.activeSubscriptionPlan?.name || 'No Plan'}</TableCell>
                  <TableCell>{new Date(vendor.createdAt).toLocaleDateString()}</TableCell>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={selectedVendor.logo}
                  alt={selectedVendor.name}
                  sx={{ width: 60, height: 60 }}
                >
                  {selectedVendor.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedVendor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Member since {new Date(selectedVendor.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Overview" />
                <Tab label="Payment History" />
                <Tab label="Analytics" />
              </Tabs>

              {currentTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Category
                        </Typography>
                        <Typography variant="h5">
                          {selectedVendor.category?.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Subscription Plan
                        </Typography>
                        <Typography variant="h5">
                          {selectedVendor.activeSubscriptionPlan?.name || 'No Plan'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Description
                        </Typography>
                        <Typography variant="body1">
                          {selectedVendor.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsDialog(false)}>Close</Button>
              <Button
                variant="contained"
                color={selectedVendor.approved ? 'error' : 'success'}
              >
                {selectedVendor.approved ? 'Suspend Account' : 'Approve Account'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default VendorManagement;
