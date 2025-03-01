import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Tabs,
  Tab,
  Menu,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  CheckCircle as ApproveIcon,
} from '@mui/icons-material';
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../../api/apiwrapper";
import AnimatedLoader from '../../components/loaders/AnimatedLoader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CouponManagement = () => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuCoupon, setMenuCoupon] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmDialogAction, setConfirmDialogAction] = useState('');
  const [couponToApprove, setCouponToApprove] = useState(null);
  const [adminComment, setAdminComment] = useState('');
  const [disapproveDialog, setDisapproveDialog] = useState(false);
  const loadMoreRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ["coupons", activeTab],
    queryFn: async ({ pageParam = 0 }) => {
      const endpoint = activeTab === 'all'
        ? `admin/all-used-coupons?take=10&skip=${pageParam}`
        : `admin/pending-approval-coupons?take=10&skip=${pageParam}`;
      const response = await apiService.get(endpoint);
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length * 10 : undefined;
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id) => apiService.patch(`deals-redeem/approve/${id}`, {
      status: 'approved'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      toast.success('Coupon approved successfully');
    },
    onError: (error) => {
      toast.error('Failed to approve coupon');
    }
  });

  const disapproveMutation = useMutation({
    mutationFn: ({ id, comment }) => apiService.patch(`deals-redeem/approve/${id}`, {
      status: 're_submission_requested',
      adminComment: comment
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      toast.success('Coupon marked as Re-submission Requested');
      setDisapproveDialog(false);
      setAdminComment('');
    },
    onError: (error) => {
      toast.error('Failed to mark coupon as Re-submission Requested');
    }
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

  const allDeals = data?.pages.flat() || [];

  const handleViewCoupon = (coupon) => {
    navigate(`/coupons/${coupon.id}`);
    handleMenuClose();
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue); 
  };

  const handleApproveClick = (id) => {
    setCouponToApprove(id);
    setConfirmDialogAction('approve');
    setConfirmDialog(true);
    handleMenuClose();
  };

  const handleDisapproveClick = (id) => {
    setCouponToApprove(id);
    setDisapproveDialog(true);
    handleMenuClose();
  };

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(couponToApprove);
      setConfirmDialog(false);
      setCouponToApprove(null);
    } catch (error) {
      console.error('Error handling coupon:', error);
    }
  };

  const handleDisapprove = async () => {
    try {
      await disapproveMutation.mutateAsync({
        id: couponToApprove,
        comment: adminComment
      });
      setCouponToApprove(null);
    } catch (error) {
      console.error('Error handling coupon:', error);
    }
  };

  const handleMenuClick = (event, coupon) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuCoupon(coupon);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCoupon(null);
  };

  if (isLoading) {
    return <AnimatedLoader />;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Coupon Management
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Pending Approval" value="pending" />
        <Tab label="All Coupons" value="all" />
      </Tabs>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Coupon Code</TableCell>
                      <TableCell>Deal Title</TableCell>
                      <TableCell>Deal ID</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Used</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allDeals.map((coupon) => (
                      <TableRow key={coupon.id} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' } }} onClick={() => handleViewCoupon(coupon)}>
                        <TableCell>{coupon.couponCode}</TableCell>
                        <TableCell>{coupon.deal?.title}</TableCell>
                        <TableCell>{coupon.deal?.id}</TableCell>
                        <TableCell>
                          <Chip
                            label={coupon.status}
                            size="small"
                            color={coupon.status === 'approved' ? 'success' : 'warning'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{coupon.user?.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={coupon.used ? 'Yes' : 'No'}
                            size="small"
                            color={coupon.used ? 'error' : 'success'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={(e) => handleMenuClick(e, coupon)}
                          >
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
                {!hasNextPage && <Typography>No more coupons to load</Typography>}
                {isFetching && !isFetchingNextPage && <CircularProgress />}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewCoupon(menuCoupon)}>Show Details</MenuItem>
        {activeTab === 'pending' && menuCoupon && !menuCoupon.approved && (
          <>
            <MenuItem onClick={() => handleApproveClick(menuCoupon.id)}>Approve</MenuItem>
            <MenuItem onClick={() => handleDisapproveClick(menuCoupon.id)}>Disapprove</MenuItem>
          </>
        )}
      </Menu>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
      >
        <DialogTitle>
          Confirm Approval
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to approve this coupon?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button
            onClick={handleApprove}
            color="success"
            variant="contained"
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Disapprove Dialog */}
      <Dialog
        open={disapproveDialog}
        onClose={() => {
          setDisapproveDialog(false);
          setAdminComment('');
        }}
      >
        <DialogTitle>
          Disapprove Coupon
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Please provide a reason for disapproving this coupon:
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            label="Admin Comment"
            value={adminComment}
            onChange={(e) => setAdminComment(e.target.value)}
            placeholder="Enter the reason for disapproval..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDisapproveDialog(false);
            setAdminComment('');
          }}>
            Cancel
          </Button>
          <Button
            onClick={handleDisapprove}
            color="error"
            variant="contained"
            disabled={!adminComment.trim()}
          >
            Disapprove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CouponManagement;