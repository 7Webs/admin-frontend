import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../../api/apiwrapper';
import { toast } from 'react-toastify';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Chip,
    Card,
    CardMedia,
    Container,
    useTheme,
    IconButton,
} from '@mui/material';
import {
    CalendarToday,
    ShoppingCart,
    Person,
    Share as ShareIcon,
    PlayCircle as PlayCircleIcon
} from '@mui/icons-material';
import AnimatedLoader from '../../components/loaders/AnimatedLoader';
import { motion } from 'framer-motion';
import CouponAnalytics from './CouponAnalytics';

const CouponDetails = () => {
    const { id } = useParams();
    const [coupon, setCoupon] = useState(null);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        const fetchCouponDetails = async () => {
            try {
                const response = await apiService.get(`deals/${id}`);
                setCoupon(response.data);
            } catch (error) {
                toast.error('Error fetching coupon details');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCouponDetails();
    }, [id]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: coupon.title,
                    text: coupon.shortTagLine,
                    url: window.location.href,
                });
                toast.success('Coupon shared successfully!');
            } catch (error) {
                toast.error('Error sharing the coupon');
                console.error('Share failed:', error);
            }
        } else {
            toast.error('Web Share API is not supported in your browser.');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <AnimatedLoader />
            </Box>
        );
    }

    if (!coupon) {
        return (
            <Container maxWidth="lg">
                <Box p={3} textAlign="center">
                    <Typography variant="h5" color="error" sx={{ fontWeight: 600 }}>
                        Coupon not found
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            mb: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                        }}
                    >
                        <Grid container spacing={4}>
                            {/* Main Image Section */}
                            <Grid item xs={12} md={6}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="450"
                                        image={coupon.images[0] || 'https://via.placeholder.com/400'}
                                        alt={coupon.title}
                                        sx={{
                                            objectFit: 'cover',
                                            transition: '0.3s',
                                            '&:hover': {
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                    />
                                    {coupon.video && (
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                bottom: 16,
                                                right: 16,
                                                bgcolor: 'rgba(255,255,255,0.9)',
                                                '&:hover': { bgcolor: 'white' }
                                            }}
                                        >
                                            <PlayCircleIcon />
                                        </IconButton>
                                    )}
                                </Card>
                            </Grid>

                            {/* Details Section */}
                            <Grid item xs={12} md={6}>
                                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                                            {coupon.title}
                                        </Typography>
                                        <Box>
                                            <IconButton onClick={handleShare} sx={{ color: 'black' }}><ShareIcon /></IconButton>
                                        </Box>
                                    </Box>

                                    <Typography
                                        variant="h6"
                                        color="text.secondary"
                                        sx={{ mb: 3, fontWeight: 500 }}
                                    >
                                        {coupon.shortTagLine}
                                    </Typography>

                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 3,
                                        p: 2,
                                        bgcolor: theme.palette.primary.light,
                                        borderRadius: 2,
                                        color: '#fff'
                                    }}>
                                        <CalendarToday sx={{ mr: 1 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Available until: {new Date(coupon.availableUntil).toLocaleDateString()}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                        <Chip
                                            icon={<ShoppingCart />}
                                            label={`Max Purchase: ${coupon.maxPurchaseLimit}`}
                                            variant="outlined"
                                            sx={{
                                                borderRadius: '12px',
                                                px: 2,
                                                py: 2.5,
                                                borderColor: theme.palette.primary.main,
                                                color: theme.palette.primary.main,
                                                '& .MuiChip-icon': { color: theme.palette.primary.main }
                                            }}
                                        />
                                        <Chip
                                            icon={<Person />}
                                            label={`Per User: ${coupon.maxPurchasePerUser}`}
                                            variant="outlined"
                                            sx={{
                                                borderRadius: '12px',
                                                px: 2,
                                                py: 2.5,
                                                borderColor: theme.palette.secondary.main,
                                                color: theme.palette.secondary.main,
                                                '& .MuiChip-icon': { color: theme.palette.secondary.main }
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                            Features
                                        </Typography>
                                        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                                            {coupon.features}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                            Keywords
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {coupon.keywords.split(',').map((keyword, index) => (
                                                <Chip
                                                    key={index}
                                                    label={keyword.trim()}
                                                    sx={{
                                                        borderRadius: '8px',
                                                        bgcolor: theme.palette.grey[100],
                                                        '&:hover': { bgcolor: theme.palette.grey[200] }
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Description Section */}
                            <Grid item xs={12}>
                                <Box sx={{
                                    bgcolor: theme.palette.background.paper,
                                    p: 4,
                                    borderRadius: 3,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }}>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                                        Description
                                    </Typography>
                                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                                        {coupon.description}
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Analytics Section */}
                            <Grid item xs={12}>
                                <CouponAnalytics id={id} />
                            </Grid>
                        </Grid>
                    </Paper>
                </motion.div>
            </Box>
        </Container>
    );
};

export default CouponDetails;
