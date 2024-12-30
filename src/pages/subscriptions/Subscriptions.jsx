import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Switch,
    FormControlLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { apiService } from '../../api/apiwrapper';
import { toast } from 'react-toastify';

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        interval: 'month',
        description: '',
        isActive: true,
        trialDays: '',
        maxDeals: 0
    });

    const fetchSubscriptions = async () => {
        setLoading(true);
        try {
            const response = await apiService.get('/subscriptions');
            setSubscriptions(response.data);
        } catch (error) {
            toast.error('Failed to fetch subscriptions');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedSubscription(null);
        setFormData({
            name: '',
            amount: '',
            interval: 'month',
            description: '',
            isActive: true,
            trialDays: '',
            maxDeals: 0
        });
    };

    const handleInputChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'isActive' ? checked : value
        }));
    };

    const handleEdit = async (subscription) => {
        setSelectedSubscription(subscription);
        setFormData({
            name: subscription.name,
            amount: subscription.amount,
            interval: subscription.interval,
            description: subscription.description,
            isActive: subscription.isActive,
            trialDays: subscription.trialDays,
            maxDeals: subscription.maxDeals
        });
        handleOpenDialog();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this subscription?')) {
            try {
                await apiService.delete(`/subscriptions/${id}`);
                toast.success('Subscription deleted successfully');
                fetchSubscriptions();
            } catch (error) {
                toast.error('Failed to delete subscription');
                console.error(error);
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                amount: parseFloat(formData.amount),
                trialDays: parseInt(formData.trialDays),
                maxDeals: parseInt(formData.maxDeals)
            };

            if (selectedSubscription) {
                await apiService.patch(`/subscriptions/${selectedSubscription.id}`, payload);
                toast.success('Subscription updated successfully');
            } else {
                await apiService.post('/subscriptions', payload);
                toast.success('Subscription created successfully');
            }
            handleCloseDialog();
            fetchSubscriptions();
        } catch (error) {
            toast.error('Failed to save subscription');
            console.error(error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Subscription Plans</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                >
                    Add New Plan
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Interval</TableCell>
                            <TableCell>Trial Days</TableCell>
                            <TableCell>Max Deals</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subscriptions.map((subscription) => (
                            <TableRow key={subscription.id}>
                                <TableCell>{subscription.name}</TableCell>
                                <TableCell>€{subscription.amount}</TableCell>
                                <TableCell>{subscription.interval}</TableCell>
                                <TableCell>{subscription.trialDays}</TableCell>
                                <TableCell>{subscription.maxDeals}</TableCell>
                                <TableCell>{subscription.isActive ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(subscription)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(subscription.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedSubscription ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
                </DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={2}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            label="Amount"
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleInputChange}
                        />
                        <Select
                            fullWidth
                            label="Interval"
                            name="interval"
                            value={formData.interval}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="month">Month</MenuItem>
                            <MenuItem value="year">Year</MenuItem>
                        </Select>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            label="Trial Days"
                            name="trialDays"
                            type="number"
                            value={formData.trialDays}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            label="Max Deals"
                            name="maxDeals"
                            type="number"
                            value={formData.maxDeals}
                            onChange={handleInputChange}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    name="isActive"
                                />
                            }
                            label="Active"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedSubscription ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Subscriptions;
