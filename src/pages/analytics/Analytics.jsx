import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Timeline,
  TrendingUp,
  People,
  ShoppingBag,
} from '@mui/icons-material';

// Mock data
const mockAnalytics = {
  overview: {
    totalInfluencers: 1250,
    activeVendors: 85,
    totalCampaigns: 156,
    totalRevenue: 850000,
  },
  topInfluencers: [
    {
      name: 'Sarah Johnson',
      followers: 150000,
      engagementRate: 8.5,
      revenue: 25000,
    },
    {
      name: 'Mike Chen',
      followers: 80000,
      engagementRate: 6.2,
      revenue: 18000,
    },
    {
      name: 'Emma Davis',
      followers: 120000,
      engagementRate: 7.8,
      revenue: 22000,
    },
  ],
  topVendors: [
    {
      name: 'Fashion Co.',
      activeInfluencers: 45,
      totalSales: 125000,
      campaigns: 12,
    },
    {
      name: 'Tech Gadgets Inc.',
      activeInfluencers: 32,
      totalSales: 98000,
      campaigns: 8,
    },
    {
      name: 'Beauty Brand',
      activeInfluencers: 38,
      totalSales: 110000,
      campaigns: 10,
    },
  ],
};

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Analytics Dashboard</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="quarter">Last Quarter</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Influencers
                  </Typography>
                  <Typography variant="h4">
                    {mockAnalytics.overview.totalInfluencers}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ShoppingBag sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Vendors
                  </Typography>
                  <Typography variant="h4">
                    {mockAnalytics.overview.activeVendors}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Timeline sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Campaigns
                  </Typography>
                  <Typography variant="h4">
                    {mockAnalytics.overview.totalCampaigns}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(mockAnalytics.overview.totalRevenue)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Analytics */}
      <Card>
        <CardContent>
          <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Top Influencers" />
            <Tab label="Top Vendors" />
          </Tabs>

          {currentTab === 0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Influencer Name</TableCell>
                    <TableCell align="right">Followers</TableCell>
                    <TableCell align="right">Engagement Rate</TableCell>
                    <TableCell align="right">Revenue Generated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockAnalytics.topInfluencers.map((influencer) => (
                    <TableRow key={influencer.name}>
                      <TableCell>{influencer.name}</TableCell>
                      <TableCell align="right">
                        {influencer.followers.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">{influencer.engagementRate}%</TableCell>
                      <TableCell align="right">
                        {formatCurrency(influencer.revenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {currentTab === 1 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Vendor Name</TableCell>
                    <TableCell align="right">Active Influencers</TableCell>
                    <TableCell align="right">Total Sales</TableCell>
                    <TableCell align="right">Active Campaigns</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockAnalytics.topVendors.map((vendor) => (
                    <TableRow key={vendor.name}>
                      <TableCell>{vendor.name}</TableCell>
                      <TableCell align="right">{vendor.activeInfluencers}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(vendor.totalSales)}
                      </TableCell>
                      <TableCell align="right">{vendor.campaigns}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Analytics;
