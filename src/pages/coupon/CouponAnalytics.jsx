import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Chip,
    CircularProgress
} from '@mui/material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { apiService } from '../../api/apiwrapper';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CouponAnalytics = ({ id }) => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await apiService.get(`/analytics/deal/${id}`);
                setAnalyticsData(response.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [id]);

    if (loading || !analyticsData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const statusData = analyticsData.redemptionStatuses.map(status => ({
        name: status.redeemedDeal_status.replace('_', ' ').toUpperCase(),
        value: parseInt(status.count)
    }));

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Analytics for {analyticsData.dealTitle}
            </Typography>

            <Grid container spacing={3}>
                {/* Summary Cards */}
                <Grid item xs={12} md={4}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6">Total Redemptions</Typography>
                            <Typography variant="h3">{analyticsData.totalRedemptions}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6">Total Approvals</Typography>
                            <Typography variant="h3">{analyticsData.totalApprovals}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Redemption Status Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }} elevation={3}>
                        <Typography variant="h6" gutterBottom>
                            Redemption Status Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Daily Metrics Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }} elevation={3}>
                        <Typography variant="h6" gutterBottom>
                            Daily Metrics
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analyticsData.dailyMetrics}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="redemptions" stroke="#8884d8" name="Redemptions" />
                                <Line type="monotone" dataKey="approvals" stroke="#82ca9d" name="Approvals" />
                                <Line type="monotone" dataKey="usages" stroke="#ffc658" name="Usages" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Top Users */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }} elevation={3}>
                        <Typography variant="h6" gutterBottom>
                            Top Users
                        </Typography>
                        <List>
                            {analyticsData.topUsers.map((user, index) => (
                                <Box key={user.user_id}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>{user.user_name[0]}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={user.user_name}
                                            secondary={`${user.redeemedcount} redemptions`}
                                        />
                                        <Chip
                                            label={`#${index + 1}`}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </ListItem>
                                    {index < analyticsData.topUsers.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CouponAnalytics;
