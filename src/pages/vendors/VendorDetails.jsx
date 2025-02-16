import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
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
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { FaTiktok } from "react-icons/fa";
import { apiService } from "../../api/apiwrapper";
import VendorAnalytics from "./VendorAnalytics";

const VendorDetails = () => {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState(0);
  const theme = useTheme();
  const queryClient = useQueryClient();

  // Dialog states
  const [subscriptionDialog, setSubscriptionDialog] = useState(false);
  const [collabsDialog, setCollabsDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [months, setMonths] = useState("");
  const [noOfCollabs, setNoOfCollabs] = useState("");

  const { data: vendor, isLoading } = useQuery({
    queryKey: ["vendor", id],
    queryFn: async () => {
      const response = await apiService.get(`shop/${id}`);
      return response.data;
    },
  });

  const { data: subscriptionPlans } = useQuery({
    queryKey: ["subscriptionPlans"],
    queryFn: async () => {
      const response = await apiService.get("/subscriptions");
      return response.data;
    },
  });

  const giveSubscriptionMutation = useMutation({
    mutationFn: (data) =>
      apiService.post("subscriptions/give-subscription", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["vendor", id]);
      setSubscriptionDialog(false);
      setSelectedPlan("");
      setMonths("");
    },
  });

  const addCollabsMutation = useMutation({
    mutationFn: ({ shopId, noOfCollabs }) =>
      apiService.post(`subscriptions/add-collabs/${shopId}/${noOfCollabs}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["vendor", id]);
      setCollabsDialog(false);
      setNoOfCollabs("");
    },
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSubscriptionSubmit = () => {
    giveSubscriptionMutation.mutate({
      planId: parseInt(selectedPlan),
      shopId: parseInt(id),
      months: parseInt(months),
    });
  };

  const handleCollabsSubmit = () => {
    addCollabsMutation.mutate({
      shopId: id,
      noOfCollabs: parseInt(noOfCollabs),
    });
  };

  const handleDelete = async () => {
    try {
      await apiService.delete(`/shop/${id}`);
      handleMenuClose();
      setConfirmDialog({ open: false, title: "", action: null });
      toast.success("Vendor suspended successfully");
    } catch (error) {
      console.error("Error suspending vendor:", error);
      toast.error("Error suspending vendor");
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
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
    <Box
      sx={{
        bgcolor: alpha(theme.palette.background.default, 0.98),
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: theme.shadows[3] }}>
          <Box
            sx={{
              p: 4,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.1
              )}, ${alpha(theme.palette.primary.main, 0.05)})`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Avatar
                src={vendor.logo}
                alt={vendor.name}
                sx={{
                  width: 100,
                  height: 100,
                  boxShadow: 3,
                  border: `4px solid ${theme.palette.background.paper}`,
                }}
              >
                {vendor.name?.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  {vendor.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip
                    label={vendor.approved ? "Active" : "Pending"}
                    color={vendor.approved ? "success" : "warning"}
                  />
                  <Chip
                    label={`Joined ${new Date(
                      vendor.createdAt
                    ).toLocaleDateString()}`}
                    variant="outlined"
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setSubscriptionDialog(true)}
                  >
                    Give Subscription
                  </Button>

                  {vendor.subscriptionState === "active" && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setCollabsDialog(true)}
                    >
                      Add Colabs
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>

        <Dialog
          open={subscriptionDialog}
          onClose={() => setSubscriptionDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Give Subscription</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Current Plan:{" "}
                {vendor.activeSubscriptionPlan?.name || "No active plan"}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Select a new subscription plan:
              </Typography>
            </Box>
            <RadioGroup
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              {subscriptionPlans?.map((plan) => (
                <FormControlLabel
                  key={plan.id}
                  value={plan.id.toString()}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {plan.name} - ${plan.amount}/month
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {plan.description}
                      </Typography>
                      <Typography variant="caption" color="primary">
                        Max Deals: {plan.maxDeals} • Trial Days:{" "}
                        {plan.trialDays}
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 2 }}
                />
              ))}
            </RadioGroup>
            <TextField
              fullWidth
              label="Number of Months"
              type="number"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              sx={{ mt: 2 }}
              helperText="Enter the duration for this subscription"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSubscriptionDialog(false)}>Cancel</Button>
            <Button
              onClick={handleSubscriptionSubmit}
              variant="contained"
              disabled={!selectedPlan || !months}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={collabsDialog} onClose={() => setCollabsDialog(false)}>
          <DialogTitle>Add Collabs</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Number of Collabs"
              type="number"
              value={noOfCollabs}
              onChange={(e) => setNoOfCollabs(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCollabsDialog(false)}>Cancel</Button>
            <Button onClick={handleCollabsSubmit} variant="contained">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            mb: 4,
            "& .MuiTab-root": {
              fontWeight: 600,
              fontSize: "1.1rem",
              minWidth: 120,
              textTransform: "none",
            },
            "& .Mui-selected": {
              color: theme.palette.primary.main,
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Analytics" />
        </Tabs>

        {currentTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: theme.shadows[3],
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <BusinessIcon
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    />
                    <Typography variant="h6" fontWeight={600}>
                      Business Details
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Category
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {vendor.category?.name}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Subscription
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {vendor.activeSubscriptionPlan?.name || "No Plan"}
                            <Chip
                              size="small"
                              label={vendor.subscriptionState}
                              sx={{ ml: 1 }}
                            />
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Plan Activated At
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {vendor.planActivatedAt
                              ? new Date(
                                  vendor.planActivatedAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Subscription Ends At
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {vendor.subscriptionEndAt
                              ? new Date(
                                  vendor.subscriptionEndAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Monthly Collabs
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {vendor.monthlyCollabs || 0}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Remaining Collabs
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {vendor.remainingCollabs || 0}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: theme.shadows[3],
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PersonIcon
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    />
                    <Typography variant="h6" fontWeight={600}>
                      Owner Information
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography>{vendor.owner?.name}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography>{vendor.owner?.phone}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography>{vendor.owner?.email}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[3] }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <DescriptionIcon
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    />
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
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
                          bgcolor: alpha("#1877F2", 0.1),
                          color: "#1877F2",
                          "&:hover": {
                            bgcolor: "#1877F2",
                            color: "white",
                            transform: "translateY(-4px)",
                          },
                          transition: "all 0.2s",
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
                          bgcolor: alpha("#E4405F", 0.1),
                          color: "#E4405F",
                          "&:hover": {
                            bgcolor: "#E4405F",
                            color: "white",
                            transform: "translateY(-4px)",
                          },
                          transition: "all 0.2s",
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
                          bgcolor: alpha("#000000", 0.1),
                          color: "#000000",
                          "&:hover": {
                            bgcolor: "#000000",
                            color: "white",
                            transform: "translateY(-4px)",
                          },
                          transition: "all 0.2s",
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
                          bgcolor: alpha("#1DA1F2", 0.1),
                          color: "#1DA1F2",
                          "&:hover": {
                            bgcolor: "#1DA1F2",
                            color: "white",
                            transform: "translateY(-4px)",
                          },
                          transition: "all 0.2s",
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
                          bgcolor: alpha("#FF0000", 0.1),
                          color: "#FF0000",
                          "&:hover": {
                            bgcolor: "#FF0000",
                            color: "white",
                            transform: "translateY(-4px)",
                          },
                          transition: "all 0.2s",
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
                          bgcolor: alpha("#0A66C2", 0.1),
                          color: "#0A66C2",
                          "&:hover": {
                            bgcolor: "#0A66C2",
                            color: "white",
                            transform: "translateY(-4px)",
                          },
                          transition: "all 0.2s",
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

        {currentTab === 1 && <VendorAnalytics vendorId={id} />}

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color={vendor.approved ? "error" : "success"}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: theme.shadows[4],
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: theme.shadows[8],
              },
              transition: "all 0.2s",
            }}
            onClick={() => {
              if (vendor.approved) {
                handleDelete();
              } else {
                handleApproveVendor();
              }
            }}
          >
            {vendor.approved ? "Delete Account" : "Approve Account"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default VendorDetails;
