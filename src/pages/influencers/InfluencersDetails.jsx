import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Typography,
  Box,
  Avatar,
  Grid,
  Card,
  CardContent,
  Container,
  CircularProgress,
  IconButton,
  Stack,
  Chip,
  Divider,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
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
  Block,
  Delete,
  Star as StarIcon,
  Category,
} from "@mui/icons-material";
import { FaTiktok } from "react-icons/fa";
import { apiService } from "../../api/apiwrapper";
import { toast } from "react-toastify";
import { BsCheckCircleFill, BsGenderAmbiguous } from "react-icons/bs";

const influencerTypes = ["pico", "nano", "micro"];

const InfluencerDetails = () => {
  const { id } = useParams();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    action: null,
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await apiService.get(`user/${id}`);
      return response.data;
    },
  });

  const updateInfluencerTypeMutation = useMutation({
    mutationFn: ({ id, type }) =>
      apiService.patch(`user/influencertype/${id}/${type}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["user", id]);
      toast.success("Influencer type updated successfully");
    },
    onError: () => {
      toast.error("Failed to update influencer type");
    },
  });

  const handleApprove = async () => {
    try {
      await apiService.post(`admin/users/${id}/approve`);
      setConfirmDialog({ open: false, title: "", action: null });
      toast.success("Influencer approved successfully");
      queryClient.invalidateQueries(["user", id]);
    } catch (error) {
      console.error("Error approving influencer:", error);
      toast.error("Failed to approve influencer");
    }
  };

  const handleSuspend = async () => {
    try {
      await apiService.post(`admin/users/${id}/block`);
      setConfirmDialog({ open: false, title: "", action: null });
      toast.success("Influencer suspended successfully");
      queryClient.invalidateQueries(["user", id]);
    } catch (error) {
      console.error("Error suspending influencer:", error);
      toast.error("Failed to suspend influencer");
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.delete(`user/${id}`);
      setConfirmDialog({ open: false, title: "", action: null });
      toast.success("User Deleted Successfully");
      queryClient.invalidateQueries(["user", id]);
    } catch (error) {
      console.error("Error deleting influencer:", error);
      toast.error("Failed to delete influencer");
    }
  };

  const handleInfluencerTypeChange = (event) => {
    updateInfluencerTypeMutation.mutate({
      id,
      type: event.target.value,
    });
  };

  const openConfirmDialog = (title, action) => {
    setConfirmDialog({
      open: true,
      title,
      action,
    });
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

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>User not found</Typography>
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
        {/* Profile Header */}
        <Paper
          elevation={3}
          sx={{ mb: 4, borderRadius: 3, overflow: "hidden" }}
        >
          <Box
            sx={{
              p: 4,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.1
              )}, ${alpha(theme.palette.primary.main, 0.05)})`,
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  src={user.photo}
                  alt={user.name}
                  sx={{
                    width: 120,
                    height: 120,
                    border: `4px solid ${theme.palette.background.paper}`,
                  }}
                />
              </Grid>
              <Grid item xs>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                >
                  <Typography variant="h4" fontWeight={600}>
                    {user.name}
                  </Typography>
                  <Chip
                    label={user.approved ? "Approved" : "Pending"}
                    color={user.approved ? "success" : "warning"}
                    size="small"
                  />
                  {user.influencerCategory && (
                    <Chip
                      icon={<StarIcon />}
                      label={user.influencerCategory.toUpperCase()}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  {user.role}
                </Typography>
                <FormControl sx={{ mt: 2, minWidth: 200 }}>
                  <InputLabel>Influencer Type</InputLabel>
                  <Select
                    value={user.infuencerCategory || ""}
                    onChange={handleInfluencerTypeChange}
                    label="Influencer Type"
                  >
                    {influencerTypes.map((type) => (
                      <MenuItem
                        key={type}
                        value={type}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2}>
                  {!user?.approved && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<BsCheckCircleFill />}
                      onClick={() =>
                        openConfirmDialog(
                          "Are you sure you want to approve this influencer?",
                          handleApprove
                        )
                      }
                    >
                      Approve
                    </Button>
                  )}
                  {user?.approved && (
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Block />}
                      onClick={() =>
                        openConfirmDialog(
                          "Are you sure you want to suspend this influencer?",
                          handleSuspend
                        )
                      }
                    >
                      Suspend
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() =>
                      openConfirmDialog(
                        "Are you sure you want to delete this influencer?",
                        handleDelete
                      )
                    }
                  >
                    Delete
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Paper>

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
                  <PersonIcon
                    sx={{ mr: 1, color: theme.palette.primary.main }}
                  />
                  <Typography variant="h6" fontWeight={600}>
                    Basic Information
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography>{user.email}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography>{user.phone}</Typography>
                  </Box>
                  {user.birthDate && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CakeIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography>
                        {new Date(user.birthDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <BsGenderAmbiguous
                      sx={{ mr: 1, color: "text.secondary" }}
                    />
                    &nbsp;
                    <Typography>{user.gender}</Typography>
                  </Box>
                  {user.category && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Category sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography>{user.category.name}</Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: theme.shadows[3],
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Social Media Profiles
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {user.facebookProfileLink && (
                    <IconButton
                      href={user.facebookProfileLink}
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
                  {user.instagramProfileLink && (
                    <IconButton
                      href={user.instagramProfileLink}
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
                  {user.tiktokProfileLink && (
                    <IconButton
                      href={user.tiktokProfileLink}
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
                  {user.twitterProfileLink && (
                    <IconButton
                      href={user.twitterProfileLink}
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
                  {user.youtubeProfileLink && (
                    <IconButton
                      href={user.youtubeProfileLink}
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
                  {user.linkedinProfileLink && (
                    <IconButton
                      href={user.linkedinProfileLink}
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

          {/* Shop Information */}
          {user.owen && (
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[3] }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Shop Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Shop Name
                          </Typography>
                          <Typography variant="body1">
                            {user.owen.name}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Email
                          </Typography>
                          <Typography variant="body1">
                            {user.owen.email}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Address
                          </Typography>
                          <Typography variant="body1">
                            {user.owen.address}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Description
                          </Typography>
                          <Typography variant="body1">
                            {user.owen.description}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Subscription Status
                          </Typography>
                          <Typography variant="body1">
                            {user.owen.subscriptionState ||
                              "No active subscription"}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>

      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({ open: false, title: "", action: null })
        }
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmDialog({ open: false, title: "", action: null })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDialog.action}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InfluencerDetails;
