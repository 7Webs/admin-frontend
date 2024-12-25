import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Typography,
  Box,
  Avatar,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
  Container,
  CircularProgress,
  Link,
  IconButton,
  Stack,
  Chip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { FaTiktok } from 'react-icons/fa';
import { apiService } from '../../api/apiwrapper';
import VendorAnalytics from './VendorAnalytics';

const VendorDetails = () => {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState(0);
  const theme = useTheme();

  const { data: vendor, isLoading } = useQuery({
    queryKey: ['vendor', id],
    queryFn: async () => {
      const response = await apiService.get(`shop/${id}`);
      return response.data;
    }
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!vendor) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Vendor not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: alpha(theme.palette.background.default, 0.98), minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: theme.shadows[3] }}>
          <Box sx={{
            p: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                src={vendor.logo}
                alt={vendor.name}
                sx={{
                  width: 100,
                  height: 100,
                  boxShadow: 3,
                  border: `4px solid ${theme.palette.background.paper}`
                }}
              >
                {vendor.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  {vendor.name}
                </Typography>
                <Chip
                  label={vendor.approved ? 'Active' : 'Pending'}
                  color={vendor.approved ? 'success' : 'warning'}
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`Joined ${new Date(vendor.createdAt).toLocaleDateString()}`}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
        </Card>

        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            mb: 4,
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '1.1rem',
              minWidth: 120,
              textTransform: 'none'
            },
            '& .Mui-selected': {
              color: theme.palette.primary.main
            }
          }}
        >
          <Tab label="Overview" />
          <Tab label="Analytics" />
        </Tabs>

        {currentTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 3, boxShadow: theme.shadows[3] }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BusinessIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight={600}>
                      Business Details
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                      <Typography variant="body1" fontWeight={500}>{vendor.category?.name}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Subscription</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {vendor.activeSubscriptionPlan?.name || 'No Plan'}
                        <Chip
                          size="small"
                          label={vendor.subscriptionState}
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 3, boxShadow: theme.shadows[3] }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight={600}>
                      Owner Information
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography>{vendor.owner?.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography>{vendor.owner?.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography>{vendor.owner?.email}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[3] }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DescriptionIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight={600}>
                      About
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    {vendor.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[3] }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {/* <Language as WebsiteIcon sx={{ mr: 1, color: theme.palette.primary.main }} /> */}
                    <Typography variant="h6" fontWeight={600}>
                      Social Media
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Stack direction="row" spacing={3} flexWrap="wrap">
                    {vendor.owner?.facebookProfileLink && (
                      <IconButton
                        href={vendor.owner.facebookProfileLink}
                        target="_blank"
                        sx={{
                          bgcolor: alpha('#1877F2', 0.1),
                          color: '#1877F2',
                          '&:hover': {
                            bgcolor: '#1877F2',
                            color: 'white',
                            transform: 'translateY(-4px)'
                          },
                          transition: 'all 0.2s'
                        }}
                      >
                        <FacebookIcon />
                      </IconButton>
                    )}
                    {vendor.owner?.instagramProfileLink && (
                      <IconButton
                        href={vendor.owner.instagramProfileLink}
                        target="_blank"
                        sx={{
                          bgcolor: alpha('#E4405F', 0.1),
                          color: '#E4405F',
                          '&:hover': {
                            bgcolor: '#E4405F',
                            color: 'white',
                            transform: 'translateY(-4px)'
                          },
                          transition: 'all 0.2s'
                        }}
                      >
                        <InstagramIcon />
                      </IconButton>
                    )}
                    {vendor.owner?.tiktokProfileLink && (
                      <IconButton
                        href={vendor.owner.tiktokProfileLink}
                        target="_blank"
                        sx={{
                          bgcolor: alpha('#000000', 0.1),
                          color: '#000000',
                          '&:hover': {
                            bgcolor: '#000000',
                            color: 'white',
                            transform: 'translateY(-4px)'
                          },
                          transition: 'all 0.2s'
                        }}
                      >
                        <FaTiktok />
                      </IconButton>
                    )}
                    {vendor.owner?.twitterProfileLink && (
                      <IconButton
                        href={vendor.owner.twitterProfileLink}
                        target="_blank"
                        sx={{
                          bgcolor: alpha('#1DA1F2', 0.1),
                          color: '#1DA1F2',
                          '&:hover': {
                            bgcolor: '#1DA1F2',
                            color: 'white',
                            transform: 'translateY(-4px)'
                          },
                          transition: 'all 0.2s'
                        }}
                      >
                        <TwitterIcon />
                      </IconButton>
                    )}
                    {vendor.owner?.youtubeProfileLink && (
                      <IconButton
                        href={vendor.owner.youtubeProfileLink}
                        target="_blank"
                        sx={{
                          bgcolor: alpha('#FF0000', 0.1),
                          color: '#FF0000',
                          '&:hover': {
                            bgcolor: '#FF0000',
                            color: 'white',
                            transform: 'translateY(-4px)'
                          },
                          transition: 'all 0.2s'
                        }}
                      >
                        <YouTubeIcon />
                      </IconButton>
                    )}
                    {vendor.owner?.linkedinProfileLink && (
                      <IconButton
                        href={vendor.owner.linkedinProfileLink}
                        target="_blank"
                        sx={{
                          bgcolor: alpha('#0A66C2', 0.1),
                          color: '#0A66C2',
                          '&:hover': {
                            bgcolor: '#0A66C2',
                            color: 'white',
                            transform: 'translateY(-4px)'
                          },
                          transition: 'all 0.2s'
                        }}
                      >
                        <LinkedInIcon />
                      </IconButton>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {currentTab === 1 && (
          <VendorAnalytics vendorId={id} />
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color={vendor.approved ? 'error' : 'success'}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: theme.shadows[4],
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[8]
              },
              transition: 'all 0.2s'
            }}
          >
            {vendor.approved ? 'Suspend Account' : 'Approve Account'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default VendorDetails;
