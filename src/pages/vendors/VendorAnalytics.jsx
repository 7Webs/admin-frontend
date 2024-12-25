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
    CircularProgress,
    useTheme,
    alpha,
} from '@mui/material';
import {
    LocalOffer as CouponIcon,
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
} from '@mui/icons-material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { apiService } from '../../api/apiwrapper';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const VendorAnalytics = ({ vendorId }) => {
    const theme = useTheme();

    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                if (vendorId) {
                    const response = await apiService.get(`/analytics/${vendorId}`);
                    setAnalyticsData(response?.data);
                }
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [vendorId]);

    if (loading || !analyticsData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => (
        <Card
            elevation={0}
            sx={{
                background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)}, ${alpha(theme.palette[color].main, 0.2)})`,
                borderRadius: 4,
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                }
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {Icon && (
                        <Avatar
                            sx={{
                                bgcolor: alpha(theme.palette[color].main, 0.2),
                                color: theme.palette[color].main,
                                p: 1
                            }}
                        >
                            <Icon />
                        </Avatar>
                    )}
                    <Typography variant="h6" component="div" sx={{ ml: 2, fontWeight: 600 }}>
                        {title}
                    </Typography>
                </Box>
                <Typography
                    variant="h3"
                    component="div"
                    sx={{
                        color: theme.palette[color].main,
                        fontWeight: 700
                    }}
                >
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );

    const approvalStatusData = analyticsData?.approvalStats?.map(status => ({
        name: status.redeemedDeal_status.replace('_', ' ').toUpperCase(),
        value: parseInt(status.count)
    })) || [];

    return (
        <Box sx={{ flexGrow: 1, p: 3, bgcolor: alpha(theme.palette.background.default, 0.98) }}>


            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="Total Deals"
                        value={analyticsData?.totalDeals ?? 0}
                        icon={CouponIcon}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="Total Redeemed"
                        value={analyticsData?.totalRedeemedDeals ?? 0}
                        icon={TrendingUpIcon}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="Active Users"
                        value={analyticsData?.topUsers?.length ?? 0}
                        icon={PeopleIcon}
                        color="info"
                    />
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            p: 3,
                            height: 400,
                            borderRadius: 4,
                            boxShadow: theme.shadows[2],
                            background: alpha(theme.palette.background.paper, 0.9),
                        }}
                        elevation={0}
                    >
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                            Activity Trends
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analyticsData?.timeSeriesData ?? []}>
                                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.1)} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(date) => date ? new Date(date).toLocaleDateString() : ''}
                                    stroke={theme.palette.text.secondary}
                                />
                                <YAxis stroke={theme.palette.text.secondary} />
                                <Tooltip
                                    contentStyle={{
                                        background: theme.palette.background.paper,
                                        border: 'none',
                                        borderRadius: 8,
                                        boxShadow: theme.shadows[3]
                                    }}
                                />
                                <Line type="monotone" dataKey="approvals" stroke={theme.palette.primary.main} strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="usages" stroke={theme.palette.success.main} strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="redemptions" stroke={theme.palette.warning.main} strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            height: 400,
                            borderRadius: 4,
                            boxShadow: theme.shadows[2],
                            background: alpha(theme.palette.background.paper, 0.9),
                        }}
                        elevation={0}
                    >
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                            Approval Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                <Pie
                                    data={approvalStatusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {approvalStatusData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            style={{ filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))' }}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: theme.palette.background.paper,
                                        border: 'none',
                                        borderRadius: 8,
                                        boxShadow: theme.shadows[3]
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            boxShadow: theme.shadows[2],
                            background: alpha(theme.palette.background.paper, 0.9),
                        }}
                        elevation={0}
                    >
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                            Deal Performance
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analyticsData?.redemptionRate ?? []}>
                                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.1)} />
                                <XAxis dataKey="deal_title" stroke={theme.palette.text.secondary} />
                                <YAxis stroke={theme.palette.text.secondary} />
                                <Tooltip
                                    contentStyle={{
                                        background: theme.palette.background.paper,
                                        border: 'none',
                                        borderRadius: 8,
                                        boxShadow: theme.shadows[3]
                                    }}
                                />
                                <Bar
                                    dataKey="redeemedcount"
                                    fill={theme.palette.primary.main}
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            boxShadow: theme.shadows[2],
                            background: alpha(theme.palette.background.paper, 0.9),
                            maxHeight: 400,
                            overflow: 'auto'
                        }}
                        elevation={0}
                    >
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                            Top Performers
                        </Typography>
                        <List>
                            {analyticsData?.topUsers?.map((user, index) => (
                                <Box key={user?.user_id}>
                                    <ListItem sx={{ py: 2 }}>
                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    color: theme.palette.primary.main
                                                }}
                                            >
                                                {user?.user_name?.[0]}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    {user?.user_name}
                                                </Typography>
                                            }
                                            secondary={`${user?.redeemedcount ?? 0} redemptions`}
                                        />
                                        <Chip
                                            label={`#${index + 1}`}
                                            color="primary"
                                            variant="outlined"
                                            sx={{
                                                borderRadius: 2,
                                                fontWeight: 600
                                            }}
                                        />
                                    </ListItem>
                                    {index < (analyticsData?.topUsers?.length ?? 0) - 1 &&
                                        <Divider sx={{ opacity: 0.5 }} />
                                    }
                                </Box>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            boxShadow: theme.shadows[2],
                            background: alpha(theme.palette.background.paper, 0.9),
                        }}
                        elevation={0}
                    >
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                            Expiring Soon
                        </Typography>
                        <Grid container spacing={2}>
                            {analyticsData?.dealsNearingExpiration?.slice(0, 4).map((deal) => (
                                <Grid item xs={12} sm={6} md={3} key={deal?.id}>
                                    <Card
                                        sx={{
                                            borderRadius: 3,
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                            }
                                        }}
                                        elevation={2}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                <Avatar
                                                    variant="rounded"
                                                    src={deal?.images?.[0]}
                                                    sx={{
                                                        width: '100%',
                                                        height: 140,
                                                        borderRadius: 2
                                                    }}
                                                />
                                                <Typography variant="subtitle1" fontWeight={600} noWrap>
                                                    {deal?.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="error"
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5
                                                    }}
                                                >
                                                    Expires: {deal?.availableUntil ? new Date(deal.availableUntil).toLocaleDateString() : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default VendorAnalytics;
