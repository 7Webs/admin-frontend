import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
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
  CheckCircle as ApproveIcon,
  Block as RejectIcon,
  Flag as FlagIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

// Mock data for content items
const mockContent = [
  {
    id: 1,
    title: 'Summer Fashion Collection Review',
    type: 'review',
    influencer: 'Sarah Johnson',
    platform: 'Instagram',
    status: 'pending',
    submittedDate: '2024-01-15',
    contentUrl: 'https://example.com/content1',
    flags: ['Promotional', 'Brand Guidelines'],
  },
  {
    id: 2,
    title: 'Tech Gadget Unboxing',
    type: 'video',
    influencer: 'Mike Chen',
    platform: 'YouTube',
    status: 'approved',
    submittedDate: '2024-01-14',
    contentUrl: 'https://example.com/content2',
    flags: [],
  },
  {
    id: 3,
    title: 'Beauty Product Demo',
    type: 'story',
    influencer: 'Emma Davis',
    platform: 'TikTok',
    status: 'rejected',
    submittedDate: '2024-01-13',
    contentUrl: 'https://example.com/content3',
    flags: ['Inappropriate Content'],
  },
];

const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
};

const CouponManagement = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedContent, setSelectedContent] = useState(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleViewContent = (content) => {
    setSelectedContent(content);
    setReviewDialog(true);
  };

  const handleCloseDialog = () => {
    setReviewDialog(false);
    setSelectedContent(null);
    setReviewNote('');
  };

  const handleStatusChange = (content, newStatus) => {
    // In a real app, this would update the backend
    console.log(`Content ${content.id} status changed to ${newStatus}`);
    handleCloseDialog();
  };

  const filteredContent = mockContent.filter((content) => {
    if (filterStatus === 'all') return true;
    return content.status === filterStatus;
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Content Moderation
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Review
              </Typography>
              <Typography variant="h4">
                {mockContent.filter((c) => c.status === 'pending').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Approved Today
              </Typography>
              <Typography variant="h4">
                {mockContent.filter((c) => c.status === 'approved').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Flagged Content
              </Typography>
              <Typography variant="h4">
                {mockContent.filter((c) => c.flags.length > 0).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Content Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <TextField
                      select
                      label="Filter by Status"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      sx={{ minWidth: 200 }}
                    >
                      <MenuItem value="all">All Content</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Influencer</TableCell>
                      <TableCell>Platform</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Submitted Date</TableCell>
                      <TableCell>Flags</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredContent.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell>{content.title}</TableCell>
                        <TableCell>
                          <Chip
                            label={content.type}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{content.influencer}</TableCell>
                        <TableCell>{content.platform}</TableCell>
                        <TableCell>
                          <Chip
                            label={content.status}
                            color={statusColors[content.status]}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{content.submittedDate}</TableCell>
                        <TableCell>
                          {content.flags.map((flag) => (
                            <Chip
                              key={flag}
                              label={flag}
                              size="small"
                              icon={<FlagIcon />}
                              color="error"
                              sx={{ mr: 0.5 }}
                            />
                          ))}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleViewContent(content)}
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

      {/* Review Dialog */}
      <Dialog
        open={reviewDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedContent && (
          <>
            <DialogTitle>Review Content</DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6">{selectedContent.title}</Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Submitted by {selectedContent.influencer} on {selectedContent.platform}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Review Notes"
                    multiline
                    rows={4}
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                startIcon={<RejectIcon />}
                color="error"
                onClick={() => handleStatusChange(selectedContent, 'rejected')}
              >
                Reject
              </Button>
              <Button
                startIcon={<ApproveIcon />}
                color="success"
                onClick={() => handleStatusChange(selectedContent, 'approved')}
              >
                Approve
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default CouponManagement;
