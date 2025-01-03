import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
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
  Grid,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiService } from "../../api/apiwrapper";
import AnimatedLoader from '../../components/loaders/AnimatedLoader';
import { toast } from 'react-toastify';

const VendorManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const loadMoreRef = useRef(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    action: null
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useInfiniteQuery({
    queryKey: ["shops", searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiService.get(
        `admin/shops?take=10&skip=${pageParam}${searchQuery ? `&search=${searchQuery}` : ''}`
      );
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length * 10 : undefined;
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allShops = data?.pages.flat() || [];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchTerm);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const handleMenuOpen = (event, vendor) => {
    event.stopPropagation(); // Prevent row click when clicking menu
    setAnchorEl(event.currentTarget);
    setSelectedVendor(vendor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = (vendor) => {
    navigate(`/vendors/${vendor.id}`);
    handleMenuClose();
  };

  const handleApprove = async () => {
    try {
      await apiService.post(`admin/shops/${selectedVendor.id}/approve`);
      handleMenuClose();
      setConfirmDialog({ open: false, title: '', action: null });
      refetch();
      toast.success('Vendor approved successfully');
    } catch (error) {
      console.error('Error approving vendor:', error);
      toast.error('Error approving vendor');
    }
  };

  const handleSuspend = async () => {
    try {
      await apiService.post(`admin/shops/${selectedVendor.id}/block`);
      handleMenuClose();
      setConfirmDialog({ open: false, title: '', action: null });
      refetch();
      toast.success('Vendor suspended successfully');
    } catch (error) {
      console.error('Error suspending vendor:', error);
      toast.error('Error suspending vendor');
    }
  };

  const openConfirmDialog = (title, action) => {
    setConfirmDialog({
      open: true,
      title,
      action
    });
  };

  const filteredVendors = allShops.filter((vendor) => {
    const vendorStatus = vendor.approved ? 'approved' : 'not approved';
    const matchesStatus = selectedStatus === 'all' || vendorStatus === selectedStatus;
    return matchesStatus;
  });

  if (isLoading) {
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
          <Box sx={{ display: 'flex', gap: 1 }}>
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
            <Button
              variant="contained"
              onClick={handleSearchSubmit}
              sx={{ minWidth: '100px' }}
            >
              Search
            </Button>
          </Box>
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
            variant={selectedStatus === 'approved' ? 'contained' : 'outlined'}
            onClick={() => handleStatusFilter('approved')}
            color="success"
            sx={{ mr: 1 }}
          >
            Approved
          </Button>
          <Button
            variant={selectedStatus === 'not approved' ? 'contained' : 'outlined'}
            onClick={() => handleStatusFilter('not approved')}
            color="error"
            sx={{ mr: 1 }}
          >
            Not Approved
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
                <TableRow key={vendor.id} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' } }} onClick={() => navigate(`/vendors/${vendor.id}`)}>
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
                      label={vendor.approved ? 'Approved' : 'Not Approved'}
                      color={vendor.approved ? 'success' : 'error'}
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
        <div ref={loadMoreRef} style={{ textAlign: 'center', padding: '20px' }}>
          {isFetchingNextPage && <CircularProgress />}
          {!hasNextPage && <Typography>No more vendors to load</Typography>}
          {isFetching && !isFetchingNextPage && <CircularProgress />}
        </div>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewDetails(selectedVendor)}>
          <VisibilityIcon sx={{ mr: 1 }} /> View Details
        </MenuItem>
        {!selectedVendor?.approved && (
          <MenuItem onClick={() => openConfirmDialog('Are you sure you want to approve this vendor?', handleApprove)}>
            <CheckCircleIcon sx={{ mr: 1 }} /> Approve
          </MenuItem>
        )}
        {selectedVendor?.approved && (
          <MenuItem onClick={() => openConfirmDialog('Are you sure you want to suspend this vendor?', handleSuspend)}>
            <BlockIcon sx={{ mr: 1 }} /> Suspend
          </MenuItem>
        )}
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, title: '', action: null })}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, title: '', action: null })}>
            Cancel
          </Button>
          <Button onClick={confirmDialog.action} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorManagement;
