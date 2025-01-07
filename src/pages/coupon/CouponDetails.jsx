import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiService } from "../../api/apiwrapper";
import { toast } from "react-toastify";
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
  Link,
  Stack,
  Divider,
  Button,
  ImageList,
  ImageListItem,
} from "@mui/material";
import {
  CalendarToday,
  ShoppingCart,
  Person,
  Share as ShareIcon,
  PlayCircle as PlayCircleIcon,
  Facebook,
  Instagram,
  YouTube,
  LinkedIn,
  Twitter,
  Check,
  Close,
  AccessTime,
} from "@mui/icons-material";
import AnimatedLoader from "../../components/loaders/AnimatedLoader";
import { motion } from "framer-motion";
import CouponAnalytics from "./CouponAnalytics";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CouponDetails = () => {
  const { id } = useParams();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: (id) =>
      apiService.patch(`deals-redeem/approve/${id}`, {
        status: "approved",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      toast.success("Coupon approved successfully");
      // Refresh coupon details
      fetchCouponDetails();
    },
    onError: (error) => {
      toast.error("Failed to approve coupon");
    },
  });

  const fetchCouponDetails = async () => {
    try {
      const response = await apiService.get(`/deals-redeem/${id}`);
      setCoupon(response.data);
    } catch (error) {
      toast.error("Error fetching coupon details");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCouponDetails();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: coupon?.deal?.title,
          text: coupon?.deal?.shortTagLine,
          url: window.location.href,
        });
        toast.success("Coupon shared successfully!");
      } catch (error) {
        toast.error("Error sharing the coupon");
        console.error("Share failed:", error);
      }
    } else {
      toast.error("Web Share API is not supported in your browser.");
    }
  };

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error approving coupon:", error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
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
              background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            <Grid container spacing={4}>
              {/* Main Image Section */}
              <Grid item xs={12} md={6}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="450"
                    image={
                      coupon.deal?.images[0] ||
                      "https://via.placeholder.com/400"
                    }
                    alt={coupon.deal?.title}
                    sx={{
                      objectFit: "cover",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                  {coupon.deal?.video && (
                    <IconButton
                      sx={{
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                        bgcolor: "rgba(255,255,255,0.9)",
                        "&:hover": { bgcolor: "white" },
                      }}
                    >
                      <PlayCircleIcon />
                    </IconButton>
                  )}
                </Card>
              </Grid>

              {/* Details Section */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                      }}
                    >
                      {coupon.deal?.title}
                    </Typography>
                    <Box>
                      <IconButton onClick={handleShare} sx={{ color: "black" }}>
                        <ShareIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Chip
                      label={`Code: ${coupon.couponCode}`}
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    />
                    <Chip
                      icon={coupon.used ? <Check /> : <Close />}
                      label={`Used: ${coupon.used ? "Yes" : "No"}`}
                      color={coupon.used ? "success" : "error"}
                    />
                    <Chip
                      icon={<AccessTime />}
                      label={`Status: ${coupon.status}`}
                      color={
                        coupon.status === "approved" ? "success" : "warning"
                      }
                    />
                  </Stack>

                  {coupon.status === "pending_approval" && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleApprove}
                      sx={{ mb: 2 }}
                    >
                      Approve Coupon
                    </Button>
                  )}

                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 3, fontWeight: 500 }}
                  >
                    {coupon.deal?.shortTagLine}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                      p: 2,
                      bgcolor: theme.palette.primary.light,
                      borderRadius: 2,
                      color: "#fff",
                    }}
                  >
                    <CalendarToday sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Available until:{" "}
                      {new Date(
                        coupon.deal?.availableUntil
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      User Details
                    </Typography>
                    <Stack spacing={1}>
                      <Typography>
                        <strong>Name:</strong> {coupon.user?.name}
                      </Typography>
                      <Typography>
                        <strong>Email:</strong> {coupon.user?.email}
                      </Typography>
                      <Typography>
                        <strong>Phone:</strong> {coupon.user?.phone}
                      </Typography>
                      <Typography>
                        <strong>Gender:</strong> {coupon.user?.gender}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 1 }}>
                        {coupon.user?.facebookProfileLink && (
                          <Link
                            href={coupon.user.facebookProfileLink}
                            target="_blank"
                          >
                            <IconButton>
                              <Facebook />
                            </IconButton>
                          </Link>
                        )}
                        {coupon.user?.instagramProfileLink && (
                          <Link
                            href={coupon.user.instagramProfileLink}
                            target="_blank"
                          >
                            <IconButton>
                              <Instagram />
                            </IconButton>
                          </Link>
                        )}
                        {coupon.user?.youtubeProfileLink && (
                          <Link
                            href={coupon.user.youtubeProfileLink}
                            target="_blank"
                          >
                            <IconButton>
                              <YouTube />
                            </IconButton>
                          </Link>
                        )}
                        {coupon.user?.linkedinProfileLink && (
                          <Link
                            href={coupon.user.linkedinProfileLink}
                            target="_blank"
                          >
                            <IconButton>
                              <LinkedIn />
                            </IconButton>
                          </Link>
                        )}
                        {coupon.user?.twitterProfileLink && (
                          <Link
                            href={coupon.user.twitterProfileLink}
                            target="_blank"
                          >
                            <IconButton>
                              <Twitter />
                            </IconButton>
                          </Link>
                        )}
                      </Box>
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Additional Information
                    </Typography>
                    <Typography variant="body1">
                      {coupon.additionalInfo}
                    </Typography>
                    {coupon.socialMediaLink && (
                      <>
                        <Link
                          href={coupon.socialMediaLink}
                          target="_blank"
                          sx={{ display: "block", mt: 1 }}
                        >
                          Social Media Post
                        </Link>
                        {coupon.image && (
                          <Box sx={{ mt: 2 }}>
                            <img
                              src={coupon.image}
                              alt="Social media post"
                              style={{
                                maxWidth: "100%",
                                height: "auto",
                                borderRadius: "8px",
                              }}
                            />
                          </Box>
                        )}
                      </>
                    )}
                    {coupon.image && (
                      <ImageList sx={{ mt: 2 }} cols={3}>
                        {coupon.image.map((image, index) => (
                          <ImageListItem key={index}>
                            <img
                              src={image}
                              height={200}
                              alt={`Image ${index + 1}`}
                              loading="lazy"
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    )}
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Shop Details
                    </Typography>
                    <Typography>
                      <strong>Name:</strong> {coupon.deal?.shop?.name}
                    </Typography>
                    <Typography>
                      <strong>Email:</strong> {coupon.deal?.shop?.email}
                    </Typography>
                    <Typography>
                      <strong>Address:</strong> {coupon.deal?.shop?.address}
                    </Typography>
                    <Typography>
                      <strong>Category:</strong>{" "}
                      {coupon.deal?.shop?.category?.name}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Description Section */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    p: 4,
                    borderRadius: 3,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Deal Description
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    {coupon.deal?.description}
                  </Typography>
                </Box>
              </Grid>

              {/* Analytics Section */}
              <Grid item xs={12}>
                <CouponAnalytics id={coupon.deal?.id} />
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default CouponDetails;
