import { useState } from 'react';
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
} from '@mui/material';
import {
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useCoupon } from '../../utils/contexts/CouponContext';
import AnimatedLoader from '../../components/loaders/AnimatedLoader';

const CouponManagement = () => {
  const { coupons, loading } = useCoupon();
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const handleViewCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setDetailsDialog(true);
  };

  const handleCloseDialog = () => {
    setDetailsDialog(false);
    setSelectedCoupon(null);
  };

  if (loading) {
    return <AnimatedLoader />;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Coupon Management
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Coupons
              </Typography>
              <Typography variant="h4">
                {coupons.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Coupons Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Shop</TableCell>
                      <TableCell>Available Until</TableCell>
                      <TableCell>Max Purchase Limit</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {coupons.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell>{coupon.title}</TableCell>
                        <TableCell>
                          <Chip
                            label={coupon.type}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{coupon.shop?.name}</TableCell>
                        <TableCell>{new Date(coupon.availableUntil).toLocaleDateString()}</TableCell>
                        <TableCell>{coupon.maxPurchaseLimit}</TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleViewCoupon(coupon)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Details Dialog */}
      <Dialog
        open={detailsDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedCoupon && (
          <>
            <DialogTitle>Coupon Details</DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6">{selectedCoupon.title}</Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Shop: {selectedCoupon.shop?.name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Description:</strong> {selectedCoupon.description}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Features:</strong> {selectedCoupon.features}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Keywords:</strong> {selectedCoupon.keywords}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Available Until:</strong> {new Date(selectedCoupon.availableUntil).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Max Purchase Limit:</strong> {selectedCoupon.maxPurchaseLimit}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Max Purchase Per User:</strong> {selectedCoupon.maxPurchasePerUser}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default CouponManagement;
